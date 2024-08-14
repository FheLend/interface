import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/menu";
import { Box, Button, Center, Flex } from "@chakra-ui/react";
import Image from "next/image";
import logo from "@/images/felend.svg";
import ConnectButton from "../../common/connect-button";
import Link from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { SUPPORTED_CHAINS } from "@/constants/contracts";
import { useAccount, useChainId, useChains, useSwitchChain } from "wagmi";

function ChainSelector() {
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  return (
    <>
      <Menu>
        <MenuButton
          ml="4"
          as={Button}
          rightIcon={<ChevronDownIcon />}
          size="sm"
          variant="outline"
        >
          {chains.find((chain) => chain.id === chainId)?.name}
        </MenuButton>
        <MenuList bg="primary.800">
          <MenuOptionGroup
            value={`${chainId}`}
            onChange={(e) => switchChain({ chainId: +e })}
            type="radio"
          >
            {chains.map((chain) => (
              <MenuItemOption
                bg="primary.800"
                _hover={{ bg: "primary.900" }}
                key={chain.id}
                value={`${chain.id}`}
              >
                {chain.name}
              </MenuItemOption>
            ))}
          </MenuOptionGroup>
        </MenuList>
      </Menu>
    </>
  );
}

export default ChainSelector;
