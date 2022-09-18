import type { CeramicApi } from "@ceramicnetwork/common";
declare global {
    interface Window {
        ceramic?: CeramicApi;
        [index: string]: any;
    }
}
/**
 * Authenticate for Lit + Ceramic.
 * Creates a CeramicApi object on the ceramic testnet
 *
 * @returns {Promise<CeramicApi>} ceramicPromise pass in _createCeramic() promise
 */
export declare function _createCeramic(ceramicNodeUrl: string): Promise<CeramicApi>;
/**
 * Authenticate for Lit + Ceramic.
 * This uses a wallet provider to interact with the user's wallet
 * Once the user has authorized, the address is retrieved and the
 * decentralized identity is created.  An IDX is also created for
 * convenience.
 *
 * @param {Promise<CeramicApi>} ceramicPromise pass in _createCeramic() promise
 * @returns {Promise<Array<any>>} Promise of ceramic IDX ID, ceramic object
 * and user's ETH Address
 */
export declare function _authenticateCeramic(ceramicPromise: Promise<CeramicApi>): Promise<Array<any>>;
/**
 * Write to Ceramic.  This function takes in an auth and what one would
 * like written and then sends it to a ceramic node in the proper format
 * @param {any[]} auth is the authentication passed via the persons wallet
 * @param {any[]} array of encrypted key, symkey, accessControlConditions, and chain
 * @returns {Promise<string>} promise with the ceramic streamID, can be used to look up data
 */
export declare function _writeCeramic(auth: any[], toBeWritten: any[]): Promise<string>;
export declare function _updateCeramic(auth: any[], streamId: string, newContent: any[]): Promise<string>;
/**
 * Read to Ceramic.  This function takes in an auth and the streamID of the desired data and then sends it to a ceramic node in the proper format getting back a promised string of whatever was stored
 *
 * @param {any[]} auth is the authentication passed via the user's wallet
 * @param {string} streamId ID hash of the stream
 * @returns {Promise<string>} promise with the ceramic streamID's output
 */
export declare function _readCeramic(auth: any[], streamId: string): Promise<string>;
/**
 * Decode info from base64.  Data is stored in base64 to make upload to ceramic
 * more seamless.  This function decodes it so it can be decrypted with Lit in
 * the next step in the read and decrypt process
 *
 * @param {string} response response received from ceramic streamID
 * @returns {Promise<Array<any>} array of decrypted zip and symmetric key + AAC and chain
 */
export declare function _decodeFromB64(response: string): Promise<any[] | "There was an error decrypting, is it possible you inputted the wrong streamID?">;
//# sourceMappingURL=ceramic.d.ts.map