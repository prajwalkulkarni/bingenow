import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import { app } from '../firebase'
import Context from "../context/Context";
import { UseMutateFunction, useMutation } from "react-query";
import useFetch from "../hooks/useFetch";
const provider = new GoogleAuthProvider();

/* eslint @typescript-eslint/no-explicit-any: "off" */

async function login(email:string) {

    const res = await fetch(`${process.env.REACT_APP_BACKEND_API}`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'*'
        },
        body: JSON.stringify({
            query: `
            mutation {
                createOrGetUser(email:"${email}"){
                    id
                    email
                }
            }
            `
        })
    })

    return res.json(); 
}
const SocialLogin: React.FC<{}> = () => {

    const { data, mutate } = useMutation(login)
    const auth = getAuth(app);
    const navigate = useNavigate()
    const ctx = useContext(Context)

    useEffect(()=>{
        if (data) {
            localStorage.setItem('userId', JSON.stringify(data.data.createOrGetUser.id))
            localStorage.setItem('auth', JSON.stringify(true))
            localStorage.setItem('username', JSON.stringify(ctx?.username));
            ctx?.setAuth(true)
            navigate('/', { replace: true })
            ctx?.setSocialLoginLoading(false);
        }
    },[data])

    const socialLogin = async () => {
        ctx?.setSocialLoginLoading(true);
        try {
            const result = await signInWithPopup(auth, provider)
            // const credential = GoogleAuthProvider.credentialFromResult(result);
            // The signed-in user info.
            const user = result.user;
            ctx?.setUsername(user.displayName);
            await mutate(user.email as string);
            // console.log(props.data)
            // const data = await res.json()
        }
        catch (error: any) {
            const errorMessage = error.message;
            // The email of the user's account used.
            console.log(errorMessage)
            throw new Error(errorMessage);
            // The AuthCredential type that was used.
            // const credential = GoogleAuthProvider.credentialFromError(error);
        }

    }
    return (
        <div
            className='flex items-center justify-center py-2 space-x-2 border border-gray-400 rounded-md cursor-pointer hover:bg-slate-200'
            onClick={socialLogin}><GoogleIcon /><span className='px-1'>Signin with Google</span></div>
    )
}
export default SocialLogin;