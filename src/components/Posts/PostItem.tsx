import { IPost } from "@/src/atoms/postsAtom";
import {
  Alert,
  AlertIcon,
  Flex,
  Icon,
  Image,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import {
  IoArrowDownCircleOutline,
  IoArrowDownCircleSharp,
  IoArrowRedoOutline,
  IoArrowUpCircleOutline,
  IoArrowUpCircleSharp,
  IoBookmarkOutline,
} from "react-icons/io5";
import { isError } from "util";

type PostItemProps = {
  post: IPost;
  isUserCreated: boolean;
  userVoteValue?: number;
  onVote: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: IPost,
    vote: number
  ) => void;
  onDelete: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: IPost
  ) => Promise<boolean>;
  onSelect?: (post: IPost) => void;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  isUserCreated,
  userVoteValue,
  onVote,
  onDelete,
  onSelect,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  const [isErrorDeleting, setIsErrorDeleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const singlePostPage = !onSelect;
  const router = useRouter();

  const handleDelete = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    try {
      setIsDeleting(true);
      const success = await onDelete(event, post);
      if (!success) {
        throw new Error("Failed to delete the post");
      }
      if (singlePostPage) {
        router.push(`/r/${post.communityId}`);
      }
    } catch (e) {
      console.error("------------ Error while deleting the post", e);
      setIsErrorDeleting(true);
    }
    setIsDeleting(false);
  };

  return (
    <Flex
      border="1px solid"
      bg="white"
      borderColor={singlePostPage ? "white" : "gray.300"}
      borderRadius={singlePostPage ? "4px 4px 0 0" : "4px"}
      _hover={{ borderColor: singlePostPage ? "none" : "gray.500" }}
      cursor={singlePostPage ? "unset" : "pointer"}
      onClick={() => onSelect && onSelect(post)}
      fontSize="0.8rem"
    >
      <Flex
        direction="column"
        align="center"
        bg={singlePostPage ? "none" : "gray.100"}
        p={2}
        width="40px"
        borderRadius={singlePostPage ? "0" : "3px 0 0 3px"}
      >
        {isErrorDeleting && (
          <Alert status="error">
            <AlertIcon />
            <Text>There is an error while deleting this post!</Text>
          </Alert>
        )}
        <Icon
          as={
            userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
          }
          color={userVoteValue === 1 ? "brand.100" : "gray.400"}
          fontSize="1.4rem"
          onClick={(event) => onVote(event, post, 1)}
          cursor="pointer"
        />
        <Text fontSize="0.8rem">{post.voteStatus}</Text>
        <Icon
          as={
            userVoteValue === -1
              ? IoArrowDownCircleSharp
              : IoArrowDownCircleOutline
          }
          color={userVoteValue === -1 ? "#4379ff" : "gray.400"}
          fontSize="1.4rem"
          onClick={(event) => onVote(event, post, -1)}
          cursor="pointer"
        />
      </Flex>
      <Flex direction="column" width="100%">
        <Stack spacing={1} p="10px">
          <Stack direction="row" spacing={0.6} align="center" fontSize="0.8rem">
            <Text>
              Posted by u/{post.creatorDisplayName}{" "}
              {moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
            </Text>
          </Stack>
          <Text fontSize="1rem" fontWeight={600}>
            {post.title}
          </Text>
          <Text fontSize="0.9rem">{post.body}</Text>
          {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                src={post.imageURL}
                maxHeight="460px"
                alt={post.title}
                display={loadingImage ? "none" : "unset"}
                onLoad={() => setLoadingImage(false)}
              />
            </Flex>
          )}
        </Stack>
        <Flex ml={1} mb={0.5} color="gray.500">
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={BsChat} mr={2} />
            <Text>{post.numberOfComments}</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoArrowRedoOutline} mr={2} />
            <Text>Share</Text>
          </Flex>
          <Flex
            align="center"
            p="8px 10px"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
            cursor="pointer"
          >
            <Icon as={IoBookmarkOutline} mr={2} />
            <Text>Save</Text>
          </Flex>
          {isUserCreated && (
            <Flex
              align="center"
              p="8px 10px"
              borderRadius={4}
              _hover={{ bg: "gray.200" }}
              cursor="pointer"
              onClick={handleDelete}
            >
              {isDeleting ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text>Delete</Text>
                </>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PostItem;
