// Don't forget to rebuild
import { createIDX } from "./idx";
import type { CeramicApi } from "@ceramicnetwork/common";
import type { DID } from "dids";
import { _encryptWithLit, _decryptWithLit } from "./lit";
import { _startLitClient } from "./client";
import {
  _authenticateCeramic,
  _createCeramic,
  _writeCeramic,
  _readCeramic,
  _decodeFromB64,
} from "./ceramic";

declare global {
  interface Window {
    did?: DID;
  }
}
export class Integration {
  ceramicPromise: Promise<CeramicApi>;
  chain: String;

  constructor(
    ceramicNodeUrl: string = "https://ceramic-clay.3boxlabs.com",
    chainParam: String = "ethereum"
  ) {
    this.chain = chainParam;
    // console.log("setting chain to ", this.chain);
    this.ceramicPromise = _createCeramic(ceramicNodeUrl);
  }

  startLitClient(window: Window) {
    _startLitClient(window);
  }

  /**
   * Encrypts using Lit and then writes using Ceramic
   * whatever the module user inputs (as long as it is a string for now)
   *
   * @param {String} toEncrypt what the module user wants to encrypt and store on ceramic
   * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
   * @param {String} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
   * @returns {Promise<String>} A promise that resolves to a streamID for the encrypted data that's been stored
   */
  async encryptAndWrite(
    toEncrypt: String,
    accessControlConditions: Array<Object>,
    accessControlConditionType: String = "accessControlConditions"
  ): Promise<String> {
    if (
      accessControlConditionType !== "accessControlConditions" &&
      accessControlConditionType !== "evmContractConditions"
    ) {
      throw new Error(
        "accessControlConditionType must be accessControlConditions or evmContractConditions"
      );
    }
    try {
      const a = await _authenticateCeramic(this.ceramicPromise);
      const en = await _encryptWithLit(
        a,
        toEncrypt,
        accessControlConditions,
        this.chain,
        accessControlConditionType
      );
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
   * @returns {Promise<String>} A promise that resolves to the unencrypted string of what was stored
   */
  async readAndDecrypt(streamID: String): Promise<any> {
    try {
      // makes certain DID/wallet has been auth'ed
      const a = await _authenticateCeramic(this.ceramicPromise);
      // read data and retrieve encrypted data
      const en = await _readCeramic(a, streamID);
      // decode data returned from ceramic
      const deco = await _decodeFromB64(en);
      console.log("data from ceramic: ", deco);
      // decrypt data that's been decoded
      const decrypt = await _decryptWithLit(
        deco[0],
        deco[1],
        deco[2],
        deco[3],
        deco[4]
      );
      return decrypt;
    } catch (error) {
      return `something went wrong decrypting: ${error} \n StreamID sent: ${streamID}`;
    }
  }
}
