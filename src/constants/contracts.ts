export const FHENIX_CHAIN_ID = 8008135;
export const FHENIX_CHAIN_ID_LOCAL = 412346;

export const TOKENS: {
  [chainId: number]: { symbol: string; address: `0x${string}` }[];
} = {
  [FHENIX_CHAIN_ID]: [
    { symbol: "USDT", address: "0xF775b6c3854748Dc0D2Ef9E0D82d13eFF295569C" },
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
  [FHENIX_CHAIN_ID]: "0xDE603943466310b6c6CcC54dfeD5264F1cfd5A28",
  [FHENIX_CHAIN_ID_LOCAL]: "0x6669cB4d3487139c413d227cfd8d1fA702772718",
};
export const POOL_CORE: { [chainId: number]: `0x${string}` } = {
  [FHENIX_CHAIN_ID]: "0xb00C2be32C16cE0C50f98b73502f01b2840790a7",
  [FHENIX_CHAIN_ID_LOCAL]: "0xEc3546f68593dddD6Fca089c903c5D60Ebd560B0",
};
