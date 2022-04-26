# get-token-list

Retrieve a tokenList given a HTTP or .eth url

### Install 

```
yarn add get-token-list
```

## Use 

```javascript
import getTokenList from from "get-token-list"

const provider = ethers.getDefaultProvider() // Set up a provider we can pass
const list = await getTokenList("tokens.1inch.eth", provider)

```

## Where to get token lists?

https://tokenlists.org/

## Credits

This is a 1-1 scrape of the code from Uniswap Interface: https://github.com/Uniswap/uniswap-interface

## Considerations

This code should be refactored

Also since we have access to the .eth.link we may want to use that as the default and use ENS as fallback