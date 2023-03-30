import { communityState } from "@/src/atoms/communitiesAtom";
import PageContent from "@/src/components/Layouts/PageContent";
import NewPostForm from "@/src/components/Posts/NewPostForm";
import { auth } from "@/src/firebase/clientApp";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

type submitProps = {};

const submit: React.FC<submitProps> = () => {
  const [user] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);
  console.log("------- community value on submit", communityStateValue);
  return (
    <PageContent>
      <>
        <Box p="14px 0" borderBottom="1px solid" borderColor="white">
          <Text>Create a post</Text>
        </Box>
        {user && <NewPostForm user={user} />}
      </>
      <></>
    </PageContent>
  );
};
export default submit;
