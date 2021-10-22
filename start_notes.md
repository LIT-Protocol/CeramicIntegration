# Notes to Start

Rough notes kept to remind/keep track of the general process of how to do things. Shouldn't be considered complete but may have hints and may touch up later.

I globally installed concurrently via yarn (this is more of a LIT thing but seemed fun):
`yarn global add concurrently`

One needs a client running to do AUTH. JS HTTP is the lighter easier route so going that way. Note that npm v6 is officially supported, theoretical for v7.
`yarn add @ceramicnetwork/http-client`

Yeah.. apparently there are (free nodes)[https://developers.ceramic.network/run/nodes/community-nodes/] hosted (get wiped from time to time but yeah)... here's the list as of writing-->
READ ONLY:
Mainnet:
https://gateway.ceramic.network
Clay Testnet:
https://gateway-clay.ceramic.network

READ/WRITE (Clay testnet):
https://ceramic-clay.3boxlabs.com

### Auth

Going with single auth key did method b/c it's the simplest. 3DID is prob best long term.

`yarn add key-did-provider-ed25519`

Set up a key provider, and followed the rest of the auth steps.. https://developers.ceramic.network/build/javascript/authentication/

It's a bit of a jungle in there.

CLI client may need to be a thing?
after a global yarn install: `@ceramicnetwork/cli`
went with: `ceramic daemon`

CLI works, both read and update when the client is turned on in the background.
https://developers.ceramic.network/build/cli/quick-start/

---

It seems like the Key DID is the simplest DID solution.. the docs seems super light on setting anything up outside of their own tiny playground, basically encouraging ppl to do it via CLI.. which is inconvienient for overacheivers.
