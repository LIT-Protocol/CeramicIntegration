# Lit Ceramic Integration Module

## Installation

`yarn add lit-ceramic-integration`

## Usage

1. Install as shown above
2. Import into your TS/JS where you'd like to use it. This is a typescript package as an FYI.

`import { Integration } from 'lit-ceramic-integration'`

Javascript requires minor amounts of extra work to use a Typescript project, [here's an example](https://www.freecodecamp.org/news/how-to-add-typescript-to-a-javascript-project/) of what that can look like, but there are plenty of good resources for this online.

3. Create a new Integration that runs upon startup and is accessible where you intend to do encryptAndWrite or readAndDecrypt operations:
   `let litCeramicIntegration = new Integration("https://ceramic-clay.3boxlabs.com")`
4. Start the Lit Client when the DOM is loaded, or early on in the lifecycle:
   `litCeramicIntegration.startLitClient(window)`
5. You'll need to define access control conditions for your data. This will govern who is able to decrypt and therefore read the data. The access control conditions variable should be an array of conditions and the user must satisify all of them (a boolean "AND" operation) to access the data. You can find examples of conditions here: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples

For example, this access control condition lets anyone who holds an NFT in the collection at 0x319ba3aab86e04a37053e984bd411b2c63bf229e on Ethereum to decrypt and read the data:

```
const accessControlConditions = [
  {
    contractAddress: '0x319ba3aab86e04a37053e984bd411b2c63bf229e',
    standardContractType: 'ERC721',
    chain,
    method: 'balanceOf',
    parameters: [
      ':userAddress'
    ],
    returnValueTest: {
      comparator: '>',
      value: '0'
    }
  }
]
```

6. Use encryptAndWrite to encrypt and write your data to Ceramic:

```
const stringToEncrypt = 'This is what we want to encrypt on Lit and then store on ceramic'
const response = litCeramicIntegration
   .encryptAndWrite(stringToEncrypt, accessControlConditions)
   .then((streamID) => console.log(streamID))
```

Note that the stringToEncrypt is the thing which we are encrypting in this example, which could be any string (including JSON). The encryptAndWrite function returns a promise that contains the ceramic streamID of the content that was written. Note that you do need to save the streamID somewhere in order to retrieve the data later on. You could use localStorage or a database, but you'll need to save the streamID somewhere.

7. Use readAndDecrypt to read your data from ceramic and automatically decrypt it:

```
    const streamID = 'kjzl6cwe1jw1479rnblkk5u43ivxkuo29i4efdx1e7hk94qrhjl0d4u0dyys1au'
    const response = litCeramicIntegration.readAndDecrypt(streamID).then(
      (value) =>
        console.log(value)
    )
```

This uses an example streamID and prints the secret value to the console.

## API Docs

You can find API docs [here](documentation/integration.md)

### To Do / Desired Future Features

- Change infuraID in ./wallet's `web3Modal`.
- Enable Swap to Ceramic's mainnet

### Test Data

#### Testing Ceramic Read Function

If you'd like ping the ceramic test net for a streamID that already works, use the following streamID: `kjzl6cwe1jw14afliaj4m2vku3uy67ulyxj0erv5jgqz6k6cw0vtz27mf76m4ww`

Manually, you can start the `ceramic daemon` and then in another terminal window enter `ceramic show kjzl6cwe1jw14afliaj4m2vku3uy67ulyxj0erv5jgqz6k6cw0vtz27mf76m4ww`
It should return the following:

{
"chain": "ethereum",
"symKey": "gvKsVkBRS7d+baui7nJgf3b/G+8df1KNEYhVZ6kF97H8I0NROsKPd7BXds4jWbMK+rqlDa3Y2st4XQIHLqXLZVWJn5EZLNsYgEuZZPFaNbw7CGswjdSeMUK6WF8vAXS1+LbYrbal3GbTA+1JZ7Rc/xCKmpqM2Dvz2Btj8dhY3AUAAAAAAAAAIKnDOtW9nceKILkczbD1YjUyC3on3kTXKSJNyq2y4dmxy42BUuU6z+iI4WWZ2wmUhg==",
"encryptedZip": "rAf1RDm7nf4STWdhPS4gYWrlNHS9HcAUO/w0E86xcEC5zdLIF0TlGKVqeCowGNKtB8ecz/zxFp/8Ra+js4WOwK/yATFi5AxoCu2s5653rDZr9AjIQ8ii4pKeeRm+qEnL3bzXtmJT+5XiixTz5zgxhGgOccYMdDeOjJUKf6okOFBwVLCrUHyPd4MdbE+SLA8/hnUh7EnTLykF+3GJnD0cyQ==",
"accessControlConditions": [
{
"chain": "ethereum",
"method": "eth_getBalance",
"parameters": [
":userAddress",
"latest"
],
"contractAddress": "0x20598860da775f63ae75e1cd2ce0d462b8cee4c7",
"returnValueTest": {
"value": "10000000000000",
"comparator": ">="
},
"standardContractType": ""
}
]
}
