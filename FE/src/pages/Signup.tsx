import React from 'react'
import { Link } from 'react-router-dom'
import { emailRegEx } from '../CONSTANTS'
import { app } from '../firebase'
import useAuth from '../hooks/useAuth'
import { useMutation } from 'react-query'
import { motion } from 'framer-motion'
import {
    getAuth, createUserWithEmailAndPassword,
    sendEmailVerification, updateProfile, GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Button from '../../UI/Button'
import Feature from '../components/Feature'
const provider = new GoogleAuthProvider();

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup: React.FC<{}> = () => {
    const auth = getAuth(app);


    const { val: password, isInvalid, isValid, onBlurHandler, onFocusHandler, onChangeHandler } = useAuth((val: string) => val.length >= 8)
    const { val: email, isInvalid: emailIsInvalid, isValid: emailIsValid, onBlurHandler: emailOnBlurHandler,
        onFocusHandler: emailOnFocusHandler, onChangeHandler: emailOnChangeHandler } = useAuth((val: string) => val.length >= 5 && emailRegEx.test(val))


    const { val: name, isInvalid: nameIsInvalid, isValid: nameIsValid, onBlurHandler: nameOnBlurHandler,
        onFocusHandler: nameOnFocusHandler, onChangeHandler: nameOnChangeHandler } = useAuth((val: string) => val.length >= 2)

    const formValid = isValid && emailIsValid && nameIsValid



    const socialLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            const user = result.user;

        }
        catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
        }

    }
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formValid) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            await updateProfile(userCredential.user, { displayName: name })
            await sendEmailVerification(userCredential.user)
            return userCredential
        }
    }
    const { isLoading, error, data, mutate } = useMutation(submitHandler)
    const { isLoading: socialLoginLoading, error: socialLoginError, data: socialLoginData } = useMutation(socialLogin)

    return (
        <Feature image='cover'>
            <div className='flex items-center justify-center min-h-[80vh]'>

                <Snackbar open={data && !isLoading} autoHideDuration={6000}
                    onClose={() => console.log('close')}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                    <Alert severity="success" sx={{ width: '100%' }}>
                        An email has been sent to your email address. Please verify your email address.
                    </Alert>
                </Snackbar>
                <div className='w-3/4 px-4 py-3 bg-white rounded-lg sm:mx-auto sm:w-full sm:max-w-md'>
                    <form onSubmit={mutate} className='flex flex-col'>

                        <div className='flex flex-col py-2'>
                            <label htmlFor="displayname">Name*</label>
                            <input className='p-1 border rounded-md border-slate-400 focus:border-violet-800 focus:outline-none' type="text"
                                placeholder='Display name' id="displayname"
                                value={name}
                                onChange={nameOnChangeHandler}
                                onBlur={nameOnBlurHandler}
                                onFocus={nameOnFocusHandler}
                                required />
                            {nameIsInvalid && <p className='text-red-500'>Display name should be of min. 2 characters.</p>}
                        </div>

                        <div className='flex flex-col py-2'>
                            <label htmlFor="email">Email*</label>
                            <input className='p-1 border rounded-md border-slate-400 focus:border-violet-800 focus:outline-none' type="email"
                                placeholder='Your email address' id="email"
                                value={email}
                                onChange={emailOnChangeHandler}
                                onBlur={emailOnBlurHandler}
                                onFocus={emailOnFocusHandler}
                                required />
                            {emailIsInvalid && <p className='text-red-500'>Email is invalid</p>}
                        </div>
                        <div className='flex flex-col py-2'>
                            <label htmlFor="password">Password*</label>
                            <input type="password"
                                className='p-1 border rounded-md border-slate-400 focus:border-violet-800 focus:outline-none'
                                placeholder='Password'
                                value={password}
                                onBlur={onBlurHandler}
                                onFocus={onFocusHandler}
                                onChange={onChangeHandler}
                                name="password" id="password"
                                required />
                            {isInvalid && <p className='text-red-500'>Password must be at least 8 characters</p>}
                        </div>
                        <Button type="submit"
                            disabled={!!data || isLoading || socialLoginLoading}
                            className='flex justify-center p-2 text-white rounded-md bg-violet-800 hover:bg-violet-900'>

                            {isLoading ?
                                <motion.div
                                    animate={{
                                        transform: 'rotate(360deg)',
                                        transition: { duration: 1, repeat: Infinity, repeatType: 'loop' }

                                    }}

                                    className='w-6 h-6 border-t-2 border-l-2 border-white rounded-xl'></motion.div> : 'Create account'}
                        </Button>
                        <p className='py-1 text-sm text-gray-400'>Have an account already? <Link to='/login'>Sign in</Link></p>
                    </form>

                    <hr className='h-px py-1' />
                    <div
                        className='flex items-center justify-center py-2 space-x-2 border border-gray-400 rounded-md cursor-pointer'
                        onClick={socialLogin}>Signup with Google account</div>
                </div>

            </div>
        </Feature>

    )
}


export default Signup