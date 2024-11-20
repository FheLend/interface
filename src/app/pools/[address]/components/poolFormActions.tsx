"use client";

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/tabs";
import SupplyForm from "@/app/components/supplyModal/supplyForm";
import BorrowForm from "@/app/components/borrowModal/borrowForm";
import RepayForm from "@/app/components/repay/repayForm";
import WithdrawForm from "@/app/components/withdrawModal/withdrawForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function PoolFormActions({
  poolAddress,
  depositAPR,
  depositAPY,
  aTokenAddress,
  availableLiquidity,
}: any) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (tab) {
      const tabIndex = ["supply", "withdraw", "borrow", "repay"].indexOf(
        tab as string
      );
      if (tabIndex !== -1) {
        setActiveTab(tabIndex);
      }
    }
  }, [tab]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    const tabNames = ["supply", "withdraw", "borrow", "repay"];
    const selectedTab = tabNames[index];
    const params = new URLSearchParams(window.location.search);
    params.set("tab", selectedTab);
    params.delete("token");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  return (
    <Tabs
      variant="basic"
      colorScheme="primary"
      index={activeTab}
      onChange={handleTabChange}
      isLazy
    >
      <TabList>
        <Tab>Supply</Tab>
        <Tab>Withdraw</Tab>
        <Tab>Borrow</Tab>
        <Tab>Repay</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SupplyForm
            poolAddress={poolAddress as `0x${string}`}
            apr={depositAPR}
            apy={depositAPY}
          />
        </TabPanel>
        <TabPanel>
          <WithdrawForm aTokenAddress={aTokenAddress as `0x${string}`} />
        </TabPanel>
        <TabPanel>
          <BorrowForm
            poolAddress={poolAddress as `0x${string}`}
            availableLiquidity={availableLiquidity}
            allowSelect
          />
        </TabPanel>
        <TabPanel>
          <RepayForm poolAddress={poolAddress as `0x${string}`} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

export default PoolFormActions;
