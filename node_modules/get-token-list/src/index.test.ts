import { ethers } from "ethers";
import fetch from "isomorphic-fetch";
import getTokenList from "./utils";

describe("getTokenList", () => {
  test("Token List from 1inch works with Uni worker", async () => {
    const provider = ethers.getDefaultProvider();
    const uniList = await getTokenList("tokens.1inch.eth", provider);
    const fromUniRes = await fetch(
      "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link"
    );
    const fromUni = await fromUniRes.json();
    expect(uniList).toMatchObject(fromUni);
  });
  test("Token List from 1inch works with .eth.link dns", async () => {
    const provider = ethers.getDefaultProvider();
    const uniList = await getTokenList("tokens.1inch.eth", provider);
    const fromEthRes = await fetch("http://tokens.1inch.eth.link");
    const fromEth = await fromEthRes.json();
    expect(uniList).toMatchObject(fromEth);
  });

  test("Expect Token List for Json Lists to work", async () => {
    const provider = ethers.getDefaultProvider();
    const uniList = await getTokenList(
      "https://tokens.coingecko.com/uniswap/all.json",
      provider
    );
    const fromServiceWorkerRes = await fetch(
      "https://tokens.coingecko.com/uniswap/all.json"
    );
    const fromServiceWorker = await fromServiceWorkerRes.json();
    expect(uniList).toMatchObject(fromServiceWorker);
  });
});
