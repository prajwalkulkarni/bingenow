import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import React, { useContext, useState,useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { emailRegEx } from '../CONSTANTS'
import { app } from '../firebase'
import { useMutation } from 'react-query'
import useAuth from '../hooks/useAuth'
import { motion } from 'framer-motion'
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Button from '../../UI/Button'
import GoogleIcon from '@mui/icons-material/Google';
import Feature from '../components/Feature'
import Context from '../context/Context'

const provider = new GoogleAuthProvider();

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login: React.FC<{}> = () => {

    const ctx = useContext(Context)
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);
    const auth = getAuth(app)
    const { val: password, isInvalid, isValid, onBlurHandler, onFocusHandler, onChangeHandler } = useAuth((val: string) => val.length >= 8)
    const { val: email, isInvalid: emailIsInvalid, isValid: emailIsValid, onBlurHandler: emailOnBlurHandler,
        onFocusHandler: emailOnFocusHandler, onChangeHandler: emailOnChangeHandler } = useAuth((val: string) => val.length >= 5 && emailRegEx.test(val))

    const formIsValid = isValid && emailIsValid

    
    const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    },[]);

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        
        try {
            if (formIsValid) {

                const userCredential = await signInWithEmailAndPassword(auth, email, password)

                if(userCredential.user.emailVerified){
                    ctx.setAuth(true)
                    ctx.setUsername(userCredential.user?.displayName)
                    localStorage.setItem('auth', JSON.stringify(true))
                    localStorage.setItem('username', JSON.stringify(userCredential.user?.displayName))
                    navigate('/', { replace: true })
                    return userCredential
                }else{
                    throw new Error('Please verify your email address.')
                }
            }
        }
        catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setOpen(true)
            ctx.setAuth(false)
            ctx.setUsername(null)
            return errorMessage
        }
    }

    const socialLogin = useCallback(async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            // The signed-in user info.
            ctx.setAuth(true)
            const user = result.user;
            localStorage.setItem('auth', JSON.stringify(true))
            localStorage.setItem('username', JSON.stringify(user?.displayName))
            ctx.setUsername(user.displayName)
            navigate('/', { replace: true })

        }
        catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            setOpen(true)
            ctx.setAuth(false)
            ctx.setUsername(null)
            const credential = GoogleAuthProvider.credentialFromError(error);
        }

    },[])


    const { isLoading, error, data, mutate } = useMutation(loginHandler, {
        mutationKey: 'login',
    })

    return (
        <Feature image='cover'>
            <div className='flex items-center justify-center min-h-[80vh]'>

                <Snackbar open={open} autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
                    <Alert severity="error" sx={{ width: '100%' }}>
                        {data}
                    </Alert>
                </Snackbar>
                <div className='w-3/4 px-4 py-3 bg-white rounded-lg sm:mx-auto sm:w-full sm:max-w-md'>
                    <form onSubmit={mutate}
                        className='flex flex-col'>

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
                        <Button type="submit" className='w-full'>

                            {isLoading ?
                                <motion.div
                                    animate={{
                                        transform: 'rotate(360deg)',
                                        transition: { duration: 1, repeat: Infinity, repeatType: 'loop' }

                                    }}

                                    className='w-6 h-6 border-t-2 border-l-2 border-white rounded-xl'></motion.div> : 'Login'}
                        </Button>
                        <p className='py-1 text-sm text-gray-400'>Don't have an account? <Link to='/signup'>Signup</Link></p>
                    </form>

                    <hr className='h-px py-1' />
                    <div
                        className='flex items-center justify-center py-2 space-x-2 border border-gray-400 rounded-md cursor-pointer hover:bg-slate-200'
                        onClick={socialLogin}><GoogleIcon/><span className='px-1'>Signin with Google</span></div>
                </div>

            </div>
        </Feature>

    )
}


export default Login