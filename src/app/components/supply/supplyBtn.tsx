import { useEffect, useMemo, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { ethers, JsonRpcProvider } from "ethers";
import { BrowserProvider } from "ethers";
import { FhenixClient } from "fhenixjs";
import { useAccount } from "wagmi";
import { fhenixChainId } from "@/config/web3modal";
import { Eip1193Provider } from "ethers";
import { POOL } from "@/constants/contracts";
import poolAbi from "@/constants/abi/pool.json";

export function SupplyButton({
  amount,
  isFetchingAllowance,
  refetchAllowance,
  refetchStakedBalance,
  refetchBalance,
}: {
  amount: string;
  poolAddress: `0x${string}`;
  isFetchingAllowance?: boolean;
  refetchAllowance?: () => void;
  refetchStakedBalance?: () => void;
  refetchBalance?: () => void;
}) {
  const { chainId, isConnected, connector, address } = useAccount();
  const fhenixProvider = useRef<JsonRpcProvider | BrowserProvider>();
  const fhenixClient = useRef<FhenixClient>();

  useEffect(() => {
    if (connector && chainId === fhenixChainId) {
      connector.getProvider().then((provider) => {
        fhenixProvider.current = new BrowserProvider(
          provider as Eip1193Provider
        );
        fhenixClient.current = new FhenixClient({
          provider: fhenixProvider.current as any,
        });
      });
    }
  }, [connector, chainId]);

  async function deposit() {
    if (!fhenixClient.current || !fhenixProvider.current) return;
    let encrypted = await fhenixClient.current.encrypt_uint32(+amount);

    const signer = await fhenixProvider.current.getSigner();

    const contract = new ethers.Contract(POOL, poolAbi, signer);
    // @todo: Load proper types for the contract.
    const contractWithSigner = contract.connect(signer);
    //@ts-ignore
    const tx = await contractWithSigner.deposit(poolAddress, encrypted, 1n);
    console.log(tx);
    return await tx.wait();
  }

  return <Button onClick={deposit}>Stake</Button>;
}
