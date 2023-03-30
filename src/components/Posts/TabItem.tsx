import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { TabItem } from "./NewPostForm";

type TabItemProps = {
  item: TabItem;
  selected: boolean;
  setSelectedTab: (value: string) => void;
};

const TabItem: React.FC<TabItemProps> = ({
  item,
  selected,
  setSelectedTab,
}) => {
  return (
    <Flex
      align="center"
      justify="center"
      flexGrow={1}
      p="14px 0"
      cursor="pointer"
      fontWeight={700}
      fontSize="0.9rem"
      _hover={{ bg: "gray.50" }}
      color={selected ? "blue.500" : "gray.500"}
      borderWidth={selected ? "0px 1px 2px 0px" : "0px 1px 1px 0px"}
      borderBottomColor={selected ? "blue.500" : "gray.200"}
      borderRightColor="gray.200"
      onClick={() => setSelectedTab(item.name)}
    >
      <Icon as={item.icon} mr={2} height="20px" />
      <Text>{item.title}</Text>
    </Flex>
  );
};
export default TabItem;
