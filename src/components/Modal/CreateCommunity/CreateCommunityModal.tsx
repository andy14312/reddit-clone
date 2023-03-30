import {
  COMMUNITY_NAME_MAX_CHARS,
  COMMUNITY_NAME_MIN_LENGTH,
  COMMUNITY_NAME_REGEX,
} from "@/src/constants/communities";
import { auth, firestore } from "@/src/firebase/clientApp";
import { COMMUNITIES_COLLECTION_NAME } from "@/src/firebase/communities";
import { ECommunityType } from "@/src/types/communities";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Divider,
  Text,
  Input,
  Stack,
  RadioGroup,
  Radio,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

type CreateCommunityModalProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  open,
  handleClose,
}) => {
  // Function state
  const [communityName, setCommunityName] = useState("");
  const [communityType, setCommunityType] = useState(
    ECommunityType.public as string
  );
  const [charsRemaining, setCharsRemaining] = useState(
    COMMUNITY_NAME_MAX_CHARS
  );
  const [error, setError] = useState("");
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  // Function handlers
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = event.target.value;
    if (nameValue.length > COMMUNITY_NAME_MAX_CHARS) {
      return;
    }
    setCommunityName(nameValue);
    setCharsRemaining(COMMUNITY_NAME_MAX_CHARS - nameValue.length);
  };

  const handleCreateCommunity = async () => {
    if (error) {
      setError("");
    }
    // validate the community name
    if (
      COMMUNITY_NAME_REGEX.test(communityName) ||
      communityName.length < COMMUNITY_NAME_MIN_LENGTH
    ) {
      setError(
        "Community name must be between 3-21 characters, and only contain letters, numbers or underscores"
      );
      return;
    }
    setLoading(true);
    try {
      // create the community document in firestore
      const communityDocRef = doc(
        firestore,
        COMMUNITIES_COLLECTION_NAME,
        communityName
      );
      await runTransaction(firestore, async (transaction) => {
        // check if community doc already exists
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        // create community
        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });

        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
    } catch (error: any) {
      console.log("handle create community error");
      setError(error.message);
    }
    setLoading(false);
  };

  // The render
  return (
    <Modal isOpen={open} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          display="flex"
          flexDirection="column"
          fontSize={15}
          padding={3}
        >
          Create a Community
        </ModalHeader>

        <Box pl={3} pr={3}>
          <Divider />
          <ModalCloseButton />

          <ModalBody display="flex" flexDirection="column" padding="10px  0px">
            <Text fontWeight={600} fontSize={15}>
              Name
            </Text>
            <Text fontSize={11} color="gray.500">
              Community names including capitalization cannot be changed
            </Text>
            <Text
              color="gray.400"
              position="relative"
              top="28px"
              left="10px"
              width="20px"
            >
              r/
            </Text>
            <Input
              value={communityName}
              size="sm"
              pl="22px"
              onChange={handleChange}
              position="relative"
            />
            <Text
              fontSize="0.7rem"
              mt={1}
              color={charsRemaining === 0 ? "red" : "gray.500"}
            >
              {charsRemaining} characters remaining
            </Text>
            {
              <Text fontSize="9pt" color="red">
                {error}
              </Text>
            }
            <Box mt={4} mb={4}>
              <Text fontWeight={600} fontSize="0.9rem">
                Community Type
              </Text>
              <RadioGroup onChange={setCommunityType} value={communityType}>
                <Stack>
                  <Radio value={ECommunityType.public}>
                    <Flex align="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="0.9rem" mr={1}>
                        Public
                      </Text>
                      <Text fontSize="0.7rem" pt={1} color="gray.500">
                        Anyone can view, post and comment in this community
                      </Text>
                    </Flex>
                  </Radio>
                  <Radio value={ECommunityType.restricted}>
                    <Flex align="center">
                      <Icon as={BsEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="0.9rem" mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize="0.7rem" pt={1} color="gray.500">
                        Anyone can view this community, but only approved users
                        can post.
                      </Text>
                    </Flex>
                  </Radio>
                  <Radio value={ECommunityType.private}>
                    <Flex align="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="0.9rem" mr={1}>
                        Private
                      </Text>
                      <Text fontSize="0.7rem" pt={1} color="gray.500">
                        Only approved users can view and submit to this
                        community
                      </Text>
                    </Flex>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </ModalBody>
        </Box>

        <ModalFooter bg="gray.100" borderRadius="0 0 10px 10px">
          <Button
            variant="outline"
            height="30px"
            colorScheme="blue"
            mr={3}
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            isLoading={loading}
            height="30px"
            onClick={handleCreateCommunity}
          >
            Create community
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default CreateCommunityModal;
