import React,{useContext, useEffect} from "react";
import {Link} from 'react-router-dom'
import Button from "../../UI/Button";
import Search from '../components/Search'
import Context from "../context/Context";
import LockIcon from '@mui/icons-material/Lock';

const Header: React.FC<{}> = (props) => {

    const ctx = useContext(Context)
    const signoutHandler = () => {
        localStorage.removeItem('auth')
        localStorage.removeItem('username')
        ctx.setAuth(false)
        ctx.setUsername(null)
    }
    useEffect(()=>{

        ctx.setAuth(JSON.parse(localStorage.getItem('auth') as string)??false)
        ctx.setUsername(JSON.parse(localStorage.getItem('username') as string)??null)
    },[])

    return (
        <div className="flex justify-between w-full p-4 bg-gray-100">
            <p>Logo</p>
            {ctx.auth && <>
                <Search />
                <div className="flex items-center text-violet-800">
                    <Link className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/'>Movies</Link>
                    <Link className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/shows'>Series</Link>
                    <Link className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/watchlist'>Watchlist</Link>
                    <Button className='ml-2' onClick={signoutHandler}><LockIcon/>Sign out</Button>
                </div>
            </>}
            {!ctx.auth && <Link to='/login' className="p-2 font-bold text-white rounded-md bg-violet-800 hover:bg-violet-900"><LockIcon/>Sign in</Link>}


        </div>
    )
}


export default Header