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
            {ctx.auth && <Search />}
            {!ctx.auth && <Link to='/login' className="p-2 font-bold text-white rounded-md bg-violet-800 hover:bg-violet-900"><LockIcon/>Sign in</Link>}
            {ctx.auth && <Button onClick={signoutHandler}><LockIcon/>Sign out</Button>}
        </div>
    )
}


export default Header