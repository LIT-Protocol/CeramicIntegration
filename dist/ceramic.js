"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._decodeFromB64 = exports._readCeramic = exports._writeCeramic = exports._authenticateCeramic = exports._createCeramic = void 0;
var http_client_1 = __importDefault(require("@ceramicnetwork/http-client"));
var stream_caip10_link_1 = require("@ceramicnetwork/stream-caip10-link");
var stream_tile_1 = require("@ceramicnetwork/stream-tile");
var dids_1 = require("dids");
var _3id_did_resolver_1 = __importDefault(require("@ceramicnetwork/3id-did-resolver"));
var key_did_resolver_1 = __importDefault(require("key-did-resolver"));
var idx_1 = require("./idx");
var wallet_1 = require("./wallet");
var lit_1 = require("./lit");
/**
 * Authenticate for Lit + Ceramic.
 * Creates a CeramicApi object on the ceramic testnet
 *
 * @returns {Promise<CeramicApi>} ceramicPromise pass in _createCeramic() promise
 */
function _createCeramic(ceramicNodeUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var ceramic;
        return __generator(this, function (_a) {
            ceramic = new http_client_1.default(ceramicNodeUrl);
            window.ceramic = ceramic;
            window.TileDocument = stream_tile_1.TileDocument;
            window.Caip10Link = stream_caip10_link_1.Caip10Link;
            return [2 /*return*/, Promise.resolve(ceramic)];
        });
    });
}
exports._createCeramic = _createCeramic;
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
function _authenticateCeramic(ceramicPromise) {
    return __awaiter(this, void 0, void 0, function () {
        var provider, _a, ceramic, address, keyDidResolver, threeIdResolver, resolverRegistry, did, idx;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("authenticate Ceramic!");
                    return [4 /*yield*/, (0, wallet_1.getProvider)()];
                case 1:
                    provider = _b.sent();
                    return [4 /*yield*/, Promise.all([ceramicPromise, (0, wallet_1.getAddress)()])];
                case 2:
                    _a = _b.sent(), ceramic = _a[0], address = _a[1];
                    keyDidResolver = key_did_resolver_1.default.getResolver();
                    threeIdResolver = _3id_did_resolver_1.default.getResolver(ceramic);
                    resolverRegistry = __assign(__assign({}, threeIdResolver), keyDidResolver);
                    did = new dids_1.DID({
                        provider: provider,
                        resolver: resolverRegistry,
                    });
                    return [4 /*yield*/, did.authenticate()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, ceramic.setDID(did)];
                case 4:
                    _b.sent();
                    idx = (0, idx_1.createIDX)(ceramic);
                    window.did = ceramic.did;
                    return [2 /*return*/, Promise.resolve([idx.id, ceramic, address])];
            }
        });
    });
}
exports._authenticateCeramic = _authenticateCeramic;
/**
 * Write to Ceramic.  This function takes in an auth and what one would
 * like written and then sends it to a ceramic node in the proper format
 * @param {any[]} auth is the authentication passed via the persons wallet
 * @param {any[]} array of encrypted key, symkey, accessControlConditions, and chain
 * @returns {Promise<string>} promise with the ceramic streamID, can be used to look up data
 */
function _writeCeramic(auth, toBeWritten) {
    return __awaiter(this, void 0, void 0, function () {
        var ceramic, toStore, doc;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!auth) return [3 /*break*/, 2];
                    ceramic = auth[1];
                    toStore = {
                        encryptedZip: toBeWritten[0],
                        symKey: toBeWritten[1],
                        accessControlConditions: toBeWritten[2],
                        chain: toBeWritten[3],
                    };
                    return [4 /*yield*/, stream_tile_1.TileDocument.create(ceramic, toStore, {
                            // controllers: [concatId],
                            family: "doc family",
                        })];
                case 1:
                    doc = _a.sent();
                    return [2 /*return*/, doc.id.toString()];
                case 2:
                    console.error("Failed to authenticate in ceramic WRITE");
                    return [2 /*return*/, "error"];
            }
        });
    });
}
exports._writeCeramic = _writeCeramic;
/**
 * Read to Ceramic.  This function takes in an auth and the streamID of the desired data and then sends it to a ceramic node in the proper format getting back a promised string of whatever was stored
 *
 * @param {any[]} auth is the authentication passed via the user's wallet
 * @param {String} streamId ID hash of the stream
 * @returns {Promise<string>} promise with the ceramic streamID's output
 */
function _readCeramic(auth, streamId) {
    return __awaiter(this, void 0, void 0, function () {
        var ceramic, stream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!auth) return [3 /*break*/, 2];
                    ceramic = auth[1];
                    return [4 /*yield*/, ceramic.loadStream(streamId)];
                case 1:
                    stream = _a.sent();
                    return [2 /*return*/, stream.content];
                case 2:
                    console.error("Failed to authenticate in ceramic READ");
                    return [2 /*return*/, "error"];
            }
        });
    });
}
exports._readCeramic = _readCeramic;
/**
 * Decode info from base64.  Data is stored in base64 to make upload to ceramic
 * more seamless.  This function decodes it so it can be decrypted with Lit in
 * the next step in the read and decrypt process
 *
 * @param {string} response response received from ceramic streamID
 * @returns {Promise<Array<any>} array of decrypted zip and symmetric key + AAC and chain
 */
function _decodeFromB64(response) {
    return __awaiter(this, void 0, void 0, function () {
        var enZip, deZip, enSym, deSym, accessControlConditions, chain;
        return __generator(this, function (_a) {
            // data is encoded in base64, decode
            // const jason = JSON.stringify(response);
            try {
                enZip = response["encryptedZip"];
                deZip = (0, lit_1.decodeb64)(enZip);
                enSym = response["symKey"];
                deSym = (0, lit_1.decodeb64)(enSym);
                accessControlConditions = response["accessControlConditions"];
                chain = response["chain"];
                return [2 /*return*/, [deZip, deSym, accessControlConditions, chain]];
            }
            catch (error) {
                return [2 /*return*/, "There was an error decrypting, is it possible you inputted the wrong streamID?"];
            }
            return [2 /*return*/];
        });
    });
}
exports._decodeFromB64 = _decodeFromB64;
