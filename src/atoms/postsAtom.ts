import { Timestamp } from "@google-cloud/firestore";
import { atom } from "recoil";

export interface IPost {
  id?: string;
  communityId: string;
  creatorId: string;
  creatorDisplayName: string;
  title: string;
  body: string;
  numberOfComments: number;
  voteStatus: number;
  imageURL?: string;
  createdAt: Timestamp;
  communityImageURL?: string;
}

export type PostVote = {
  id: string;
  postId: string;
  communityId: string;
  voteValue: number;
};

interface IPostState {
  selectedPost: IPost | null;
  posts: IPost[];
  postVotes: PostVote[];
}

const defaultPostState: IPostState = {
  selectedPost: null,
  posts: [],
  postVotes: [],
};

export const postStateAtom = atom<IPostState>({
  key: "postState",
  default: defaultPostState,
});
