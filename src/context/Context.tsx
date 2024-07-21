import React, { PropsWithChildren, useEffect, useReducer } from "react";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

type ContextType = {
  auth: boolean;
  setAuth: (auth: boolean) => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  socialLoginLoading: boolean;
  setSocialLoginLoading: (socialLoginLoading: boolean) => void;
  loginStateLoading: boolean;
  setLoginStateLoading: (loginStateLoading: boolean) => void;
};

enum Actions {
  SET_AUTH = "SET_AUTH",
  SET_EMAIL = "SET_EMAIL",
  SET_SOCIAL_LOGIN_LOADING = "SET_SOCIAL_LOGIN_LOADING",
  SET_LOGIN_STATE_LOADING = "SET_LOGIN_STATE_LOADING",
}
type ActionType = {
  type: Actions;
  payload: {
    auth: boolean;
    email: string | null;
    socialLoginLoading: boolean;
    loginStateLoading: boolean;
  };
};

const initialState = {
  auth: false,
  email: null,
  socialLoginLoading: false,
  loginStateLoading: true,
};
const Context = React.createContext<ContextType | null>(null);

function reducer(
  state: {
    auth: boolean;
    email: string | null;
    socialLoginLoading: boolean;
    loginStateLoading: boolean;
  },
  action: ActionType
) {
  const { type } = action;

  switch (type) {
    case Actions.SET_AUTH:
      return { ...state, auth: action.payload.auth };
    case Actions.SET_EMAIL:
      return { ...state, email: action.payload.email };
    case Actions.SET_SOCIAL_LOGIN_LOADING:
      return {
        ...state,
        socialLoginLoading: action.payload.socialLoginLoading,
      };
    case Actions.SET_LOGIN_STATE_LOADING:
      return { ...state, loginStateLoading: action.payload.loginStateLoading };
    default:
      return state;
  }
}

export default Context;

export const ContextProvider: React.FC<PropsWithChildren> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setEmail = (email: string | null) => {
    dispatch({
      type: Actions.SET_EMAIL,
      payload: {
        email,
        auth: state.auth,
        socialLoginLoading: false,
        loginStateLoading: false,
      },
    });
  };
  const setAuth = (auth: boolean) => {
    dispatch({
      type: Actions.SET_AUTH,
      payload: {
        auth,
        email: null,
        socialLoginLoading: false,
        loginStateLoading: false,
      },
    });
  };
  const setSocialLoginLoading = (socialLoginLoading: boolean) => {
    dispatch({
      type: Actions.SET_SOCIAL_LOGIN_LOADING,
      payload: {
        socialLoginLoading,
        auth: state.auth,
        email: null,
        loginStateLoading: false,
      },
    });
  };
  const setLoginStateLoading = (loginStateLoading: boolean) => {
    dispatch({
      type: Actions.SET_LOGIN_STATE_LOADING,
      payload: {
        loginStateLoading,
        auth: state.auth,
        email: null,
        socialLoginLoading: false,
      },
    });
  };

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user && user?.emailVerified) {
        localStorage.setItem("auth", JSON.stringify(true));
        localStorage.setItem("email", JSON.stringify(user.email));
        setAuth(true);
        setLoginStateLoading(false);
        setEmail(user.email);
      } else {
        setAuth(false);
        setLoginStateLoading(false);
      }
    });
  }, []);

  return (
    <Context.Provider
      value={{
        auth: state.auth,
        email: state.email,
        setEmail,
        setAuth,
        setSocialLoginLoading,
        socialLoginLoading: state.socialLoginLoading,
        loginStateLoading: state.loginStateLoading,
        setLoginStateLoading,
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
