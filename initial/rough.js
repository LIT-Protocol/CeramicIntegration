import LitJsSdk from "lit-js-sdk";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import CeramicClient from "@ceramicnetwork/http-client";

import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
// import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect"; // provider

// import pkg from "@3id/connect";
// const { ThreeIdConnect, EthereumAuthProvider } = pkg;
// key DID auth
import { Ed25519Provider } from "key-did-provider-ed25519";
import { randomBytes } from "@stablelib/random";
import { DID } from "dids";

// Ceramic Node Address (free R/W Testnet)
const API_URL = "0.0.0.0:7007"; // "https://ceramic-clay.3boxlabs.com";

async function startApp() {
  // Create your node instance
  console.log("im awake..");
  const ceramic = async () => {
    const result = await new CeramicClient(API_URL);

    return result;
  };

  console.log("------streams---------------");
  console.log(ceramic);
  //------
  // create your seed for your DID
  const seed = randomBytes(32);
  console.log("seed: ", seed);
  // use seed to create provider instance
  const provider = new Ed25519Provider(seed);
  console.log("provider: ", provider);
  // set provider for ceramic
  const addresses = await window.ethereum.enable();
  console.log("addresses: ", addresses);

  // const threeIdConnect = new ThreeIdConnect();
  // const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
  // await threeIdConnect.connect(authProvider);

  // console.log("address---------:> ", authProvider.address);
  // const provider = await threeIdConnect.getDidProvider();
  console.log("provider---------:> ", provider);

  const providerSetting = async () => {
    const result = await ceramic.did.setProvider(provider);

    return result;
  };
  console.log(providerSetting);

  // auth yourself
  // await ceramic.did.authenticate();

  // deal with resolvers
  const resolver = {
    ...KeyDidResolver.getResolver(),
    ...ThreeIdResolver.getResolver(ceramic)
  };
  console.log("resolver: ", resolver.DID);
  const did = new DID({ resolver });
  ceramic.did = did;
  console.log("id: ", did._id);

  const doc = await TileDocument.create(ceramic, { hello: "Elliott" });

  console.log("you made a thing");

  console.log(doc.content);
  console.log(doc.commitId);

  const streamId = doc.id.toString();

  return "finish?".catch(e => {
    return "failure"; // returns a promise
  });
}

startApp();

//
//
//
//
//
//
//
//

//  Lit
// const client = new LitJsSdk.LitNodeClient();
// client.connect();
// window.litNodeClient = client;

console.log("welcome to the machine");

// document.addEventListener(
//   "lit-ready",
//   function(e) {
//     console.log("LIT network is ready");
//     setNetworkLoading(false); // replace this line with your own code that tells your app the network is ready
//   },
//   false
// );
