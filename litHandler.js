import LitJsSdk from "lit-js-sdk";

const client = new LitJsSdk.LitNodeClient();
client.connect();
window.litNodeClient = client;

// Get an HTMLNFT
// Encrypt
function sayHello() {
  console.log("hello");
  alert("hello there!");
}

async function mintNft() {
  // document.getElementById("mintingStatus").innerText =
  // "Minting, please wait for the tx to confirm...";
  console.log("minting time");
  window.chain = "ethereum";

  const {
    txHash,
    tokenId,
    tokenAddress,
    mintingAddress,
    authSig
  } = await LitJsSdk.mintLIT({ chain: window.chain, quantity: 1 });
  console.log("tokenID");
  console.log(tokenId);
  console.log("addr");
  console.log(tokenAddress);
  console.log("authsig");
  console.log(authSig);

  console.log("Minted!  Tx hash is ", txHash);
}

// await mintNft();

LitJsSdk.zipAndEncryptString(
  "elliott likes to encrypt and decrypt facsinating sentnences"
);
console.log("done it");

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

//   const { tokenId, tokenAddress, mintingAddress, txHash, errorCode, authSig } = await LitJsSdk.mintLIT({ chain, quantity })
//   const { symmetricKey, encryptedZip } = await LitJsSdk.zipAndEncryptString(lockedFileMediaGridHtml)

//   const accessControlConditions = [
//     {
//       contractAddress: '0x3110c39b428221012934A7F617913b095BC1078C',
//       standardContractType: 'ERC1155',
//       chain,
//       method: 'balanceOf',
//       parameters: [
//         ':userAddress',
//         '9541'
//       ],
//       returnValueTest: {
//         comparator: '>',
//         value: '0'
//       }
//     }
//   ]

//   const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
//     accessControlConditions,
//     symmetricKey,
//     authSig,
//     chain
//   })
