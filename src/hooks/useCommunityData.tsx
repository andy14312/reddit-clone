import {
  collection,
  doc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState, AuthModalViewEnum } from "../atoms/authModalAtom";
import {
  communityState,
  ICommunity,
  ICommunitySnippet,
  ICommunityState,
} from "../atoms/communitiesAtom";
import { auth, firestore } from "../firebase/clientApp";
import { COMMUNITIES_COLLECTION_NAME } from "../firebase/communities";

const useCommunityData = () => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setAuthModalState = useSetRecoilState(authModalState);
  const joinOrLeaveCommunity = (
    communityData: ICommunity,
    isJoined: boolean
  ) => {
    // is the user signed in? if not open auth modal
    if (!user) {
      setAuthModalState({ open: true, view: AuthModalViewEnum.login });
      return;
    }
    if (isJoined) {
      leaveCommunity(communityData);
      return;
    }
    joinCommunity(communityData);
  };

  const getUserCommunitySnippets = async () => {
    try {
      setLoading(true);
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev: ICommunityState) => {
        return {
          ...prev,
          snippets: snippets as ICommunitySnippet[],
        };
      });
    } catch (e: any) {
      console.log("------- Error while getting user community snippets", e);
      setError(e.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: ICommunity) => {
    // Two things happen here
    // 1. Add the community snippet data to the snippets field of the users collection
    // 2. Increase the count of number of members in that particular community
    // So, we use batched writes of firestore
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      const newSnippet: ICommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: false,
      };
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        newSnippet
      );
      batch.update(
        doc(firestore, COMMUNITIES_COLLECTION_NAME, communityData.id),
        {
          numberOfMembers: increment(1),
        }
      );
      await batch.commit();

      // After above database update, we update the recoil state of communityState.snippets
      setCommunityStateValue((prev: ICommunityState) => {
        return {
          ...prev,
          snippets: [...prev.snippets, newSnippet],
          currentCommunity: {
            ...prev.currentCommunity,
            numberOfMembers: (prev.currentCommunity?.numberOfMembers || 0) + 1,
          } as ICommunity,
        };
      });
    } catch (e: any) {
      console.error("--------------- Error while joining community", e);
      setError(e.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityData: ICommunity) => {
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets`, communityData.id)
      );
      batch.update(
        doc(firestore, COMMUNITIES_COLLECTION_NAME, communityData.id),
        {
          numberOfMembers: increment(-1),
        }
      );
      await batch.commit();

      setCommunityStateValue((prev: ICommunityState) => ({
        ...prev,
        snippets: prev.snippets.filter(
          (snippet: ICommunitySnippet) =>
            snippet.communityId !== communityData.id
        ),
        currentCommunity: {
          ...prev.currentCommunity,
          numberOfMembers: (prev.currentCommunity?.numberOfMembers || 0) - 1,
        } as ICommunity,
      }));
    } catch (e: any) {
      console.error("--------------- Error while leaving community", e);
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        snippets: [],
      }));
      return;
    }
    getUserCommunitySnippets();
  }, [user]);

  return {
    communityStateValue,
    joinOrLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
