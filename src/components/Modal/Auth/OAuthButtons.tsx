import { auth } from "@/src/firebase/clientApp";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  const [signInWithGoogle, user, loading, signInError] =
    useSignInWithGoogle(auth);
  return (
    <Flex direction="column" width="100%" mb={4}>
      <Button
        variant="oauth"
        isLoading={loading}
        onClick={() => {
          signInWithGoogle();
        }}
      >
        <Image src="/images/googlelogo.png" mr={2} height="20px" />
        Continue with Google
      </Button>
      {signInError && (
        <Text color="red" fontSize="10pt" textAlign="center" mt={1}>
          {FIREBASE_ERRORS[signInError.code as keyof typeof FIREBASE_ERRORS]}
        </Text>
      )}
      {/* <Button height="36px">Some other provider</Button> */}
    </Flex>
  );
};
export default OAuthButtons;
