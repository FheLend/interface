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
    { symbol: "USDT", address: "0x20E068a567630483901Af229a6eCF5eb401A5D66" },
    { symbol: "DAI", address: "0xF126547C7B6C78D5e7876a96f4FCE9bcBF5dB529" },
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
  [FHENIX_CHAIN_ID_LOCAL]: "0x5B0ABc8c4e9Cd491C2A204bf8581Da3Ad9284ff9",
};
export const POOL_CORE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x48e310B5dcecb5D17C3aC59624Ac61468DE7d108",
  [FHENIX_CHAIN_ID_LOCAL]: "0xc172fc2df2E4841DFf0e2A8395318E51dB031053",
};
export const POOL_ADDRESSES_PROVIDER: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x74F375E7703B8b65d406fe9f938FDa27F4242AF8",
  [FHENIX_CHAIN_ID_LOCAL]: "0xbeb4eF1fcEa618C6ca38e3828B00f8D481EC2CC2",
};

export const PRICE_ORACLE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0x4E6218cEDddc8553aE68Ea04381daa03da02138f",
  [FHENIX_CHAIN_ID_LOCAL]: "0xbCC7589da48B323afDB81810B064815Fe530ebe2",
};
