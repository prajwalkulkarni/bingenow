import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useContext, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { emailRegEx } from "../CONSTANTS";
import { app } from "../firebase";
import { useMutation } from "react-query";
import useAuth from "../hooks/useAuth";
import { ButtonCustom } from "../../UI/Button";
import Feature from "../components/Feature";
import Context from "../context/Context";
import SocialLogin from "../common/SocialLogin";
import SnackbarExtended from "../../UI/SnackbarExtended";
import ErrorPage from "../components/ErrorPage";
import Loader from "../../UI/Loader";

const Login: React.FC<Record<string, never>> = () => {
  const ctx = useContext(Context);
  const [open, setOpen] = useState(false);
  const auth = getAuth(app);
  const {
    val: password,
    isInvalid,
    isValid,
    onBlurHandler,
    onFocusHandler,
    onChangeHandler,
  } = useAuth((val: string) => val.length >= 8);
  const {
    val: email,
    isInvalid: emailIsInvalid,
    isValid: emailIsValid,
    onBlurHandler: emailOnBlurHandler,
    onFocusHandler: emailOnFocusHandler,
    onChangeHandler: emailOnChangeHandler,
  } = useAuth((val: string) => val.length >= 5 && emailRegEx.test(val));

  const formIsValid = isValid && emailIsValid;

  const handleClose = useCallback(
    (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    },
    []
  );

  const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (formIsValid) {
        await setPersistence(getAuth(app), browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (userCredential.user.emailVerified) {
          //   dbMutate?.();
          localStorage.setItem(
            "email",
            JSON.stringify(userCredential.user.email)
          );
          return userCredential;
        } else {
          throw new Error("Please verify your email address.");
        }
      }
    } catch (error: any) {
      const errorMessage = error.message;
      setOpen(true);
      ctx?.setAuth(false);
      ctx?.setEmail(null);
      return errorMessage;
    }
  };

  const { isLoading, error, data, mutate } = useMutation(loginHandler, {
    mutationKey: "login",
  });

  if (error) {
    return <ErrorPage />;
  }

  return (
    <Feature image="cover">
      <div className="flex items-center justify-center min-h-[80vh]">
        <SnackbarExtended
          open={open}
          handleClose={handleClose}
          severity="error"
          message={data}
        />
        <div className="w-3/4 px-4 py-3 bg-white rounded-lg sm:mx-auto sm:w-full sm:max-w-md">
          {ctx?.socialLoginLoading ? (
            <Loader text="Logging in..." />
          ) : (
            <form onSubmit={mutate} className="flex flex-col">
              <div className="flex flex-col py-2">
                <label htmlFor="email">Email*</label>
                <input
                  className="p-1 border rounded-md border-slate-400 focus:border-violet-800 focus:outline-none"
                  type="email"
                  placeholder="Your email address"
                  id="email"
                  value={email}
                  onChange={emailOnChangeHandler}
                  onBlur={emailOnBlurHandler}
                  onFocus={emailOnFocusHandler}
                  required
                />
                {emailIsInvalid && (
                  <p className="text-red-500">Email is invalid</p>
                )}
              </div>
              <div className="flex flex-col py-2">
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  className="p-1 border rounded-md border-slate-400 focus:border-violet-800 focus:outline-none"
                  placeholder="Password"
                  value={password}
                  onBlur={onBlurHandler}
                  onFocus={onFocusHandler}
                  onChange={onChangeHandler}
                  name="password"
                  id="password"
                  required
                />
                {isInvalid && (
                  <p className="text-red-500">
                    Password must be at least 8 characters
                  </p>
                )}
              </div>
              <ButtonCustom
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                spinnerColor="inherit"
              >
                Login
              </ButtonCustom>
              <p className="py-1 text-sm text-gray-400">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </form>
          )}

          <hr className="h-px py-1" />
          <SocialLogin disabled={isLoading} />
        </div>
      </div>
    </Feature>
  );
};

export default Login;
