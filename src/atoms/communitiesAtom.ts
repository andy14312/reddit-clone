import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";
import { ECommunityType } from "../types/communities";

export interface ICommunity {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privactyType: ECommunityType;
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface ICommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

export interface ICommunityState {
  snippets: ICommunitySnippet[];
  currentCommunity?: ICommunity;
}

const defaultCommunityState: ICommunityState = {
  snippets: [],
};

export const communityState = atom<ICommunityState>({
  key: "communityState",
  default: defaultCommunityState,
});
