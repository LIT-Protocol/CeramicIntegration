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
export function blobToBase64(blob: Blob) {
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
 * @param {String} aStringThatYouWishToEncrypt the clear text you'd like encrypted
 * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
 * @param {String} chain the chain you'd like to use for checking the access control conditions
 * @param {String} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
 * @returns {Promise<Array<any>>} returns, in this order: encryptedZipBase64, encryptedSymmetricKeyBase64, accessControlConditions, chain
 */
export async function _encryptWithLit(
  aStringThatYouWishToEncrypt: String,
  accessControlConditions: Array<Object>,
  chain: String,
  accessControlConditionType: String = "accessControlConditions"
): Promise<Array<any>> {
  let authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain,
  });
  const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
    aStringThatYouWishToEncrypt
  );

  let encryptedSymmetricKey;

  if (accessControlConditionType === "accessControlConditions") {
    encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig: authSig,
      chain,
      permanant: false,
    });
  } else if (accessControlConditionType === "evmContractConditions") {
    encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      evmContractConditions: accessControlConditions,
      symmetricKey,
      authSig: authSig,
      chain,
      permanant: false,
    });
  } else {
    throw new Error(
      "accessControlConditionType must be accessControlConditions or evmContractConditions"
    );
  }
  const encryptedZipBase64 = await blobToBase64(encryptedZip);
  const encryptedSymmetricKeyBase64 = encodeb64(encryptedSymmetricKey);

  return [
    encryptedZipBase64,
    encryptedSymmetricKeyBase64,
    accessControlConditions,
    chain,
    accessControlConditionType,
  ];
}

/**
 * decrypt encrypted zip and symmetric key using the lit protocol
 * @param {Uint8Array} encryptedZip encrypted data that will be converted into a string
 * @param {Uint8Array} encryptedSymmKey symmetric key
 * @param {Array<any>} accessControlConditions conditions that determine access
 * @param {String} chain the chain you'd like to use for checking the access control conditions
 * @param {String} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
 * @returns {Promise<string>} promise with the decrypted string
 */

export async function _decryptWithLit(
  encryptedZip: Uint8Array,
  encryptedSymmKey: Uint8Array,
  accessControlConditions: Array<any>,
  chain: string,
  accessControlConditionType: String = "accessControlConditions"
): Promise<String> {
  let authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain,
  });
  // encrypted blob, sym key
  console.log("encryptedSymKey", encryptedSymmKey);
  const toDecrypt = uint8ArrayToString(encryptedSymmKey, "base16");
  console.log("toDecrypt", toDecrypt);
  // decrypt the symmetric key
  let decryptedSymmKey;
  if (accessControlConditionType === "accessControlConditions") {
    decryptedSymmKey = await window.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt,
      chain,
      authSig,
    });
  } else if (accessControlConditionType === "evmContractConditions") {
    decryptedSymmKey = await window.litNodeClient.getEncryptionKey({
      evmContractConditions: accessControlConditions,
      toDecrypt,
      chain,
      authSig,
    });
  }
  console.log("decryptedSymKey", decryptedSymmKey);

  // decrypt the files
  const decryptedFiles = await LitJsSdk.decryptZip(
    new Blob([encryptedZip]),
    decryptedSymmKey
  );
  const decryptedString = await decryptedFiles["string.txt"].async("text");
  return decryptedString;
}

// litCeramicIntegration.saveEncryptionKey({
//   accessControlConditions: newAccessControlConditions,
//   encryptedSymmetricKey,
//   authSig,
//   chain,
//   permanant: false,
// });
export async function _saveEncryptionKey(
  newAccessControlConditions: Array<any>,
  encryptedSymmetricKey: Uint8Array,
  chain: String
): Promise<String> {
  let authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain,
  });
  // encrypted blob, sym key
  // console.log("encryptedSymKey entered: ", encryptedSymmetricKey);
  // console.log("authSig: ", authSig);

  // const newAccessControlConditions = [
  //   {
  //     contractAddress: '',
  //     standardContractType: '',
  //     chain: 'polygon',
  //     method: '',
  //     parameters: [
  //       ':userAddress',
  //     ],
  //     returnValueTest: {
  //       comparator: '=',
  //       value: '0x0Db0448c95cad6D82695aC27022D20633C81b387'
  //     },
  //   },
  // ]

  const newEncryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey(
    {
      accessControlConditions: newAccessControlConditions,
      encryptedSymmetricKey,
      authSig,
      chain,
      permanant: false,
    }
  );
  console.log("updated the access control condition");
  return newEncryptedSymmetricKey;
}
