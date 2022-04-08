"use strict";
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
exports.Integration = void 0;
var lit_1 = require("./lit");
var client_1 = require("./client");
var ceramic_1 = require("./ceramic");
var Integration = /** @class */ (function () {
    function Integration(ceramicNodeUrl, chainParam) {
        if (ceramicNodeUrl === void 0) { ceramicNodeUrl = "https://ceramic-clay.3boxlabs.com"; }
        if (chainParam === void 0) { chainParam = "ethereum"; }
        this.chain = chainParam;
        // console.log("setting chain to ", this.chain);
        this.ceramicPromise = (0, ceramic_1._createCeramic)(ceramicNodeUrl);
    }
    Integration.prototype.startLitClient = function (window) {
        (0, client_1._startLitClient)(window);
    };
    /**
     * Encrypts using Lit and then writes using Ceramic
     * whatever the module user inputs (as long as it is a string for now)
     *
     * @param {String} toEncrypt what the module user wants to encrypt and store on ceramic
     * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  See the docs here for examples: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
     * @param {String} accessControlConditionType the access control condition type you are using.  Pass `accessControlConditions` for traditional access control conditions.  This is the default if you don't pass anything.  Pass `evmContractConditions` for custom smart contract access control conditions
     * @returns {Promise<String>} A promise that resolves to a streamID for the encrypted data that's been stored
     */
    Integration.prototype.encryptAndWrite = function (toEncrypt, accessControlConditions, accessControlConditionType) {
        if (accessControlConditionType === void 0) { accessControlConditionType = "accessControlConditions"; }
        return __awaiter(this, void 0, void 0, function () {
            var a, en, wr, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (accessControlConditionType !== "accessControlConditions" &&
                            accessControlConditionType !== "evmContractConditions") {
                            throw new Error("accessControlConditionType must be accessControlConditions or evmContractConditions");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, (0, ceramic_1._authenticateCeramic)(this.ceramicPromise)];
                    case 2:
                        a = _a.sent();
                        return [4 /*yield*/, (0, lit_1._encryptWithLit)(toEncrypt, accessControlConditions, this.chain, accessControlConditionType)];
                    case 3:
                        en = _a.sent();
                        return [4 /*yield*/, (0, ceramic_1._writeCeramic)(a, en)];
                    case 4:
                        wr = _a.sent();
                        return [2 /*return*/, wr];
                    case 5:
                        error_1 = _a.sent();
                        return [2 /*return*/, "something went wrong encrypting: ".concat(error_1)];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a stream and decrypts message then returns to user
     *
     * @param {String} streamID the streamID of the encrypted data the user wants to access
     * @returns {Promise<String>} A promise that resolves to the unencrypted string of what was stored
     */
    Integration.prototype.readAndDecrypt = function (streamID) {
        return __awaiter(this, void 0, void 0, function () {
            var a, en, deco, decrypt, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, (0, ceramic_1._authenticateCeramic)(this.ceramicPromise)];
                    case 1:
                        a = _a.sent();
                        console.log("authenticated RnD: ", a);
                        return [4 /*yield*/, (0, ceramic_1._readCeramic)(a, streamID)];
                    case 2:
                        en = _a.sent();
                        console.log("read from ceramic RnD: ", en);
                        return [4 /*yield*/, (0, ceramic_1._decodeFromB64)(en)];
                    case 3:
                        deco = _a.sent();
                        console.log("data from ceramic: ", deco);
                        return [4 /*yield*/, (0, lit_1._decryptWithLit)(deco[0], deco[1], deco[2], deco[3], deco[4])];
                    case 4:
                        decrypt = _a.sent();
                        return [2 /*return*/, decrypt];
                    case 5:
                        error_2 = _a.sent();
                        console.log("something went wrong decrypting: ".concat(error_2, " \n StreamID sent: ").concat(streamID));
                        return [2 /*return*/, "FALSE"];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a stream and decrypts message then returns to user
     *
     * @param {String} streamID the streamID of the encrypted data that you want to update the access control conditions for
     * @param {Array<Object>} accessControlConditions the access control conditions that govern who is able to decrypt this data.  Note that you cannot change the accessControlConditionType using this method, and you must use the same condition type that was used when you ran encryptAndWrite.   See the docs here for examples of accessControlConditions: https://developer.litprotocol.com/docs/SDK/accessControlConditionExamples
     * @returns {Promise<String>} A promise that resolves to the unencrypted string of what was stored
     */
    Integration.prototype.updateAccess = function (streamID, newAccessControlConditions) {
        return __awaiter(this, void 0, void 0, function () {
            var a, en, deco, result, newContent, result2, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        console.log("trying to update permissions for streamID: ", streamID);
                        return [4 /*yield*/, (0, ceramic_1._authenticateCeramic)(this.ceramicPromise)];
                    case 1:
                        a = _a.sent();
                        console.log("authenticated: ", a);
                        return [4 /*yield*/, (0, ceramic_1._readCeramic)(a, streamID)];
                    case 2:
                        en = _a.sent();
                        console.log("read from ceramic: ", en);
                        return [4 /*yield*/, (0, ceramic_1._decodeFromB64)(en)];
                    case 3:
                        deco = _a.sent();
                        console.log("data from ceramic: ", deco);
                        return [4 /*yield*/, (0, lit_1._saveEncryptionKey)(newAccessControlConditions, deco[1], //encryptedSymmetricKey
                            this.chain)];
                    case 4:
                        result = _a.sent();
                        console.log("update access result: ", result);
                        newContent = [
                            deco[0],
                            deco[1],
                            newAccessControlConditions,
                            deco[3],
                            deco[4],
                        ];
                        //save the access conditions back to Ceramic
                        console.log("saving new ceramic access conditions: ", newContent, newAccessControlConditions);
                        return [4 /*yield*/, (0, ceramic_1._updateCeramic)(a, streamID, newContent)];
                    case 5:
                        result2 = _a.sent();
                        console.log("update ceramic access conditions: ", streamID, result);
                        return [2 /*return*/, result2];
                    case 6:
                        error_3 = _a.sent();
                        return [2 /*return*/, "something went wrong encrypting: ".concat(error_3)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return Integration;
}());
exports.Integration = Integration;
