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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalGetTokenList = exports.contenthashToUri = exports.hexToUint8Array = exports.uriToHttp = exports.parseENSAddress = void 0;
var cids_1 = __importDefault(require("cids"));
var ajv_1 = __importDefault(require("ajv"));
var multicodec_1 = require("multicodec");
var multihashes_1 = require("multihashes");
var tokenlist_schema_json_1 = __importDefault(require("@uniswap/token-lists/src/tokenlist.schema.json"));
var resolveENSContentHash_1 = __importDefault(require("./resolveENSContentHash"));
var ENS_NAME_REGEX = /^(([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+)eth(\/.*)?$/;
function parseENSAddress(ensAddress) {
    var match = ensAddress.match(ENS_NAME_REGEX);
    if (!match)
        return undefined;
    return { ensName: match[1].toLowerCase() + "eth", ensPath: match[4] };
}
exports.parseENSAddress = parseENSAddress;
/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
function uriToHttp(uri) {
    var _a, _b;
    var protocol = uri.split(":")[0].toLowerCase();
    switch (protocol) {
        case "https":
            return [uri];
        case "http":
            return ["https" + uri.substr(4), uri];
        case "ipfs":
            var hash = (_a = uri.match(/^ipfs:(\/\/)?(.*)$/i)) === null || _a === void 0 ? void 0 : _a[2];
            return [
                "https://cloudflare-ipfs.com/ipfs/" + hash + "/",
                "https://ipfs.io/ipfs/" + hash + "/",
            ];
        case "ipns":
            var name_1 = (_b = uri.match(/^ipns:(\/\/)?(.*)$/i)) === null || _b === void 0 ? void 0 : _b[2];
            return [
                "https://cloudflare-ipfs.com/ipns/" + name_1 + "/",
                "https://ipfs.io/ipns/" + name_1 + "/",
            ];
        default:
            return [];
    }
}
exports.uriToHttp = uriToHttp;
function hexToUint8Array(hex) {
    hex = hex.startsWith("0x") ? hex.substr(2) : hex;
    if (hex.length % 2 !== 0)
        throw new Error("hex must have length that is multiple of 2");
    var arr = new Uint8Array(hex.length / 2);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return arr;
}
exports.hexToUint8Array = hexToUint8Array;
var UTF_8_DECODER = new TextDecoder();
/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */
function contenthashToUri(contenthash) {
    var buff = hexToUint8Array(contenthash);
    var codec = multicodec_1.getCodec(buff); // the typing is wrong for @types/multicodec
    switch (codec) {
        case "ipfs-ns": {
            var data = multicodec_1.rmPrefix(buff);
            var cid = new cids_1.default(data);
            return "ipfs://" + multihashes_1.toB58String(cid.multihash);
        }
        case "ipns-ns": {
            var data = multicodec_1.rmPrefix(buff);
            var cid = new cids_1.default(data);
            var multihash = multihashes_1.decode(cid.multihash);
            if (multihash.name === "identity") {
                return "ipns://" + UTF_8_DECODER.decode(multihash.digest).trim();
            }
            return "ipns://" + multihashes_1.toB58String(cid.multihash);
        }
        default:
            throw new Error("Unrecognized codec: " + codec);
    }
}
exports.contenthashToUri = contenthashToUri;
var tokenListValidator = new ajv_1.default({ allErrors: true }).compile(tokenlist_schema_json_1.default);
/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
function internalGetTokenList(listUrl, provider) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var parsedENS, urls, contentHashUri, error_1, translatedUri, i, url, isLast, response, error_2, json, validationErrors;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    parsedENS = parseENSAddress(listUrl);
                    if (!parsedENS) return [3 /*break*/, 5];
                    contentHashUri = void 0;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, resolveENSContentHash_1.default(parsedENS.ensName, provider)];
                case 2:
                    contentHashUri = _d.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _d.sent();
                    console.debug("Failed to resolve ENS name: " + parsedENS.ensName, error_1);
                    throw new Error("Failed to resolve ENS name: " + parsedENS.ensName);
                case 4:
                    translatedUri = void 0;
                    try {
                        translatedUri = contenthashToUri(contentHashUri);
                    }
                    catch (error) {
                        console.debug("Failed to translate contenthash to URI", contentHashUri);
                        throw new Error("Failed to translate contenthash to URI: " + contentHashUri);
                    }
                    urls = uriToHttp("" + translatedUri + ((_a = parsedENS.ensPath) !== null && _a !== void 0 ? _a : ""));
                    return [3 /*break*/, 6];
                case 5:
                    urls = uriToHttp(listUrl);
                    _d.label = 6;
                case 6:
                    i = 0;
                    _d.label = 7;
                case 7:
                    if (!(i < urls.length)) return [3 /*break*/, 14];
                    url = urls[i];
                    isLast = i === urls.length - 1;
                    response = void 0;
                    _d.label = 8;
                case 8:
                    _d.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, fetch(url)];
                case 9:
                    response = _d.sent();
                    return [3 /*break*/, 11];
                case 10:
                    error_2 = _d.sent();
                    console.debug("Failed to fetch list", listUrl, error_2);
                    if (isLast)
                        throw new Error("Failed to download list " + listUrl);
                    return [3 /*break*/, 13];
                case 11:
                    if (!response.ok) {
                        if (isLast)
                            throw new Error("Failed to download list " + listUrl);
                        return [3 /*break*/, 13];
                    }
                    return [4 /*yield*/, response.json()];
                case 12:
                    json = _d.sent();
                    if (!tokenListValidator(json)) {
                        validationErrors = (_c = (_b = tokenListValidator.errors) === null || _b === void 0 ? void 0 : _b.reduce(function (memo, error) {
                            var _a;
                            var add = error.dataPath + " " + ((_a = error.message) !== null && _a !== void 0 ? _a : "");
                            return memo.length > 0 ? memo + "; " + add : "" + add;
                        }, "")) !== null && _c !== void 0 ? _c : "unknown error";
                        throw new Error("Token list failed validation: " + validationErrors);
                    }
                    return [2 /*return*/, json];
                case 13:
                    i++;
                    return [3 /*break*/, 7];
                case 14: throw new Error("Unrecognized list URL protocol.");
            }
        });
    });
}
exports.internalGetTokenList = internalGetTokenList;
function getTokenList(listUrl, provider) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, internalGetTokenList(listUrl, provider)];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results];
            }
        });
    });
}
exports.default = getTokenList;
