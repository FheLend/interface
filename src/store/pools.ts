import { create } from "zustand";

interface UserAccountData {
  totalLiquidityETH: bigint;
  totalCollateralETH: bigint;
  totalBorrowsETH: bigint;
  totalFeesETH: bigint;
  availableBorrowsETH: bigint;
  currentLiquidationThreshold: bigint;
  ltv: bigint;
  healthFactor: bigint;
}

interface Token {
  decimals: number;
  symbol: string;
  logo?: string;
}

interface TokensState {
  tokens: Record<string, Token>;
  setTokens: (tokens: Record<string, Token>) => void;
}

interface ReservesState {
  reserves: `0x${string}`[];
  setReserves: (addresses: `0x${string}`[]) => void;
}

interface UserAccountDataState {
  userAccountData?: UserAccountData;
  setUserAccountData: (data: any[]) => void;
}

export const useReserves = create<ReservesState>((set) => ({
  reserves: [],
  setReserves: (addresses) => set({ reserves: addresses }),
}));

export const useTokens = create<TokensState>((set) => ({
  tokens: {},
  setTokens: (tokens) => set({ tokens: tokens }),
}));

export const useUserAccountData = create<UserAccountDataState>((set) => ({
  userAccountData: undefined,
  setUserAccountData: (data) =>
    set({
      userAccountData: {
        totalLiquidityETH: data[0],
        totalCollateralETH: data[1],
        totalBorrowsETH: data[2],
        totalFeesETH: data[3],
        availableBorrowsETH: data[4],
        currentLiquidationThreshold: data[5],
        ltv: data[6],
        healthFactor: data[7],
      },
    }),
}));

export const useBalances = create<UserAccountDataState>((set) => ({
  userAccountData: undefined,
  setUserAccountData: (data) =>
    set({
      userAccountData: {
        totalLiquidityETH: data[0],
        totalCollateralETH: data[1],
        totalBorrowsETH: data[2],
        totalFeesETH: data[3],
        availableBorrowsETH: data[4],
        currentLiquidationThreshold: data[5],
        ltv: data[6],
        healthFactor: data[7],
      },
    }),
}));
