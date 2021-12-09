// import LitJsSdk from 'lit-js-sdk'
import * as LitJsSdk from 'lit-js-sdk'
import { TileDocument } from '@ceramicnetwork/stream-tile'

export async function say_hi(hi: String) {
  console.log(hi)
}
//var blob = new Blob(['Welcome to <b>base64.guru</b>!'], {type: 'text/html'});

export async function encodeb64(blob: any) {
  const b64 = btoa(blob)
  return b64
}

export async function decodeb64(b64String: any) {
  var html = atob(b64String)
  const htmlwbrack = `[${html}]`
  return htmlwbrack
}

// -----
// -----
// Encrypt and Write to Ceramic
// -----
export async function encryptAndWrite(auth: any[], stringToEncrypt: String) {
  const encrypted = encryptWithLit(auth, stringToEncrypt)
  // writeToCeramic(auth, encrypted)
}

// -----
// -----
// Decrypt and Read
// -----

// -----
// -----
// Lit Encrypt / Decrypt
// -----

const encryptWithLit = async (
  auth: any[],
  aStringThatYouWishToEncrypt: String
): Promise<Array<any>> => {
  // using eth here b/c fortmatic
  const chain = 'ethereum'
  let authSign = await LitJsSdk.checkAndSignAuthMessage({
    chain: chain,
  })
  const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
    aStringThatYouWishToEncrypt
  )
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
  console.log('passing encryptedZip, symmetricKey for now---')
  return [encryptedZip, symmetricKey]
}

// -----
// -----
// Ceramic
// -----

export async function writeToCeramic(auth: any[], encryptedString: String) {
  if (auth) {
    const authReturn = auth
    // const id = authReturn[0]
    const ceramic = authReturn[1]
    const doc = await TileDocument.create(
      ceramic,
      { foo: encryptedString },
      {
        // controllers: [concatId],
        family: 'doc simpsonss family',
      }
    )
    return doc.id.toString()
  } else {
    console.error('Failed to authenticate in ceramic read')
    return 'whoopsies'
  }
}
// -----

export async function encrypt_string() {
  // using eth here b/c fortmatic
  const chain = 'ethereum'
  console.log('eth encryptions ')
  const aStringThatYouWishToEncrypt = 'this is my secret, hold if for me please'
  let authSign = await LitJsSdk.checkAndSignAuthMessage({
    chain: chain,
  })
  const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
    aStringThatYouWishToEncrypt
  )

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
