import { authModalState, AuthModalViewEnum } from "@/src/atoms/authModalAtom";
import { auth } from "@/src/firebase/clientApp";
import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";

type CreatePostLinkProps = {};

const CreatePostLink: React.FC<CreatePostLinkProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);
  const onClickInput = () => {
    if (!user) {
      setAuthModalState({ open: true, view: AuthModalViewEnum.login });
      return;
    }
    const { communityId } = router.query;
    router.push(`/r/${communityId}/submit`);
  };
  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      p={2}
      mb={4}
    >
      <Icon as={FaReddit} fontSize="2rem" color="gray.300" mr={4} />
      <Input
        placeholder="Create Post"
        fontSize="0.8rem"
        _placeholder={{ color: "gray.500" }}
        _hover={{ bg: "white", border: "1px solid", borderColor: "blue.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        mr={4}
        onClick={onClickInput}
      />
      <Icon
        as={IoImageOutline}
        fontSize="1.5rem"
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon
        as={BsLink45Deg}
        fontSize="1.5rem"
        color="gray.400"
        cursor="pointer"
      />
    </Flex>
  );
};
export default CreatePostLink;
