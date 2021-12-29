// Don't forget to rebuild
import { createIDX } from "./idx";
import { _encryptWithLit, _decryptWithLit } from "./lit";
import { _startLitClient } from "./client";
import {
  _authenticateCeramic,
  _createCeramic,
  _writeCeramic,
  _readCeramic,
  _decodeFromB64
} from "./ceramic";

declare global {
  interface Window {
    did?: DID;
  }
}
export class Integration {
  constructor() {}

  startLitClient(window: Window) {
    _startLitClient(window);
  }

  ceramicPromise = _createCeramic();

  /**
   * Encrypts using Lit and then writes using Ceramic
   * whatever the module user inputs (as long as it is a string for now)
   *
   * @param {String} thisSecret what the module user wants to encrypt and store on ceramic
   * @returns {String} streamID for the encrypted data that's been stored
   */
  async encryptAndWrite(thisSecret: String): Promise<String> {
    try {
      const a = await _authenticateCeramic(this.ceramicPromise);
      const en = await _encryptWithLit(a, thisSecret);
      const wr = await _writeCeramic(a, en);
      return wr;
    } catch (error) {
      return `something went wrong encrypting: ${error}`;
    }
  }

  /**
   * Retrieves a stream and decrypts message then returns to user
   *
   * @param {String} streamID the streamID of the encrypted data the user wants to access
   * @returns {String} unencrypted string of what was stored
   */
  async readAndDecrypt(streamID: String): Promise<any> {
    try {
      // makes certain DID/wallet has been auth'ed
      const a = await _authenticateCeramic(this.ceramicPromise);
      // read data and retrieve encrypted data
      const en = await _readCeramic(a, streamID);
      // decode data returned from ceramic
      const deco = await _decodeFromB64(en);
      // decrypt data that's been decoded
      const decrypt = await _decryptWithLit(deco[0], deco[1], deco[2], deco[3]);
      return decrypt;
    } catch (error) {
      return `something went wrong decrypting: ${error} \n StreamID sent: ${streamID}`;
    }
  }
}
