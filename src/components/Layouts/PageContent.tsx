import { Flex } from "@chakra-ui/react";
import React from "react";

type PageContentProps = {
  children: any;
};

const PageContent: React.FC<PageContentProps> = ({ children }) => {
  return (
    <Flex justify="center" p="16px 0">
      <Flex width="95%" maxWidth="860px">
        {/* LHS */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "65%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children[0] && children[0]}
        </Flex>

        {/* RHS */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          flexGrow={1}
        >
          {children[1] && children[1]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageContent;
