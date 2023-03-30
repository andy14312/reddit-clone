import { atom } from "recoil";

export enum AuthModalViewEnum {
  login = "login",
  signup = "signup",
  resetPassword = "resetPassword",
}

export interface AuthModalState {
  open: boolean;
  view: AuthModalViewEnum;
}

const defaultModalState: AuthModalState = {
  open: false,
  view: AuthModalViewEnum.login,
};

export const authModalState = atom<AuthModalState>({
  key: "authModalState",
  default: defaultModalState,
});
