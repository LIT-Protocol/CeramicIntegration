"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports._decryptWithLit = exports._encryptWithLit = exports.decodeb64 = exports.encodeb64 = void 0;
// import LitJsSdk from 'lit-js-sdk'
var LitJsSdk = __importStar(require("lit-js-sdk"));
var to_string_1 = require("uint8arrays/to-string");
/**
 * This function encodes into base 64.
 * it's useful for storing symkeys and files in ceramic
 * @param {Uint8Array} input a file or any data
 * @returns {string} returns a string of b64
 */
function encodeb64(uintarray) {
    var b64 = Buffer.from(uintarray).toString("base64");
    return b64;
}
exports.encodeb64 = encodeb64;
/**
 * This function converts blobs to base 64.
 * for easier storage in ceramic
 * @param {Blob} blob what you'd like to encode
 * @returns {Promise<String>} returns a string of b64
 */
function blobToBase64(blob) {
    return new Promise(function (resolve, _) {
        var reader = new FileReader();
        reader.onloadend = function () {
            return resolve(
            // @ts-ignore
            reader.result.replace("data:application/octet-stream;base64,", ""));
        };
        reader.readAsDataURL(blob);
    });
}
/**
 * This function decodes from base 64.
 * it's useful for decrypting symkeys and files in ceramic
 * @param {blob} input a b64 string
 * @returns {string} returns the data as a string
 */
function decodeb64(b64String) {
    return new Uint8Array(Buffer.from(b64String, "base64"));
}
exports.decodeb64 = decodeb64;
/**
 * encrypts a message with Lit returns required details
 * this obfuscates data such that it can be stored on ceramic without
 * non-permissioned eyes seeing what the data is
 * @param {blob} auth authentication from wallet
 * @param {String} aStringThatYouWishToEncrypt the clear text you'd like encrypted
 * @returns {Promise<Array<any>>} returns, in this order: encryptedZipBase64, encryptedSymmetricKeyBase64, accessControlConditions, chain
 */
function _encryptWithLit(auth, aStringThatYouWishToEncrypt, accessControlConditions) {
    return __awaiter(this, void 0, void 0, function () {
        var chain, authSig, _a, encryptedZip, symmetricKey, encryptedSymmetricKey, encryptedZipBase64, encryptedSymmetricKeyBase64;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    chain = "ethereum";
                    return [4 /*yield*/, LitJsSdk.checkAndSignAuthMessage({
                            chain: chain,
                        })];
                case 1:
                    authSig = _b.sent();
                    return [4 /*yield*/, LitJsSdk.zipAndEncryptString(aStringThatYouWishToEncrypt)];
                case 2:
                    _a = _b.sent(), encryptedZip = _a.encryptedZip, symmetricKey = _a.symmetricKey;
                    return [4 /*yield*/, window.litNodeClient.saveEncryptionKey({
                            accessControlConditions: accessControlConditions,
                            symmetricKey: symmetricKey,
                            authSig: authSig,
                            chain: chain,
                        })];
                case 3:
                    encryptedSymmetricKey = _b.sent();
                    return [4 /*yield*/, blobToBase64(encryptedZip)];
                case 4:
                    encryptedZipBase64 = _b.sent();
                    encryptedSymmetricKeyBase64 = encodeb64(encryptedSymmetricKey);
                    return [2 /*return*/, [
                            encryptedZipBase64,
                            encryptedSymmetricKeyBase64,
                            accessControlConditions,
                            chain,
                        ]];
            }
        });
    });
}
exports._encryptWithLit = _encryptWithLit;
/**
 * decrypt encrypted zip and symmetric key using the lit protocol
 * @param {Uint8Array} encryptedZip encrypted data that will be converted into a string
 * @param {Uint8Array} encryptedSymmKey symmetric key
 * @param {Uint8Array} accessControlConditions conditions that determine access
 * @returns {Promise<string>} promise with the decrypted string
 */
function _decryptWithLit(encryptedZip, encryptedSymmKey, accessControlConditions, chain) {
    return __awaiter(this, void 0, void 0, function () {
        var authSig, toDecrypt, decryptedSymmKey, decryptedFiles, decryptedString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, LitJsSdk.checkAndSignAuthMessage({
                        chain: chain,
                    })];
                case 1:
                    authSig = _a.sent();
                    // encrypted blob, sym key
                    console.log("encryptedSymKey", encryptedSymmKey);
                    toDecrypt = (0, to_string_1.toString)(encryptedSymmKey, "base16");
                    console.log("toDecrypt", toDecrypt);
                    return [4 /*yield*/, window.litNodeClient.getEncryptionKey({
                            accessControlConditions: accessControlConditions,
                            toDecrypt: toDecrypt,
                            chain: chain,
                            authSig: authSig,
                        })];
                case 2:
                    decryptedSymmKey = _a.sent();
                    console.log("decryptedSymKey", decryptedSymmKey);
                    return [4 /*yield*/, LitJsSdk.decryptZip(new Blob([encryptedZip]), decryptedSymmKey)];
                case 3:
                    decryptedFiles = _a.sent();
                    return [4 /*yield*/, decryptedFiles["string.txt"].async("text")];
                case 4:
                    decryptedString = _a.sent();
                    return [2 /*return*/, decryptedString];
            }
        });
    });
}
exports._decryptWithLit = _decryptWithLit;
