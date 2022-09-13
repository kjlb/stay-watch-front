import axios, { AxiosResponse } from "axios";
import firebase, {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { baseURL } from "./api";
import { userState } from "@/globalStates/atoms/firebaseUserAtom";
import { userRole } from "@/globalStates/atoms/userRoleAtom";
import { app } from "@/utils/firebase";

export const login = (): Promise<void> => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);
  return signInWithRedirect(auth, provider);
};

export const logout = (): Promise<void> => {
  const auth = getAuth(app);
  return signOut(auth);
};

export const useUser = (): firebase.User | null => {
  return useRecoilValue(userState);
};

export const useUserRole = (): number | null => {
  return useRecoilValue(userRole);
};

export const useIsSigned = (): boolean | undefined => {
  const [isSigned, setIsSigned] = useState<boolean | undefined>();
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    const auth = getAuth(app);
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsSigned(true);
      } else {
        setIsSigned(false);
      }
    });
  }, [setUser]);

  return isSigned;
};

export const useIsRegisterEmail = (): boolean | undefined => {
  const [isRegisteredEmail, setIsRegisteredEmail] = useState<
    boolean | undefined
  >();
  const setUserRole = useSetRecoilState(userRole);
  const user = useUser();

  useEffect(() => {
    if (user) {
      const checkRegisterdEmail = async () => {
        try {
          const token = await user.getIdToken();
          const resRole: AxiosResponse<number> = await axios.get(
            `${baseURL}/user/v1/check`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsRegisteredEmail(true);
          setUserRole(resRole.data);
        } catch (error) {
          setIsRegisteredEmail(false);
        }
      };

      checkRegisterdEmail();
    }
  }, [setUserRole, user]);

  return isRegisteredEmail;
};
