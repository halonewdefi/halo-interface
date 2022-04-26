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
var ethers_1 = require("ethers");
var isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
var utils_1 = __importDefault(require("./utils"));
describe("getTokenList", function () {
    test("Token List from 1inch works with Uni worker", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, uniList, fromUniRes, fromUni;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = ethers_1.ethers.getDefaultProvider();
                    return [4 /*yield*/, utils_1.default("tokens.1inch.eth", provider)];
                case 1:
                    uniList = _a.sent();
                    return [4 /*yield*/, isomorphic_fetch_1.default("https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link")];
                case 2:
                    fromUniRes = _a.sent();
                    return [4 /*yield*/, fromUniRes.json()];
                case 3:
                    fromUni = _a.sent();
                    expect(uniList).toMatchObject(fromUni);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Token List from 1inch works with .eth.link dns", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, uniList, fromEthRes, fromEth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = ethers_1.ethers.getDefaultProvider();
                    return [4 /*yield*/, utils_1.default("tokens.1inch.eth", provider)];
                case 1:
                    uniList = _a.sent();
                    return [4 /*yield*/, isomorphic_fetch_1.default("http://tokens.1inch.eth.link")];
                case 2:
                    fromEthRes = _a.sent();
                    return [4 /*yield*/, fromEthRes.json()];
                case 3:
                    fromEth = _a.sent();
                    expect(uniList).toMatchObject(fromEth);
                    return [2 /*return*/];
            }
        });
    }); });
    test("Expect Token List for Json Lists to work", function () { return __awaiter(void 0, void 0, void 0, function () {
        var provider, uniList, fromServiceWorkerRes, fromServiceWorker;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    provider = ethers_1.ethers.getDefaultProvider();
                    return [4 /*yield*/, utils_1.default("https://tokens.coingecko.com/uniswap/all.json", provider)];
                case 1:
                    uniList = _a.sent();
                    return [4 /*yield*/, isomorphic_fetch_1.default("https://tokens.coingecko.com/uniswap/all.json")];
                case 2:
                    fromServiceWorkerRes = _a.sent();
                    return [4 /*yield*/, fromServiceWorkerRes.json()];
                case 3:
                    fromServiceWorker = _a.sent();
                    expect(uniList).toMatchObject(fromServiceWorker);
                    return [2 /*return*/];
            }
        });
    }); });
});
