export const FHENIX_CHAIN_ID = 8008135;
export const FHENIX_CHAIN_ID_LOCAL = 412346;

export const SUPPORTED_CHAINS = [FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL];

export const TOKENS: {
  [chainId: number]: { symbol: string; address: `0x${string}` }[];
} = {
  [FHENIX_CHAIN_ID]: [
    { symbol: "USDT", address: "0x01eF7ED545FC2632c4c69de706441e0327dFE0Dc" },
    { symbol: "DAI", address: "0xA6cb3785e7A675d850215a3211777cFB77Ca1C7C" },
  ],
  [FHENIX_CHAIN_ID_LOCAL]: [
    { symbol: "USDT", address: "0x03820fB370EE34d30833edD544B0A66D67623976" },
    { symbol: "DAI", address: "0x4aB8f750906a60B8688f44ddA65DA2b54D01B89a" },
  ],
};

export const TOKEN_LOGO: { [name: string]: string } = {
  DAI: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png",
  USDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
};

export const GAS_LIMIT: { [chainId: number]: number } = {
  [FHENIX_CHAIN_ID]: 400_000_000,
  [FHENIX_CHAIN_ID_LOCAL]: 3_000_000,
};

export const POOL: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x58c210109bFa288D0Aca084599bE04c6f43591B2",
  [FHENIX_CHAIN_ID_LOCAL]: "0x0B8a0070d40b65a0515D88524162eb14e37aE903",
};
export const POOL_CORE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x48e310B5dcecb5D17C3aC59624Ac61468DE7d108",
  [FHENIX_CHAIN_ID_LOCAL]: "0xBf2CA6026553Cd08daB954B7fc51eD75dAd5e354",
};
export const POOL_ADDRESSES_PROVIDER: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x74F375E7703B8b65d406fe9f938FDa27F4242AF8",
  [FHENIX_CHAIN_ID_LOCAL]: "0x022Bd81E9fB057fA37F4da76380E86eB6E7CFd81",
};

export const PRICE_ORACLE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x4E6218cEDddc8553aE68Ea04381daa03da02138f",
  [FHENIX_CHAIN_ID_LOCAL]: "0xac36800cfC5efbEe2494458723e4ec7F313ee3E5",
};
