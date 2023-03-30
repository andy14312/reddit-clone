import PageContent from "@/src/components/Layouts/PageContent";
import PostItem from "@/src/components/Posts/PostItem";
import { auth } from "@/src/firebase/clientApp";
import usePosts from "@/src/hooks/usePosts";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PostPage: React.FC = () => {
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();
  const [user] = useAuthState(auth);
  const { selectedPost, postVotes } = postStateValue;
  const router = useRouter();

  const fetchPost = async (postId: string) => {};

  useEffect(() => {
    const { postId } = router.query;
    if (postId && !postStateValue.selectedPost) {
      fetchPost(postId as string);
    }
  }, [router.query, postStateValue.selectedPost]);
  return (
    <PageContent>
      <>
        {selectedPost && (
          <PostItem
            post={selectedPost}
            onVote={onVote}
            onDelete={onDeletePost}
            userVoteValue={
              postVotes.find((item) => item.postId === selectedPost?.id)
                ?.voteValue
            }
            isUserCreated={user?.uid === selectedPost?.creatorId}
          />
        )}
      </>
      <></>
    </PageContent>
  );
};
export default PostPage;
