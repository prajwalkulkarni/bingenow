import React, { PropsWithChildren, useReducer } from 'react'

type ContextType = {
    auth: boolean,
    setAuth: (auth: boolean) => void,
    username: string|null,
    setUsername: (username: string|null) => void,
    socialLoginLoading: boolean,
    setSocialLoginLoading: (socialLoginLoading: boolean) => void
}

enum Actions{
    SET_AUTH = 'SET_AUTH',
    SET_USERNAME = 'SET_USERNAME',
    SET_SOCIAL_LOGIN_LOADING = 'SET_SOCIAL_LOGIN_LOADING'
}
type ActionType = {
    type: Actions,
    payload: {
        auth: boolean,
        username: string|null,
        socialLoginLoading: boolean
    }
}



const initialState = {
    auth: false,
    username: null,
    socialLoginLoading: false
}
const Context = React.createContext<ContextType|null>(null)


function reducer(state:{auth:boolean,username:string|null, socialLoginLoading: boolean},action:ActionType){
    const {type} = action

    switch(type){
        case Actions.SET_AUTH:
            return {...state,auth: action.payload.auth}
        case Actions.SET_USERNAME:
            return {...state,username: action.payload.username}
        case Actions.SET_SOCIAL_LOGIN_LOADING:
            return {...state,socialLoginLoading: action.payload.socialLoginLoading}

        default:
            return state
    }

}

export default Context

export const ContextProvider:React.FC<PropsWithChildren> = (props) =>{

    const [state, dispatch] = useReducer(reducer, initialState)

    const setUsername = (username:string|null)=>{
        dispatch({type: Actions.SET_USERNAME,payload: {username,auth:state.auth, socialLoginLoading: false}})
    }
    const setAuth = (auth:boolean)=>{
        dispatch({type: Actions.SET_AUTH,payload: {auth,username: null, socialLoginLoading: false}})
    }
    const setSocialLoginLoading = (socialLoginLoading:boolean)=>{
        dispatch({type: Actions.SET_SOCIAL_LOGIN_LOADING,payload: {socialLoginLoading,auth:state.auth, username: null}})
    }
    return (
        <Context.Provider value={{ auth: state.auth, username: state.username, setUsername, setAuth, setSocialLoginLoading, socialLoginLoading: state.socialLoginLoading }}>
            {props.children}
        </Context.Provider>
    )
}

