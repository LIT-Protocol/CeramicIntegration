# Lit Ceramic Integration Module

### Installation

`yarn add @litelliott/lit-ceramic-integration`

### How to Implement

The following are steps to implement. In addition, we also have a wonderful folder called 'documentation' in the root directory of this repo that has markdown files with explanations of all the important methods.

1. Install as show above
   NOTE: an example of this implementation can be found in the lit-ceramic web playground we built to accompany the release of this module.
2. import into your TS/JS where you'd like to use it. This is a typescript package as an FYI.

`import { Integration } from '@litelliott/lit-ceramic-integration'`

Javascript requires minor amounts of extra work to use a Typescript project, [here's an example](https://www.freecodecamp.org/news/how-to-add-typescript-to-a-javascript-project/) of what that can look like, but there are plenty of good resources for this online.

3. Create a new Integration that runs upon startup and is accessible where you intend to do encryptAndWrite or readAndDecrypt operations:
   `let litCeramicIntegration = new Integration()`
4. Start the Lit Client when the DOM is loaded, or early on in the lifecycle:
   `litCeramicIntegration.startLitClient(window)`
5. Here is what an encryptAndWrite operation looks like:

```
  const stringToEncrypt = 'This is what we want to encrypt on Lit and then store on ceramic'
  const response = litCeramicIntegration
    .encryptAndWrite(stringToEncrypt)
    .then((value) => updateStreamID(value))
```

Note that the stringToEncrypt is the thing which we are encrypting in this example. and the `updateStreamID` function is a bespoke (not in the integration module) function that takes the value that the promise produces and shows it in the HTML, so that the user can know what their streamID is (and therefore how they can access their encrypted and stored secret). You can do anything with the value variable, it will give back the stored value's streamID.

6. Here is what a readAndDecrypt operation looks like:

```
    const streamID = 'kjzl6cwe1jw1479rnblkk5u43ivxkuo29i4efdx1e7hk94qrhjl0d4u0dyys1au'
    const response = litCeramicIntegration.readAndDecrypt(streamID).then(
      (value) =>
        console.log(value)
    )
```

This uses an example streamID and prints the secret value to the console.

### How to develop in your local environment

this helped: https://flaviocopes.com/npm-local-package/

### Notes

- Important to restart parcel in the project you're using this module with when you are editing locally, otherwise it won't update.

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
