import { DID } from 'dids'
import ThreeIdResolver from '@ceramicnetwork/3id-did-resolver'
import KeyDidResolver from 'key-did-resolver'

import { createCeramic } from './ceramic'
import { createIDX } from './idx'
import { getProvider } from './wallet'
import type { ResolverRegistry } from 'did-resolver'

import { TileDocument } from '@ceramicnetwork/stream-tile'
import * as LitJsSdk from 'lit-js-sdk'
import { encodeb64, decodeb64 } from './lit'


declare global {
  interface Window {
    did?: DID
  }
}

const ceramicPromise = createCeramic()
let streamID = '' 
let encryptedZipG: any
let symmetricKeyG: any

const encryptWithLit = async (
  auth: any[],
  aStringThatYouWishToEncrypt: String
): Promise<Array<any>> => {
  // using eth here b/c fortmatic
  const chain = 'ethereum'
  // @ts-ignore
  console.log('secret to encrypt: ', aStringThatYouWishToEncrypt)

  let authSign = await LitJsSdk.checkAndSignAuthMessage({
    chain: chain,
  })

  const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
    aStringThatYouWishToEncrypt
  )
    .then(function (response: any[]) {
      const symmetricKey = response[1]

      const accessControlConditions = [
        {
          contractAddress: '0x20598860Da775F63ae75E1CD2cE0D462B8CEe4C7',
          standardContractType: '',
          chain: 'ethereum',
          method: 'eth_getBalance',
          parameters: [':userAddress', 'latest'],
          returnValueTest: {
            comparator: '>=',
            value: '10000000000000',
          },
        },
      ]

      const encryptedSymmetricKey = window.litNodeClient.saveEncryptionKey({
        accessControlConditions,
        symmetricKey,
        authSign,
        chain,
      })
      return encryptedSymmetricKey
    })
    .then(function (encryptedSymmetricKey: any) {
      console.log('finished with save encrypt phase: ', encryptedSymmetricKey)
    })

  return [encryptedZip, symmetricKey]
}

const decryptWithLit = async (auth: any[], toDecrypt: any[]): Promise<String> => {
  const decryptedFiles = await LitJsSdk.decryptZip(toDecrypt[0], toDecrypt[1])
  const decryptedString = await decryptedFiles['string.txt'].async('text')
  return decryptedString
}

// Encode + Decode Functions to deal with base 64 encoding for zip file
const encoded = async (toEncode: any): Promise<String> => {
  const encode = await encodeb64(toEncode)
  return encode
}
const decoded = async (toDecode: String): Promise<String> => {
  const decode = await decodeb64(toDecode)
  return decode
}

const writeCeramic = async (auth: any[], toBeWritten: any[]): Promise<String> => {
  if (auth) {
    const authReturn = auth
    const ceramic = authReturn[1]
    const [zip, sym] = await Promise.all([toBeWritten[0], toBeWritten[1]])
    const doc = await TileDocument.create(
      ceramic,
      { encryptedZip: zip, symKey: sym },
      {
        // controllers: [concatId],
        family: 'doc simpsonss family',
      }
    )
    return doc.id.toString()
  } else {
    console.error('Failed to authenticate in ceramic read')
    updateAlert('danger', 'danger in reading of ceramic')
    return 'whoopsies'
  }
}

const authenticate = async (): Promise<Array<any>> => {
  const [ceramic, provider] = await Promise.all([ceramicPromise, getProvider()])
  const keyDidResolver = KeyDidResolver.getResolver()
  const threeIdResolver = ThreeIdResolver.getResolver(ceramic)
  const resolverRegistry: ResolverRegistry = {
    ...threeIdResolver,
    ...keyDidResolver,
  }
  const did = new DID({
    provider: provider,
    resolver: resolverRegistry,
  })

  updateAlert('success', `Successfully connected to wallet`)
  await did.authenticate()
  await ceramic.setDID(did)
  const idx = createIDX(ceramic)
  window.did = ceramic.did
  return [idx.id, ceramic]
}

const readCeramic = async (auth: any[], streamId: String): Promise<string> => {
  if (auth) {
    const authReturn = auth
    const ceramic = authReturn[1]
    const stream = await ceramic.loadStream(streamId)
    return stream.content
  } else {
    console.error('Failed to authenticate in ceramic read')
    updateAlert('danger', 'danger in reading of ceramic')
    return 'error'
  }
}

const updateAlert = (status: string, message: string) => {
  const alert = document.getElementById('alerts')

  if (alert !== null) {
    alert.textContent = message
    alert.classList.add(`alert-${status}`)
    alert.classList.remove('hide')
    setTimeout(() => {
      alert.classList.add('hide')
    }, 5000)
  }
}


document.addEventListener('DOMContentLoaded', function () {
  // load lit client
  console.log('Connecting to Lit Node...')
  const client = new LitJsSdk.LitNodeClient()
  client.connect()
  window.litNodeClient = client
})

document.getElementById('readCeramic')?.addEventListener('click', () => {
  authenticate().then((authReturn) => {
    if (streamID === '') {
      console.log(streamID)
      updateAlert('danger', `Error, please write to ceramic first so a stream can be read`)
    } else {
      const read = readCeramic(authReturn, streamID)
        .then(function (resp) {
          updateAlert('success', `Successful Read of Stream: ${JSON.stringify(resp.toString())}`)
          return resp
        })
        .then(function (response) {
          const jason = JSON.stringify(response)
          // @ts-ignore
          document.getElementById('stream').innerText = jason
          const enZip = response['symKey']
          const deZip = decoded(enZip)
          const enSym = response['encryptedZip']
          const deSym = decoded(enSym)
          return [deZip, deSym]
        })
        .then(function (decryptThis) {
          const itIsDecrypted = decryptWithLit(authReturn, decryptThis).then(function (response) {
            // @ts-ignore
            document.getElementById('decryption').innerText = response.toString()
            updateAlert('success', `Successfully Decrypted`)

            return response.toString()
          })
        })
      console.log(read)
    }
  })
})

document.getElementById('encryptLit')?.addEventListener('click', () => {
  authenticate().then((authReturn) => {
    // @ts-ignore
    const stringToEncrypt = document.getElementById('secret').value

    const itIsEncrypted = encryptWithLit(authReturn, stringToEncrypt)
      .then(function (response) {
        encryptedZipG = response[0]
        symmetricKeyG = response[1]
        updateAlert('success', `Successfully Encrypted`)
        return response
      })
      .then(function (zipAndSymKey) {
        const enZip = encoded(zipAndSymKey[0])
        const enSymKey = encoded(zipAndSymKey[1])
        return [enZip, enSymKey]
      })
      .then((zipAndSymKeyN64) => {
        writeCeramic(authReturn, zipAndSymKeyN64).then(function (response) {
          streamID = response.toString()
          updateAlert('success', `Successful Write to streamID: ${response.toString()}`)
          // @ts-ignore
          document.getElementById('stream').innerText = response.toString()
          return response.toString()
        })
      })
    console.log(itIsEncrypted)
  })
})

document.getElementById('decryptLit')?.addEventListener('click', () => {
  authenticate().then((authReturn) => {
    if (encryptedZipG === undefined) {
      updateAlert('danger', `Encrypt something first please`)
    } else {
      const itIsDecrypted = decryptWithLit(authReturn).then(function (response) {
        // @ts-ignore
        document.getElementById('decryption').innerText = response.toString()
        updateAlert('success', `Successfully Decrypted`)

        return response.toString()
      })
    }
  })
})

document.getElementById('bauth')?.addEventListener('click', () => {
  document.getElementById('loader')?.classList.remove('hide')
  authenticate().then(
    (authReturn) => {
      const id = authReturn[0] as String
      const userDid = document.getElementById('userDID')
      const concatId = id.split('did:3:')[1]
      if (userDid !== null) {
        userDid.textContent = `${concatId.slice(0, 4)}...${concatId.slice(
          concatId.length - 4,
          concatId.length
        )}`
      }
      updateAlert('success', `Connected with ${id}`)

      document.getElementById('loader')?.classList.add('hide')
      document.getElementById('bauth')?.classList.add('hide')
      document.getElementById('instructions')?.classList.remove('hide')
    },
    (err) => {
      console.error('Failed to authenticate:', err)
      updateAlert('danger', err)
      document.getElementById('loader')?.classList.add('hide')
    }
  )
})
