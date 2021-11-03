import LitJsSdk from "lit-js-sdk";

async function encrypt_string() {
  document.getElementById("mintingStatus").innerText =
    "Minting, please wait for the tx to confirm...";

  window.chain = document.getElementById("selectedChain").value;

  const aStringThatYouWishToEncrypt =
    "this is my secret, hold if for me please";
  const authSig = await LitJsSdk.checkAndSignAuthMessage({
    chain: window.chain
  });
  const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptString(
    aStringThatYouWishToEncrypt
  );

  const accessControlConditions = [
    {
      contractAddress: "0x20598860Da775F63ae75E1CD2cE0D462B8CEe4C7",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "10000000000000"
      }
    }
  ];

  //   const {
  //     txHash,
  //     tokenId,
  //     tokenAddress,
  //     mintingAddress,
  //     authSig
  //   } = await LitJsSdk.mintLIT({ chain: window.chain, quantity: 1 });
  //   window.tokenId = tokenId;
  //   window.tokenAddress = tokenAddress;
  //   window.authSig = authSig;

  console.log("Minted!  Tx hash is ", txHash);
}

console.log("welcome to lit Encrypt.. Let us Begin.");
console.log("Encrypt String Test:");
encrypt_string();
console.log("-------Encrypt Test Completed--------");
