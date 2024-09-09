import { Button, ButtonProps } from "@chakra-ui/react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount } from "wagmi";

export default function ConnectButton(props: ButtonProps) {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        <w3m-button />
      ) : (
        <Button size="sm" onClick={() => open()} {...props}>
          Connect wallet
        </Button>
      )}
    </>
  );
}
