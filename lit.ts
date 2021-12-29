// import LitJsSdk from 'lit-js-sdk'
import * as LitJsSdk from "lit-js-sdk";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";

/**
 * This function encodes into base 64.
 * it's useful for storing symkeys and files in ceramic
 * @param {Uint8Array} input a file or any data
 * @returns {string} returns a string of b64
 */
export function encodeb64(uintarray: any) {
  const b64 = Buffer.from(uintarray).toString("base64");
  return b64;
}

/**
 * This function converts blobs to base 64.
 * for easier storage in ceramic
 * @param {Blob} blob what you'd like to encode
 * @returns {Promise<String>} returns a string of b64
 */
function blobToBase64(blob: Blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () =>
      resolve(
        // @ts-ignore
        reader.result.replace("data:application/octet-stream;base64,", "")
      );
    reader.readAsDataURL(blob);
  });
}

/**
 * This function decodes from base 64.
 * it's useful for decrypting symkeys and files in ceramic
 * @param {blob} input a b64 string
 * @returns {string} returns the data as a string
 */
export function decodeb64(b64String: any) {
  return new Uint8Array(Buffer.from(b64String, "base64"));
}

/**
 * encrypts a message with Lit returns required details
 * this obfuscates data such that it can be stored on ceramic without
 * non-permissioned eyes seeing what the data is
 * @param {blob} auth authentication from wallet
 * @param {String} aStringThatYouWishToEncrypt the clear text you'd like encrypted
 * @returns {Promise<Array<any>>} returns, in this order: encryptedZipBase64, encryptedSymmetricKeyBase64, accessControlConditions, chain
 */
export async function _encryptWithLit(
  auth: any[],
  aStringThatYouWishToEncrypt: String
): Promise<Array<any>> {
  const chain = "ethereum";
  let authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: chain
  });
  const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
    aStringThatYouWishToEncrypt
  );

  // currently only the maker of the streamID/data has access to it thereafter
  const accessControlConditions = [
    {
      contractAddress: auth[2],
      standardContractType: "",
      chain: chain,
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "10000000000000"
      }
    }
  ];

  const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig: authSig,
    chain
  });

  const encryptedZipBase64 = await blobToBase64(encryptedZip);
  const encryptedSymmetricKeyBase64 = encodeb64(encryptedSymmetricKey);

  return [
    encryptedZipBase64,
    encryptedSymmetricKeyBase64,
    accessControlConditions,
    chain
  ];
}

/**
 * decrypt encrypted zip and symmetric key using the lit protocol
 * @param {Uint8Array} encryptedZip encrypted data that will be converted into a string
 * @param {Uint8Array} encryptedSymmKey symmetric key
 * @param {Uint8Array} accessControlConditions conditions that determine access
 * @returns {Promise<string>} promise with the decrypted string
 */

export async function _decryptWithLit(
  encryptedZip: Uint8Array,
  encryptedSymmKey: Uint8Array,
  accessControlConditions: Array<any>,
  chain: string
): Promise<String> {
  let authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: chain
  });
  // encrypted blob, sym key
  console.log("encryptedSymKey", encryptedSymmKey);
  const toDecrypt = uint8ArrayToString(encryptedSymmKey, "base16");
  console.log("toDecrypt", toDecrypt);
  // decrypt the symmetric key
  const decryptedSymmKey = await window.litNodeClient.getEncryptionKey({
    accessControlConditions,
    toDecrypt,
    chain,
    authSig
  });
  console.log("decryptedSymKey", decryptedSymmKey);

  // decrypt the files
  const decryptedFiles = await LitJsSdk.decryptZip(
    new Blob([encryptedZip]),
    decryptedSymmKey
  );
  const decryptedString = await decryptedFiles["string.txt"].async("text");
  return decryptedString;
}
