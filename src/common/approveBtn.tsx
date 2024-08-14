import { useEffect, useMemo } from "react";
import { useApprove } from "../hooks/useApproval";
import { Box, Button } from "@chakra-ui/react";
import { POOL_CORE } from "@/constants/contracts";
import { useChainId } from "wagmi";

export function ApproveButton({
  amount,
  address,
  isFetchingAllowance,
  refetchAllowance,
}: {
  amount: string;
  address: `0x${string}`;
  isFetchingAllowance: boolean;
  refetchAllowance: () => void;
}) {
  const chainId = useChainId();
  const { isLoading, isTxLoading, isSuccess, approve, error } = useApprove(
    address,
    POOL_CORE[chainId]
  );

  useEffect(() => {
    if (isSuccess) {
      refetchAllowance();
    }
  }, [refetchAllowance, isSuccess]);

  const buttonLoadingText = useMemo(() => {
    if (isLoading) return "Confirming...";
    if (isTxLoading) return "Waiting for tx...";
    if (isFetchingAllowance) return "Fetching allowance...";
    return "Approve";
  }, [isLoading, isTxLoading, isFetchingAllowance]);

  const approvalLoading = isLoading || isFetchingAllowance || isTxLoading;

  return (
    <>
      <Button
        isDisabled={!amount || approvalLoading}
        isLoading={approvalLoading}
        loadingText={buttonLoadingText}
        onClick={approve}
      >
        Approve
      </Button>
      {error && (
        <Box mt="2" fontSize="small" color="red.300" wordBreak="break-word">
          {error.message}
        </Box>
      )}
    </>
  );
}
