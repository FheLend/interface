export const FHENIX_CHAIN_ID = 8008135;
export const FHENIX_CHAIN_ID_LOCAL = 412346;

export const SUPPORTED_CHAINS = [FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL];

export const TOKENS: {
  [chainId: number]: { symbol: string; address: `0x${string}` }[];
} = {
  [FHENIX_CHAIN_ID]: [
    { symbol: "USDT", address: "0x01eF7ED545FC2632c4c69de706441e0327dFE0Dc" },
  ],
  [FHENIX_CHAIN_ID_LOCAL]: [
    { symbol: "USDT", address: "0xade09a9b557B6DFb410D8e68f396991dADD8354A" },
    { symbol: "DAI", address: "0x2D9E715712Be986F97aF613a7aa5424BA4F6e2b4" },
  ],
};

export const TOKEN_LOGO: { [name: string]: string } = {
  DAI: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png",
  USDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
};

export const POOL: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x58c210109bFa288D0Aca084599bE04c6f43591B2",
  [FHENIX_CHAIN_ID_LOCAL]: "0x58c210109bFa288D0Aca084599bE04c6f43591B2",
};
export const POOL_CORE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x48e310B5dcecb5D17C3aC59624Ac61468DE7d108",
  [FHENIX_CHAIN_ID_LOCAL]: "0x48e310B5dcecb5D17C3aC59624Ac61468DE7d108",
};
