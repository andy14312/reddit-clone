import { ICommunity } from "@/src/atoms/communitiesAtom";
import { IPost } from "@/src/atoms/postsAtom";
import { auth, firestore } from "@/src/firebase/clientApp";
import { POSTS_COLLECTION_NAME } from "@/src/firebase/posts";
import usePosts from "@/src/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostItem from "./PostItem";
import PostLoader from "./PostLoader";

type PostFeedProps = {
  communityData: ICommunity;
};

const PostFeed: React.FC<PostFeedProps> = ({ communityData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [user] = useAuthState(auth);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const postsQuery = query(
        collection(firestore, POSTS_COLLECTION_NAME),
        where("communityId", "==", communityData.id),
        orderBy("createdAt", "desc")
      );
      const postsDocs = await getDocs(postsQuery);
      const posts = postsDocs.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as IPost[],
      }));
    } catch (error: any) {
      console.error("Error while fetching posts", error);
      setIsError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);
  return isLoading ? (
    <PostLoader />
  ) : (
    <Stack>
      {postStateValue.posts.map((postItem: IPost) => {
        return (
          <PostItem
            key={postItem.id}
            post={postItem}
            isUserCreated={user?.uid === postItem.creatorId}
            userVoteValue={
              postStateValue?.postVotes.find(
                (postVote) => postVote.postId === postItem.id
              )?.voteValue
            }
            onVote={onVote}
            onDelete={onDeletePost}
            onSelect={onSelectPost}
          />
        );
      })}
    </Stack>
  );
};
export default PostFeed;
