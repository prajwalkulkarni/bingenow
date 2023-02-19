import React, { PropsWithChildren, useReducer } from 'react'

type ContextType = {
    auth: boolean,
    setAuth: (auth: boolean) => void,
    username: string|null,
    setUsername: (username: string|null) => void,
}

enum Actions{
    SET_AUTH = 'SET_AUTH',
    SET_USERNAME = 'SET_USERNAME'
}
type ActionType = {
    type: Actions,
    payload: {
        auth: boolean,
        username: string|null
    }
}



const initialState = {
    auth: false,
    username: null,
}
const Context = React.createContext<ContextType|null>(null)


function reducer(state:{auth:boolean,username:string|null},action:ActionType){
    const {type} = action

    switch(type){
        case 'SET_AUTH':
            return {...state,auth: action.payload.auth}
        case 'SET_USERNAME':
            return {...state,username: action.payload.username}
        default:
            return state
    }

}

export default Context

export const ContextProvider:React.FC<PropsWithChildren> = (props) =>{

    const [state, dispatch] = useReducer(reducer, initialState)

    const setUsername = (username:string|null)=>{
        dispatch({type: Actions.SET_USERNAME,payload: {username,auth:state.auth}})
    }
    const setAuth = (auth:boolean)=>{
        dispatch({type: Actions.SET_AUTH,payload: {auth,username: null}})
    }
    return (
        <Context.Provider value={{ auth: state.auth, username: state.username, setUsername, setAuth }}>
            {props.children}
        </Context.Provider>
    )
}

