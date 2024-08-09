import { useEffect, useMemo } from "react";
import { useApprove } from "../hooks/useApproval";
import { Button } from "@chakra-ui/react";
import { POOL_CORE, TOKEN_TEST } from "@/constants/contracts";
import { useChainId } from "wagmi";

export function ApproveButton({
  amount,
  isFetchingAllowance,
  refetchAllowance,
}: {
  amount: string;
  isFetchingAllowance: boolean;
  refetchAllowance: () => void;
}) {
  const chainId = useChainId();
  const { isLoading, isTxLoading, isSuccess, approve } = useApprove(
    TOKEN_TEST[chainId],
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
    <Button
      isDisabled={!amount || approvalLoading}
      isLoading={approvalLoading}
      loadingText={buttonLoadingText}
      onClick={approve}
    >
      Approve
    </Button>
  );
}
