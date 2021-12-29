# General Notes From Building with Ceramic

### Node

For ceramic you're required to run a client, which can either be based on your own node (using their "core" client Implementation) or using their JS HTTP client. Core requires setting up a IPFS node and a dag-jose apparently, so for now if I need to do this, and it looks like I do, I'm going with JS HTTP.

# Glossary

I found it useful to define some things things in short form, full glossary can be [found here](https://developers.ceramic.network/learn/glossary/). Some phrases are direct copies, most aren't.

## DID

### DID -

Decentralized Identifier, used to identify an entity, person, etc. via an agreed upon URI schema. They're used for Authentication by most StreamTypes

### DID Methods -

Implementation of the DID specification. DID methods must specify:

1. A name for the method in the form of a string
2. A description of where the DID document is stored (or how it is statically generated)
3. A DID resolver which: -->

- CAN return a DID document,
- GIVEN a URI
- WHICH conforms to that particular DID method.

There's an official method registry for DID methods with over 40 of them (maintained by the W3C), so that's cool.

For reference, and DID URI looks like this:
`did:<method-name>:<method-specific-identifier>`

### DID Document -

Contain metadata about a DID. Contains cryptographic key data for auth, at a minimium.

### DID Resolver -

Must be imported upon installation of JS HTTP or Core Client

### DID Providers -

DID providers are software libraries that expose a json-rpc interface which allows for the creation and usage of a DID that conforms to a particular DID method.

Usually a DID provider is constructed using a seed that the user controls. When using Ceramic with streams that require DIDs for authentication, applications either need to integrate a DID provider library, which leaves the responsibility of key management up to the application, or a DID wallet, which is a more user-friendly experience.

### DID Wallets -

DID wallets are software libraries or end-user applications that wrap DID providers with additional capabilities

3ID is the most popular wallet.

## Ceramic

### StreamType -

The processing logic used by the particular stream.

### Tile Document -

A StreamType that stores a JSON document, providing similar functionality as a NoSQL document store.

used as a database replacement for identity metadata (profiles, social graphs, reputation scores, linked social accounts), user-generated content (blog posts, social media, etc), indexes of other StreamIDs to form collections and user tables (IDX), DID documents, verifiable claims, and more

### CAIP-10 Link -

A StreamType that stores a cryptographically verifiable proof that links a blockchain address to a DID.

# Useful Links

Lifecycle of a Stream, and more, very useful: https://github.com/ceramicnetwork/ceramic/blob/master/SPECIFICATION.md

# Completely Random Notes

Keeping streams isn't universally required, so I think this may suffer the same problem as torrents, in that if something is considered forbidden content a govt authority can censor. I think that's probably by design but I found it interesting.

Arweave isn't implemented yet. The denote it as "archiving" (clever distinction, Arweave is forever if the price is right) as opposed to what they are currently doing with IPFS/Filecoin which is more like pay-as-you-go storage.

##### Of interest: data withholding attacks..

They act like this isn't a big deal, but if I get someone's private keys and do this to them unknowningly I control their stream history. Imagine losing years worth of data due poor key management!

Reference:

        One suggested attack on this conflict resolution system is a data withholding attack. In this scenario a user creates a stream, makes two conflicting updates and anchors one of them earlier than the other, but only publishes the data of the update that was anchored later. Now subsequent updates to the stream will be made on top of the second, published update. Every observer will accept these updates as valid since they have not seen the first update. However if the user later publishes the data of the earlier update, the stream will fork back to this update and all of the other updates made to the stream will be invalidated.

        This is essentially a double spend attack which is the problem that blockchains solve. However since identities have only one owner, the user, this is less of a problem. In this case, a "double spend" would cause the user to lose all history and associations that have accrued on their identity, which they are naturally disincentivized to do.

        In the case of organizational identities this is more of a problem, e.g. if an old admin of the org wants to cause trouble. This can be solved by introducing "heavy anchors" which rely more heavily on some on-chain mechanism. For example, a smart contract or a DAO that controls the identity.
