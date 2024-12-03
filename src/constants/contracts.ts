export const FHENIX_CHAIN_ID = 8008148;
export const FHENIX_CHAIN_ID_LOCAL = 412346;

export const SUPPORTED_CHAINS = [FHENIX_CHAIN_ID, FHENIX_CHAIN_ID_LOCAL];

export const WHITE_LIST: `0x${string}`[] = [
  "0x9E97A40996c749C8C86F16b4F412dD96467da69C",
];

export const TOKENS: {
  [chainId: number]: { symbol: string; address: `0x${string}` }[];
} = {
  [FHENIX_CHAIN_ID]: [
    { symbol: "USDT", address: "0x10672Bfb7c9B90Ad3a1C53EBa433bc0d15d53E7E" },
    { symbol: "DAI", address: "0x804f702117B7809c12ED624373FE3230006a7815" },
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
  [FHENIX_CHAIN_ID]: "0xb7FD1F702f37a997213e53D137102fda78CdDd08",
  [FHENIX_CHAIN_ID_LOCAL]: "0x5B0ABc8c4e9Cd491C2A204bf8581Da3Ad9284ff9",
};
export const POOL_CORE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x3dCFFD91767f158e1977D5bBA75E66E715aFaF7b",
  [FHENIX_CHAIN_ID_LOCAL]: "0xc172fc2df2E4841DFf0e2A8395318E51dB031053",
};
export const POOL_ADDRESSES_PROVIDER: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x5Ef4656BDB1c1127E2B3b8fC2502d6AcC20AA1Fa",
  [FHENIX_CHAIN_ID_LOCAL]: "0xbeb4eF1fcEa618C6ca38e3828B00f8D481EC2CC2",
};

export const PRICE_ORACLE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x707E0143BfBB629674EccA2AE2fBCfa4c81E46EF",
  [FHENIX_CHAIN_ID_LOCAL]: "0xbCC7589da48B323afDB81810B064815Fe530ebe2",
};
