import CID from "cids";
import Ajv from "ajv";
import { getCodec, rmPrefix } from "multicodec";
import { decode, toB58String } from "multihashes";
import { TokenList } from "@uniswap/token-lists";
import schema from "@uniswap/token-lists/src/tokenlist.schema.json";
import { providers } from "ethers";
import resolveENSContentHash from "./resolveENSContentHash";

const ENS_NAME_REGEX = /^(([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+)eth(\/.*)?$/;

export function parseENSAddress(
  ensAddress: string
): { ensName: string; ensPath: string | undefined } | undefined {
  const match = ensAddress.match(ENS_NAME_REGEX);
  if (!match) return undefined;
  return { ensName: `${match[1].toLowerCase()}eth`, ensPath: match[4] };
}

/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
export function uriToHttp(uri: string): string[] {
  const protocol = uri.split(":")[0].toLowerCase();
  switch (protocol) {
    case "https":
      return [uri];
    case "http":
      return [`https${uri.substr(4)}`, uri];
    case "ipfs":
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipfs/${hash}/`,
        `https://ipfs.io/ipfs/${hash}/`,
      ];
    case "ipns":
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return [
        `https://cloudflare-ipfs.com/ipns/${name}/`,
        `https://ipfs.io/ipns/${name}/`,
      ];
    default:
      return [];
  }
}

export function hexToUint8Array(hex: string): Uint8Array {
  hex = hex.startsWith("0x") ? hex.substr(2) : hex;
  if (hex.length % 2 !== 0)
    throw new Error("hex must have length that is multiple of 2");
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
}

const UTF_8_DECODER = new TextDecoder();

/**
 * Returns the URI representation of the content hash for supported codecs
 * @param contenthash to decode
 */
export function contenthashToUri(contenthash: string): string {
  const buff = hexToUint8Array(contenthash);
  const codec = getCodec(buff as Buffer); // the typing is wrong for @types/multicodec
  switch (codec) {
    case "ipfs-ns": {
      const data = rmPrefix(buff as Buffer);
      const cid = new CID(data);
      return `ipfs://${toB58String(cid.multihash)}`;
    }
    case "ipns-ns": {
      const data = rmPrefix(buff as Buffer);
      const cid = new CID(data);
      const multihash = decode(cid.multihash);
      if (multihash.name === "identity") {
        return `ipns://${UTF_8_DECODER.decode(multihash.digest).trim()}`;
      }
      return `ipns://${toB58String(cid.multihash)}`;
    }
    default:
      throw new Error(`Unrecognized codec: ${codec}`);
  }
}

const tokenListValidator = new Ajv({ allErrors: true }).compile(schema);

/**
 * Contains the logic for resolving a list URL to a validated token list
 * @param listUrl list url
 * @param resolveENSContentHash resolves an ens name to a contenthash
 */
export async function internalGetTokenList(
  listUrl: string,
  provider: providers.Provider
): Promise<TokenList> {
  const parsedENS = parseENSAddress(listUrl);
  let urls: string[];
  if (parsedENS) {
    let contentHashUri;
    try {
      contentHashUri = await resolveENSContentHash(parsedENS.ensName, provider);
    } catch (error) {
      console.debug(`Failed to resolve ENS name: ${parsedENS.ensName}`, error);
      throw new Error(`Failed to resolve ENS name: ${parsedENS.ensName}`);
    }
    let translatedUri;
    try {
      translatedUri = contenthashToUri(contentHashUri);
    } catch (error) {
      console.debug("Failed to translate contenthash to URI", contentHashUri);
      throw new Error(
        `Failed to translate contenthash to URI: ${contentHashUri}`
      );
    }
    urls = uriToHttp(`${translatedUri}${parsedENS.ensPath ?? ""}`);
  } else {
    urls = uriToHttp(listUrl);
  }
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const isLast = i === urls.length - 1;
    let response;
    try {
      response = await fetch(url);
    } catch (error) {
      console.debug("Failed to fetch list", listUrl, error);
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    if (!response.ok) {
      if (isLast) throw new Error(`Failed to download list ${listUrl}`);
      continue;
    }

    const json: TokenList = await response.json();
    if (!tokenListValidator(json)) {
      const validationErrors: string =
        tokenListValidator.errors?.reduce<string>((memo, error) => {
          const add = `${error.dataPath} ${error.message ?? ""}`;
          return memo.length > 0 ? `${memo}; ${add}` : `${add}`;
        }, "") ?? "unknown error";
      throw new Error(`Token list failed validation: ${validationErrors}`);
    }
    return json;
  }
  throw new Error("Unrecognized list URL protocol.");
}

export default async function getTokenList(
  listUrl: string,
  provider: providers.Provider
): Promise<TokenList> {
  const results = await internalGetTokenList(listUrl, provider);
  return results;
}
