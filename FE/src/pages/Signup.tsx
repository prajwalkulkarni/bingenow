import React,{useContext, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { emailRegEx } from '../CONSTANTS'
import { app } from '../firebase'
import Context from '../context/Context'
import useAuth from '../hooks/useAuth'
import { useMutation } from 'react-query'
import { motion, useUnmountEffect } from 'framer-motion'
import Feature from '../components/Feature'
import {
    getAuth, createUserWithEmailAndPassword,
    sendEmailVerification, updateProfile
} from "firebase/auth";
import Button from '../../UI/Button'
import useFetch from '../hooks/useFetch'
import SocialLogin from '../common/SocialLogin'
import SnackbarExtended from '../../UI/SnackbarExtended'


const Signup: React.FC<{}> = () => {
    const auth = getAuth(app);

    const ctx = useContext(Context)
    const navigate = useNavigate()

    const { val: password, isInvalid, isValid, onBlurHandler, onFocusHandler, onChangeHandler } = useAuth((val: string) => val.length >= 8)
    const { val: email, isInvalid: emailIsInvalid, isValid: emailIsValid, onBlurHandler: emailOnBlurHandler,
        onFocusHandler: emailOnFocusHandler, onChangeHandler: emailOnChangeHandler } = useAuth((val: string) => val.length >= 5 && emailRegEx.test(val))


    const { val: name, isInvalid: nameIsInvalid, isValid: nameIsValid, onBlurHandler: nameOnBlurHandler,
        onFocusHandler: nameOnFocusHandler, onChangeHandler: nameOnChangeHandler } = useAuth((val: string) => val.length >= 2)

    const formValid = isValid && emailIsValid && nameIsValid

    const [open, setOpen] = React.useState(false);
    const [snackbarData, setSnackbarData] = React.useState<{message:string,severity:'error'|'success'|'info'|'warning'}>({
        message: '',
        severity: 'success'
    })

    const {isLoading:dbIsLoading, error:dbError, data:dbData, mutate:dbMutate} = useFetch({
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
    },'mutate')

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try{
            if (formValid) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                await updateProfile(userCredential.user, { displayName: name })
                await sendEmailVerification(userCredential.user)
    
                await dbMutate()
                return userCredential
            }
        }
        catch(err){
            console.log("Error in creating user",err)
            setOpen(true)
            setSnackbarData({
                message: 'Something went wrong',
                severity: 'error'
            })
        }
    }
    const { isLoading, error, data, mutate } = useMutation(submitHandler)

    useEffect(() => {
        if (data&& !isLoading) {
            setOpen(true)
            setSnackbarData({
                message: 'An email has been sent to your email address. Please verify your email address.',
                severity: 'success'
            })

        }
    }, [data])
    // const { isLoading: socialLoginLoading, error: socialLoginError, data: socialLoginData } = useMutation(socialLogin)

    console.log(data,error)
    return (
        <Feature image='cover'>
            <div className='flex items-center justify-center min-h-[80vh]'>

                <SnackbarExtended open={open} severity={snackbarData.severity} message={snackbarData.message}
                handleClose={()=>setOpen(false)}/>
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
                            disabled={!!data || isLoading }
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
                    <SocialLogin dbMutate={dbMutate} data={dbData}/>
                </div>

            </div>
        </Feature>

    )
}


export default Signup