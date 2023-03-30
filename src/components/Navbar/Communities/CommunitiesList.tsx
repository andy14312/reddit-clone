import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import React, { useState } from "react";
import { GrAdd } from "react-icons/gr";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";

type CommunitiesListProps = {};

const CommunitiesList: React.FC<CommunitiesListProps> = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <CreateCommunityModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
      <MenuItem
        width="100%"
        fontSize="10pt"
        _hover={{ bg: "gray.100" }}
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <Flex align="center">
          <Icon as={GrAdd} mr={2} fontSize={20} />
          Create community
        </Flex>
      </MenuItem>
    </>
  );
};
export default CommunitiesList;
