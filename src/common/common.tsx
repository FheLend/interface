import {
  Box,
  BoxProps,
  Divider,
  Flex,
  Spacer,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { TagProps, Tag as ChakraTag } from "@chakra-ui/tag";

export function Tag({
  title,
  sub,
  ...props
}: { title: string; sub: string } & TagProps) {
  return (
    <ChakraTag bgColor="primary.800" px="4" color="whiteAlpha.500" {...props}>
      {title}
      <Box ml="3" color="whiteAlpha.900">
        {sub}
      </Box>
    </ChakraTag>
  );
}

export function PrivateText({
  isShow,
  ...props
}: { isShow: boolean } & TextProps) {
  return (
    <Text {...props} as="span">
      {isShow ? props.children : "******"}
    </Text>
  );
}

export function Card({
  cardTitle,
  subTitle,
  ...props
}: {
  cardTitle?: string | JSX.Element;
  subTitle?: string | JSX.Element;
} & BoxProps) {
  return (
    <Box
      bgColor="primary.800"
      px="10"
      py="8"
      color="whiteAlpha.800"
      borderRadius="2xl"
      {...props}
    >
      {cardTitle && (
        <>
          <Flex alignItems="center" fontSize="lg" fontWeight="medium">
            {cardTitle}
            <Spacer />
            {subTitle}
          </Flex>
          <Divider opacity="0.1" mt="4" mb="5" />
        </>
      )}
      {props.children}
    </Box>
  );
}

export function TextAutoEllipsis(props: BoxProps) {
  return (
    <Box
      maxW="110px"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      overflow="hidden"
      title={props.children}
      {...props}
    >
      {props.children}
    </Box>
  );
}
