import { communityState, ICommunity } from "@/src/atoms/communitiesAtom";
import AboutCommunity from "@/src/components/Communities/AboutCommunity";
import CommunityHeader from "@/src/components/Communities/CommunityHeader";
import CreatePostLink from "@/src/components/Communities/CreatePostLink";
import CommunityNotFound from "@/src/components/Communities/NotFound";
import PageContent from "@/src/components/Layouts/PageContent";
import PostFeed from "@/src/components/Posts/PostFeed";
import { firestore } from "@/src/firebase/clientApp";
import { COMMUNITIES_COLLECTION_NAME } from "@/src/firebase/communities";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: ICommunity;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const setCommunityStateValue = useSetRecoilState(communityState);
  if (!communityData) {
    return <CommunityNotFound />;
  }

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, []);
  return (
    <>
      <CommunityHeader communityData={communityData} />
      <PageContent>
        <>
          <CreatePostLink />
          <PostFeed communityData={communityData} />
        </>
        <>
          <AboutCommunity communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      COMMUNITIES_COLLECTION_NAME,
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
            )
          : "",
      },
    };
  } catch (e) {
    // TODO: Add error page here
    console.log("getServerSideProps error", e);
    return {
      props: {},
    };
  }
}
export default CommunityPage;
