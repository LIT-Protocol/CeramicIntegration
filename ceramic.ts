import type { CeramicApi } from "@ceramicnetwork/common";
import Ceramic from "@ceramicnetwork/http-client";
import { Caip10Link } from "@ceramicnetwork/stream-caip10-link";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { DID } from "dids";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import KeyDidResolver from "key-did-resolver";
import { createIDX } from "./idx";
import { getProvider, getAddress } from "./wallet";
import { ResolverRegistry } from "did-resolver";
import { decodeb64 } from "./lit";

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
export async function _createCeramic(
  ceramicNodeUrl: string
): Promise<CeramicApi> {
  const ceramic = new Ceramic(ceramicNodeUrl);
  window.ceramic = ceramic;
  window.TileDocument = TileDocument;
  window.Caip10Link = Caip10Link;

  return Promise.resolve(ceramic as CeramicApi);
}

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
export async function _authenticateCeramic(
  ceramicPromise: Promise<CeramicApi>
): Promise<Array<any>> {
  console.log("authenticate Ceramic!");

  const provider = await getProvider();
  const [ceramic, address] = await Promise.all([ceramicPromise, getAddress()]);
  const keyDidResolver = KeyDidResolver.getResolver();
  const threeIdResolver = ThreeIdResolver.getResolver(ceramic);
  const resolverRegistry: ResolverRegistry = {
    ...threeIdResolver,
    ...keyDidResolver,
  };
  const did = new DID({
    provider: provider,
    resolver: resolverRegistry,
  });

  await did.authenticate();
  await ceramic.setDID(did);
  const idx = createIDX(ceramic);
  window.did = ceramic.did;
  return Promise.resolve([idx.id, ceramic, address]);
}

/**
 * Write to Ceramic.  This function takes in an auth and what one would
 * like written and then sends it to a ceramic node in the proper format
 * @param {any[]} auth is the authentication passed via the persons wallet
 * @param {any[]} array of encrypted key, symkey, accessControlConditions, and chain
 * @returns {Promise<string>} promise with the ceramic streamID, can be used to look up data
 */
export async function _writeCeramic(
  auth: any[],
  toBeWritten: any[]
): Promise<String> {
  if (auth) {
    const ceramic = auth[1];
    const toStore = {
      encryptedZip: toBeWritten[0],
      symKey: toBeWritten[1],
      accessControlConditions: toBeWritten[2],
      chain: toBeWritten[3],
    };
    const doc = await TileDocument.create(ceramic, toStore, {
      // controllers: [concatId],
      family: "doc family",
    });
    return doc.id.toString();
  } else {
    console.error("Failed to authenticate in ceramic WRITE");
    return "error";
  }
}

/**
 * Write to Ceramic.  This function takes in an auth and what one would
 * like written and then sends it to a ceramic node in the proper format
 *
 * for testing this function and understanding ceramic's read functionality better
 * see our README, Test Data section.  Also the Ceramic docs on Read Functionality!
 *
 * @param {any[]} auth is the authentication passed via the user's wallet
 * @param {String} streamId ID hash of the stream
 * @returns {Promise<string>} promise with the ceramic streamID's output
 */
export async function _readCeramic(
  auth: any[],
  streamId: String
): Promise<string> {
  if (auth) {
    const ceramic = auth[1];
    const stream = await ceramic.loadStream(streamId);
    return stream.content;
  } else {
    console.error("Failed to authenticate in ceramic READ");
    return "error";
  }
}

/**
 * Decode info from base64.  Data is stored in base64 to make upload to ceramic
 * more seamless.  This function decodes it so it can be decrypted with Lit in
 * the next step in the read and decrypt process
 *
 * @param {string} response response received from ceramic streamID
 * @returns {Promise<Array<any>} array of decrypted zip and symmetric key + AAC and chain
 */
export async function _decodeFromB64(response: string) {
  // data is encoded in base64, decode
  // const jason = JSON.stringify(response);
  try {
    // @ts-ignore
    const enZip = response["encryptedZip"];
    const deZip = decodeb64(enZip);

    // @ts-ignore
    const enSym = response["symKey"];
    const deSym = decodeb64(enSym);

    // @ts-ignore
    const accessControlConditions = response["accessControlConditions"];
    // @ts-ignore
    const chain = response["chain"];
    return [deZip, deSym, accessControlConditions, chain];
  } catch (error) {
    return "There was an error decrypting, is it possible you inputted the wrong streamID?";
  }
}
