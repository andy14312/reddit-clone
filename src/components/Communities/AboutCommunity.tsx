import { auth, firestore, storage } from "@/src/firebase/clientApp";
import { COMMUNITIES_COLLECTION_NAME } from "@/src/firebase/communities";
import useSelectFile from "@/src/hooks/useSelectFile";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Link,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaReddit } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiCakeLine } from "react-icons/ri";
import { useSetRecoilState } from "recoil";
import { communityState, ICommunity } from "../../atoms/communitiesAtom";

type AboutCommunityProps = {
  communityData: ICommunity;
};

const AboutCommunity: React.FC<AboutCommunityProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const setCommunityStateValue = useSetRecoilState(communityState);

  const onUpdateImage = async () => {
    if (!selectedFile) {
      return;
    }
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, "data_url");
      const downloadUrl = await getDownloadURL(imageRef);
      await updateDoc(
        doc(firestore, COMMUNITIES_COLLECTION_NAME, communityData.id),
        {
          imageURL: downloadUrl,
        }
      );
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadUrl,
        } as ICommunity,
      }));
    } catch (error: any) {
      console.error("---------- Update community image error", error);
    }
    setUploadingImage(false);
  };
  return (
    <Box position="sticky" top="14px" fontSize="0.8rem">
      <Flex
        justify="space-between"
        align="center"
        bg="blue.400"
        color="white"
        p={3}
        borderRadius="4px 4px 0 0"
      >
        <Text fontWeight={700}>About Community</Text>
        <Icon as={HiOutlineDotsHorizontal} />
      </Flex>
      <Flex direction="column" p={3} bg="white" border="0 0 4px 4px">
        <Stack>
          <Flex fontSize="0.7rem" fontWeight={600} p={2}>
            <Flex direction="column" flexGrow={1}>
              <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction="column" flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          {communityData.createdAt && (
            <>
              <Divider />
              <Flex align="center">
                <Icon as={RiCakeLine} fontSize="1rem" mr={2} />
                <Text>{`Created ${moment(
                  communityData.createdAt?.seconds * 1000
                ).format("MMM DD, YYYY")}`}</Text>
              </Flex>
            </>
          )}
          <Link href={`/r/${communityData.id}/submit`}>
            <Button width="100%" mt={3} height="26px">
              Create post
            </Button>
          </Link>
          {user?.uid === communityData.creatorId && (
            <>
              <Divider />
              <Stack spacing={1}>
                <Text fontWeight={600}>Admin</Text>
                <Flex align="center" justify="space-between">
                  <Text
                    color="blue.500"
                    cursor="pointer"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                  >
                    Change Image
                  </Text>
                  {selectedFile || communityData.imageURL ? (
                    <Image
                      src={selectedFile || communityData.imageURL}
                      borderRadius="full"
                      boxSize="40px"
                      alt="Community thumbnail image"
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize="1.5rem"
                      ml={2}
                      color="brand.100"
                    />
                  )}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    <Text cursor="pointer" onClick={onUpdateImage}>
                      Save Changes
                    </Text>
                  ))}
                <input
                  id="file-input"
                  type="file"
                  accept="image/x-png,image/gif,image/jpeg"
                  hidden
                  ref={fileInputRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default AboutCommunity;
