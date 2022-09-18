import type { CeramicApi } from "@ceramicnetwork/common";
import type { DID } from "dids";
import { LitNodeClient } from "lit-js-sdk";
import { AllLitChainsKeys } from "lit-js-sdk/dist/types";
declare global {
    interface Window {
        did?: DID;
        litNodeClient: LitNodeClient;
    }
}
export declare class Integration {
    ceramicPromise: Promise<CeramicApi>;
    chain: AllLitChainsKeys;
    constructor(ceramicNodeUrl?: string, chainParam?: AllLitChainsKeys);
    startLitClient(window: Window): void;
    /**
     * Encrypts using Lit and then writes using Ceramic
     * whatever the module user inputs (as long as it is a string for now)
     *
     * @param {string} toEncrypt what the module user wants to encrypt and store on ceramic
     * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
     * @param {string} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
     * @returns {Promise<string>} A promise that resolves to a streamID for the encrypted data that's been stored
     */
    encryptAndWrite(toEncrypt: string, accessControlConditions: Array<Object>, accessControlConditionType?: string): Promise<string>;
    /**
     * Retrieves a stream and decrypts message then returns to user
     *
     * @param {string} streamID the streamID of the encrypted data the user wants to access
     * @returns {Promise<string>} A promise that resolves to the unencrypted string of what was stored
     */
    readAndDecrypt(streamID: string): Promise<any>;
    /**
     * Retrieves a stream and decrypts message then returns to user
     *
     * @param {string} streamID the streamID of the encrypted data that you want to update the access control conditions for
     * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  Note that you cannot change the accessControlConditionType using this method, and you must use the same condition type that was used when you ran encryptAndWrite.   See the docs here for examples of accessControlConditions: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
     * @returns {Promise<string>} A promise that resolves to the unencrypted string of what was stored
     */
    updateAccess(streamID: string, newAccessControlConditions: Array<Object>): Promise<any>;
}
//# sourceMappingURL=integration.d.ts.map