import { CeramicClient } from "@ceramicnetwork/http-client";

import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { randomBytes } from "@stablelib/random";

import KeyDidResolver from "key-did-resolver";
import { DID } from "dids";

// function queryNoAuth() {
//   const stream = await ceramic.loadStream<TileDocument>(streamId)
// };

async function queryNoAuth() {
  // Create your node instance
  console.log("im awake..");
  const stream = async () => {
    const streamId =
      "kjzl6cwe1jw147thxdbz8e14giyfhpqsaw6wll74c2zlejh28oqntawdb81ltoa";
    const result = (await ceramic.loadStream) < TileDocument > streamId;

    return result;
  };
  console.log(stream.length);
}
// queryNoAuth();

function installCeramicClient() {
  const API_URL = "0.0.0.0:7007"; // "https://ceramic-clay.3boxlabs.com";
  const ceramic = new CeramicClient(API_URL);

  // assign DID to ceramic client..
  const resolver = { ...KeyDidResolver.getResolver() };
  const did = new DID({ resolver });
  console.log("did: ", did);
  ceramic.did = did;
  console.log("did assigned: ", ceramic.did);
  // console.log("did ID auth?: ", did.id());

  console.log("--------------------------------------");
  const seed = randomBytes(32);
  console.log("create seed: ", seed);
  const provider = new Ed25519Provider(seed);
  console.log("provide provider: ", provider);

  // assign provider to ceramic node that already has DID attached
  ceramic.did.setProvider(provider);

  const authing = async () => {
    const result = await ceramic.did.authenticate();
    // console.log(await ceramic.did.authenticate());
    console.log("authing...");
    return result;
  };
  console.log("highly evolved: ", authing.id);
  const doc = TileDocument.create(
    ceramic,
    { foo: "bart" },
    {
      controllers: [ceramic.did.id],
      family: "doc family",
      schema: schemaDoc.commitId
    }
  );
  console.log(doc);
  // const doc = async () => {
  //   tiledoc = await TileDocument.create(
  //     ceramic,
  //     { foo: "bart" },
  //     {
  //       controllers: [ceramic.did.id],
  //       family: "doc family",
  //       schema: schemaDoc.commitId
  //     }
  //   );
  //   return tiledoc;
  // };
  // console.log(doc);
  // const streamId = doc.id.toString();
  // console.log("streamID: ", streamId);
}

// import CeramicClient from "@ceramicnetwork/http-client";

// const API_URL = "https://yourceramicnode.com"
// const ceramic = new CeramicClient(API_URL)

// ceramic.did = did
console.log("================================================================");
installCeramicClient();
