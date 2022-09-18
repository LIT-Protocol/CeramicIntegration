import { AllLitChainsKeys } from "lit-js-sdk/dist/types";
/**
 * This function encodes into base 64.
 * it's useful for storing symkeys and files in ceramic
 * @param {Uint8Array} input a file or any data
 * @returns {string} returns a string of b64
 */
export declare function encodeb64(uintarray: any): string;
/**
 * This function converts blobs to base 64.
 * for easier storage in ceramic
 * @param {Blob} blob what you'd like to encode
 * @returns {Promise<string>} returns a string of b64
 */
export declare function blobToBase64(blob: Blob): Promise<unknown>;
/**
 * This function decodes from base 64.
 * it's useful for decrypting symkeys and files in ceramic
 * @param {blob} input a b64 string
 * @returns {string} returns the data as a string
 */
export declare function decodeb64(b64String: any): Uint8Array;
/**
 * encrypts a message with Lit returns required details
 * this obfuscates data such that it can be stored on ceramic without
 * non-permissioned eyes seeing what the data is
 * @param {string} aStringThatYouWishToEncrypt the clear text you'd like encrypted
 * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
 * @param {string} chain the chain you'd like to use for checking the access control conditions
 * @param {string} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
 * @returns {Promise<Array<any>>} returns, in this order: encryptedZipBase64, encryptedSymmetricKeyBase64, accessControlConditions, chain
 */
export declare function _encryptWithLit(aStringThatYouWishToEncrypt: string, accessControlConditions: Array<Object>, chain: AllLitChainsKeys, accessControlConditionType?: string): Promise<Array<any>>;
/**
 * decrypt encrypted zip and symmetric key using the lit protocol
 * @param {Uint8Array} encryptedZip encrypted data that will be converted into a string
 * @param {Uint8Array} encryptedSymmKey symmetric key
 * @param {Array<any>} accessControlConditions conditions that determine access
 * @param {string} chain the chain you'd like to use for checking the access control conditions
 * @param {string} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
 * @returns {Promise<string>} promise with the decrypted string
 */
export declare function _decryptWithLit(encryptedZip: Uint8Array, encryptedSymmKey: Uint8Array, accessControlConditions: Array<any>, chain: AllLitChainsKeys, accessControlConditionType?: string): Promise<string>;
export declare function _saveEncryptionKey(newAccessControlConditions: Array<any>, encryptedSymmetricKey: Uint8Array, chain: AllLitChainsKeys): Promise<string>;
//# sourceMappingURL=lit.d.ts.map