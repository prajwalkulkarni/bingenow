import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { app } from "../firebase";
import Context from "../context/Context";
import { useMutation } from "react-query";
import { getLatestAuthToken } from "../utils/manageToken";
const provider = new GoogleAuthProvider();

/* eslint @typescript-eslint/no-explicit-any: "off" */

async function login(email: string) {
  const token = await getLatestAuthToken();
  const res = await fetch(`${process.env.REACT_APP_BACKEND_API}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      Accept: "*",
    },
    body: JSON.stringify({
      query: `
            mutation {
                createOrGetUser(email:"${email}"){
                    id
                    email
                }
            }
            `,
    }),
  });

  return res.json();
}
const SocialLogin: React.FC<{ disabled?: boolean }> = (props) => {
  const { data, mutate } = useMutation(login);
  const auth = getAuth(app);
  const navigate = useNavigate();
  const ctx = useContext(Context);
  const { disabled } = props;

  if (data) {
    localStorage.setItem(
      "userId",
      JSON.stringify(data.data.createOrGetUser.id)
    );
    localStorage.setItem("auth", JSON.stringify(true));
    localStorage.setItem("email", JSON.stringify(ctx?.email));
    ctx?.setAuth(true);
    navigate("/", { replace: true });
    ctx?.setSocialLoginLoading(false);
  }

  const socialLogin = async () => {
    ctx?.setSocialLoginLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;
      ctx?.setEmail(user.email);
      await mutate(user.email as string);
    } catch (error: any) {
      const errorMessage = error.message;
      // The email of the user's account used.
      console.log(errorMessage);
      ctx?.setSocialLoginLoading(false);
      throw new Error(errorMessage);
      // The AuthCredential type that was used.
    }
  };
  return (
    <button
      className="flex items-center justify-center w-full py-2 space-x-2 border border-gray-400 rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-75 hover:bg-slate-200"
      disabled={disabled}
      onClick={socialLogin}
    >
      <GoogleIcon />
      <span className="px-1">Signin with Google</span>
    </button>
  );
};
export default SocialLogin;
