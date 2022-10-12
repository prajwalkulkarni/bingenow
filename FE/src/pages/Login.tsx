import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import React from 'react'
import { Link } from 'react-router-dom'
import { emailRegEx } from '../CONSTANTS'
import { app } from '../firebase'
import { useMutation } from 'react-query'
import useAuth from '../hooks/useAuth'


const provider = new GoogleAuthProvider();
const Login: React.FC<{}> = () => {

    const auth = getAuth(app)
    const { val: password, isInvalid, isValid, onBlurHandler, onFocusHandler, onChangeHandler } = useAuth((val: string) => val.length >= 8)
    const { val: email, isInvalid: emailIsInvalid, isValid: emailIsValid, onBlurHandler: emailOnBlurHandler,
        onFocusHandler: emailOnFocusHandler, onChangeHandler: emailOnChangeHandler } = useAuth((val: string) => val.length >= 5 && emailRegEx.test(val))

    const formIsValid = isValid && emailIsValid

    const loginHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            if (formIsValid) {
                const userCredential = await signInWithEmailAndPassword(auth, email, password)
                return userCredential
            }
        }
        catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
        }
    }

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


    const { isLoading, error, data, mutate } = useMutation(loginHandler)
    return (
        <div className='flex items-center justify-center min-h-[80vh]'>

            <div className='w-1/2 p-3 bg-white rounded-lg md:w-1/4'>
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
                    <button type="submit" className='p-2 text-white rounded-md bg-violet-800 hover:bg-violet-900'>Login</button>
                    <p className='py-1 text-sm text-gray-400'>Don't have an account? <Link to='/signup'>Signup</Link></p>
                </form>

                <hr className='h-px py-1'/>
                <div 
                className='flex items-center justify-center py-2 space-x-2 border border-gray-400 rounded-md cursor-pointer'
                onClick={socialLogin}>Signin with Google account</div>
            </div>

        </div>

    )
}


export default Login