import { useEffect, useMemo } from "react";
import { useApprove } from "../hooks/useApproval";
import { Button } from "@chakra-ui/react";
import { POOL_CORE, TOKEN_TEST } from "@/constants/contracts";

export function ApproveButton({
  amount,
  isFetchingAllowance,
  refetchAllowance,
}: {
  amount: string;
  isFetchingAllowance: boolean;
  refetchAllowance: () => void;
}) {
  const { isLoading, isSuccess, approve } = useApprove(TOKEN_TEST, POOL_CORE);

  useEffect(() => {
    if (isSuccess) {
      refetchAllowance();
    }
  }, [refetchAllowance, isSuccess]);

  const buttonLoadingText = useMemo(() => {
    if (isLoading) return "Confirming...";
    if (isFetchingAllowance) return "Fetching allowance...";
    return "Approve";
  }, [isLoading, isFetchingAllowance]);

  const approvalLoading = isLoading || isFetchingAllowance;

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
