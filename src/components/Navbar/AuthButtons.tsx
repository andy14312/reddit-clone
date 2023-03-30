import { authModalState, AuthModalViewEnum } from "@/src/atoms/authModalAtom";
import { Button } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";

type AuthButtonsProps = {};

const AuthButtons: React.FC<AuthButtonsProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Button
        variant="outline"
        height="28px"
        width={{ base: "70px", md: "110px" }}
        mr={2}
        display={{ base: "none", sm: "flex" }}
        onClick={() =>
          setAuthModalState({ open: true, view: AuthModalViewEnum.login })
        }
      >
        Log In
      </Button>
      <Button
        height="28px"
        width={{ base: "70px", md: "110px" }}
        mr={2}
        display={{ base: "none", sm: "flex" }}
        onClick={() =>
          setAuthModalState({ open: true, view: AuthModalViewEnum.signup })
        }
      >
        Sign Up
      </Button>
    </>
  );
};
export default AuthButtons;
