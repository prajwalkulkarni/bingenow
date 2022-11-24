import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import React, { useContext } from 'react'
import GoogleIcon from '@mui/icons-material/Google';
import useFetch from "../hooks/useFetch";
import { app } from '../firebase'
import Context from "../context/Context";

const provider = new GoogleAuthProvider();

const SocialLogin: React.FC<{ dbMutate: Function, data: any }> = (props) => {

    const { dbMutate } = props
    const auth = getAuth(app);
    const navigate = useNavigate()
    const ctx = useContext(Context)

    const socialLogin = async () => {

        try {
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;
            await dbMutate()
            // console.log(props.data)
            // const data = await res.json()
            if (props.data) {
                localStorage.setItem('id', JSON.stringify((props.data as any).id))
                localStorage.setItem('auth', JSON.stringify(true))
                localStorage.setItem('username', JSON.stringify(user?.displayName))

                ctx.setAuth(true)
                ctx.setUsername(user?.displayName)
                navigate('/', { replace: true })
            }


        }
        catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            console.log(errorMessage)
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
        }

    }
    return (
        <div
            className='flex items-center justify-center py-2 space-x-2 border border-gray-400 rounded-md cursor-pointer hover:bg-slate-200'
            onClick={socialLogin}><GoogleIcon /><span className='px-1'>Signin with Google</span></div>
    )
}
export default SocialLogin;