import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState, AuthModalViewEnum } from "../atoms/authModalAtom";
import { communityState } from "../atoms/communitiesAtom";
import { IPost, postStateAtom, PostVote } from "../atoms/postsAtom";
import { auth, firestore, storage } from "../firebase/clientApp";
import { POSTS_COLLECTION_NAME } from "../firebase/posts";
import { USERS_COLLECTION_NAME } from "../firebase/users";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postStateAtom);
  const [user] = useAuthState(auth);
  const { currentCommunity } = useRecoilValue(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  const onVote = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: IPost,
    vote: number
  ) => {
    event.stopPropagation();
    // check for user, if not found, open auth modal
    if (!user?.uid) {
      setAuthModalState((prev) => ({
        ...prev,
        open: true,
        view: AuthModalViewEnum.login,
      }));
    }
    try {
      const { voteStatus } = post;
      const existingVote = postStateValue.postVotes.find(
        (postVote) => postVote.postId === post.id
      );
      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostVotes = [...postStateValue.postVotes];
      let voteChange = vote;

      if (!existingVote) {
        // No existing vote on the post. Create a new postVote doc
        const postVoteRef = doc(
          collection(firestore, USERS_COLLECTION_NAME, `${user?.uid}/postVotes`)
        );
        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id!,
          communityId: post.communityId,
          voteValue: vote,
        };

        batch.set(postVoteRef, newVote);
        updatedPost.voteStatus = updatedPost.voteStatus + vote;
        updatedPostVotes = [...updatedPostVotes, newVote];
      } else {
        // User has already voted on this post
        const postVoteRef = doc(
          firestore,
          USERS_COLLECTION_NAME,
          `${user?.uid}/postVotes/${existingVote.id}`
        );
        const isRemovingVote = existingVote.voteValue === vote;
        if (isRemovingVote) {
          // removing the already existing vote, by clicking on the same upvote/downvote button that he clicked in past on this post
          updatedPost.voteStatus = updatedPost.voteStatus - vote;
          updatedPostVotes = updatedPostVotes.filter(
            (postVote) => postVote.id !== existingVote.id
          );
          batch.delete(postVoteRef);
          voteChange *= -1;
        } else {
          // flipping the vote up or down, instead of removing it
          updatedPost.voteStatus = updatedPost.voteStatus + 2 * vote;
          const voteIndex = updatedPostVotes.findIndex(
            (postVote) => postVote.id === existingVote.id
          );
          updatedPostVotes[voteIndex] = {
            ...existingVote,
            voteValue: vote,
          };
          batch.update(postVoteRef, {
            voteValue: vote,
          });
          voteChange *= 2;
        }
      }

      // update out post document
      const postRef = doc(firestore, POSTS_COLLECTION_NAME, post.id!);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();

      // update our state
      const postIdx = postStateValue.posts.findIndex(
        (postItem) => postItem.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postVotes: updatedPostVotes,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
    } catch (e: any) {
      console.error("Error on vote", e);
    }
  };

  const onSelectPost = (post: IPost) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/r/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    post: IPost
  ): Promise<boolean> => {
    try {
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }

      const postDocRef = doc(firestore, POSTS_COLLECTION_NAME, post.id!);
      await deleteDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((postItem: IPost) => postItem.id !== post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const getCommunityPostVotes = async (communityId: string) => {
    const postVotesQuery = query(
      collection(firestore, USERS_COLLECTION_NAME, `${user?.uid}/postVotes`),
      where("communityId", "==", communityId)
    );
    const postVotesDocs = await getDocs(postVotesQuery);
    const postVotes = postVotesDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postVotes: postVotes as PostVote[],
    }));
  };

  useEffect(() => {
    if (currentCommunity && user) {
      getCommunityPostVotes(currentCommunity.id);
    }
    if (!user) {
      setPostStateValue((prev) => ({
        ...prev,
        postVotes: [],
      }));
    }
  }, [user, currentCommunity]);

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
