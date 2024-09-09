import { Box, BoxProps, Divider, Flex, Spacer } from "@chakra-ui/react";
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

export function Card({
  title,
  sub,
  ...props
}: { title?: string | JSX.Element; sub?: string | JSX.Element } & BoxProps) {
  return (
    <Box
      bgColor="primary.800"
      px="10"
      py="8"
      color="whiteAlpha.800"
      borderRadius="2xl"
      {...props}
    >
      {title && (
        <>
          <Flex alignItems="center" fontSize="lg" fontWeight="medium">
            {title}
            <Spacer />
            {sub}
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
