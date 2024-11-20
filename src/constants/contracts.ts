export const FHENIX_CHAIN_ID = 8008148;
export const FHENIX_CHAIN_ID_LOCAL = 412346;

export const SUPPORTED_CHAINS = [FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL];

export const TOKENS: {
  [chainId: number]: { symbol: string; address: `0x${string}` }[];
} = {
  [FHENIX_CHAIN_ID]: [
    { symbol: "DAI", address: "0x2a320A0DDDFB778ff80F0321c684b9a86771B8f9" },
  ],
  [FHENIX_CHAIN_ID_LOCAL]: [
    { symbol: "USDT", address: "0x20E068a567630483901Af229a6eCF5eb401A5D66" },
    { symbol: "DAI", address: "0xF126547C7B6C78D5e7876a96f4FCE9bcBF5dB529" },
    { symbol: "BNB", address: "0x3af00077e984074Ad71D8A856be75A9Fe2A5711b" },
    { symbol: "SUI", address: "0x09a991DDA02984D3B6C6dC42348E07678691Dea8" },
    { symbol: "AAVE", address: "0x4bfEA237e1757F7B57bD1ef6da4EE2A3122275cd" },
  ],
};

export const TOKEN_LOGO: { [name: string]: string } = {
  DAI: "https://assets.coingecko.com/coins/images/9956/standard/Badge_Dai.png",
  USDT: "https://assets.coingecko.com/coins/images/325/standard/Tether.png",
  BNB: "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png",
  SUI: "https://assets.coingecko.com/coins/images/26375/standard/sui-ocean-square.png",
  AAVE: "https://assets.coingecko.com/coins/images/12645/standard/aave-token-round.png",
};

export const GAS_LIMIT: { [chainId: number]: number } = {
  [FHENIX_CHAIN_ID]: 4_000_000,
  [FHENIX_CHAIN_ID_LOCAL]: 3_000_000,
};

export const POOL: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x417b80C8c11f05097039198Aa714e068aE9daa0E",
  [FHENIX_CHAIN_ID_LOCAL]: "0x5B0ABc8c4e9Cd491C2A204bf8581Da3Ad9284ff9",
};
export const POOL_CORE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0xfe9517F1A0F46e105c02c99de8FB18CAF3d197AB",
  [FHENIX_CHAIN_ID_LOCAL]: "0xc172fc2df2E4841DFf0e2A8395318E51dB031053",
};
export const POOL_ADDRESSES_PROVIDER: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x4208C0f3FB8988BfFa260573Ec8dE51fD4896D37",
  [FHENIX_CHAIN_ID_LOCAL]: "0xbeb4eF1fcEa618C6ca38e3828B00f8D481EC2CC2",
};

export const PRICE_ORACLE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x16BC76613aC12540Cc87377bff3ebAD37B2aD9CF",
  [FHENIX_CHAIN_ID_LOCAL]: "0xbCC7589da48B323afDB81810B064815Fe530ebe2",
};
