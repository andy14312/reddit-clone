import { ICommunity, ICommunitySnippet } from "@/src/atoms/communitiesAtom";
import useCommunityData from "@/src/hooks/useCommunityData";
import { Box, Button, Flex, Icon, Image, Text } from "@chakra-ui/react";
import React from "react";
import { FaReddit } from "react-icons/fa";

type HeaderProps = {
  communityData: ICommunity;
};

const CommunityHeader: React.FC<HeaderProps> = ({ communityData }) => {
  const { communityStateValue, joinOrLeaveCommunity, loading } =
    useCommunityData();
  const isJoined = !!communityStateValue.snippets.find(
    (snippet: ICommunitySnippet) => snippet.communityId === communityData.id
  );

  return (
    <Flex direction="column" width="100%" height="146px">
      <Box height="50%" bg="blue.400"></Box>
      <Flex justify="center" bg="white" flexGrow={1}>
        <Flex width="95%" maxWidth="860px">
          {communityStateValue?.currentCommunity?.imageURL ? (
            <Image
              src={communityStateValue.currentCommunity.imageURL}
              alt="Community thumbnail image"
              boxSize="66px"
              borderRadius="full"
              position="relative"
              top="-3px"
              color="blue.500"
              border="4px solid white"
            />
          ) : (
            <Icon
              as={FaReddit}
              fontSize={64}
              position="relative"
              color="blue.500"
              border="4px solid white"
              borderRadius="50%"
              top="-3px"
            />
          )}
          <Flex padding="10px 16px">
            <Flex direction="column" mr={6}>
              <Text fontWeight={800} fontSize="1rem">
                {communityData.id}
              </Text>
              <Text fontWeight={600} fontSize="0.8rem" color="gray.400">
                r/{communityData.id}
              </Text>
            </Flex>
            <Button
              variant={isJoined ? "outline" : "solid"}
              height="30px"
              pr={6}
              pl={6}
              onClick={() => {
                joinOrLeaveCommunity(communityData, isJoined);
              }}
              isLoading={loading}
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default CommunityHeader;
