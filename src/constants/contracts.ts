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
    { symbol: "USDT", address: "0x20E068a567630483901Af229a6eCF5eb401A5D66" },
    { symbol: "DAI", address: "0xf621eb91625Eb049d7E3c03497Faf8bfE9B72823" },
  ],
};

export const TOKEN_LOGO: { [name: string]: string } = {
  DAI: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png",
  USDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
};

export const POOL: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x58c210109bFa288D0Aca084599bE04c6f43591B2",
  [FHENIX_CHAIN_ID_LOCAL]: "0x5B0ABc8c4e9Cd491C2A204bf8581Da3Ad9284ff9",
};
export const POOL_CORE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x48e310B5dcecb5D17C3aC59624Ac61468DE7d108",
  [FHENIX_CHAIN_ID_LOCAL]: "0xc172fc2df2E4841DFf0e2A8395318E51dB031053",
};
