import Ceramic from "@ceramicnetwork/core";
import TileDocument from "@ceramicnetwork/stream-tile";

import IPFS from "ipfs-core";
import dagJose from "dag-jose";
import { convert } from "blockcodec-to-ipld-format";

const format = convert(dagJose);

const ipfs = Ipfs.create({
  ipld: { formats: [format] }
});

const config: CeramicConfig = {};
const ceramic = await Ceramic.create(ipfs, config);

// create document example
const tileDocument = await TileDocument.create(ceramic, { test: 123 });
