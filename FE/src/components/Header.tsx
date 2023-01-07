import React, { useContext, useEffect } from "react";
import { Link } from 'react-router-dom'
import Button from "../../UI/Button";
import Search from '../components/Search'
import Context from "../context/Context";
import LockIcon from '@mui/icons-material/Lock';

const Header: React.FC<{}> = (props) => {

    const ctx = useContext(Context)

    const [hideMobileMenu, setToggleMobileMenu] = React.useState<boolean>(true)
    const signoutHandler = () => {
        localStorage.removeItem('auth')
        localStorage.removeItem('username')
        ctx.setAuth(false)
        ctx.setUsername(null)
    }
    useEffect(() => {

        ctx.setAuth(JSON.parse(localStorage.getItem('auth') as string) ?? false)
        ctx.setUsername(JSON.parse(localStorage.getItem('username') as string) ?? null)
    }, [])

    return (

        <nav className="bg-white shadow-lg">
            <div className="w-full">
                <div className="flex justify-between w-full p-4 bg-gray-100">

                    <img src={require('../assets/bingenow.png')} alt="Bingenow logo" style={{objectFit:'contain'}} width="150"/>

                    <div className="flex items-center px-2 md:hidden">
                        <button className="outline-none mobile-menu-button" onClick={()=>setToggleMobileMenu(prev=>!prev)}>
                            <svg className="w-6 h-6 text-gray-500 hover:text-purple-800"
                                x-show="!showMenu"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </button>
                    </div>
                    {ctx.auth && <>
                        <Search />
                        <div className="items-center hidden md:flex text-violet-800">
                            <Link
                            className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/'>Movies</Link>
                            <Link
                            className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/shows'>Series</Link>
                            <Link
                            className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/mywatchlist'>Watchlist</Link>
                            <Button className='ml-2' onClick={signoutHandler}><LockIcon />Sign out</Button>
                        </div>
                    </>}
                    {!ctx.auth && <Link to='/login' className="p-2 font-bold text-white rounded-md bg-violet-800 hover:bg-violet-900"><LockIcon />Sign in</Link>}

                </div>
            </div>

            <div className={`${hideMobileMenu?'hidden ':''}mobile-menu transition-all`}>
                <ul className="md:hidden">
                    <li className="active"><Link to="/" 
                    onClick={()=>setToggleMobileMenu(true)}
                    className="block px-2 py-4 text-sm text-center hover:text-white hover:bg-violet-800">Movies</Link></li>
                    <li><Link 
                    onClick={()=>setToggleMobileMenu(true)}
                    to="/shows" className="block px-2 py-4 text-sm text-center transition duration-300 hover:bg-violet-800 hover:text-white">Series</Link></li>
                    <li><Link 
                    onClick={()=>setToggleMobileMenu(true)}
                    to="/mywatchlist" className="block px-2 py-4 text-sm text-center transition duration-300 hover:bg-violet-800 hover:text-white">Watchlist</Link></li>
                    <li><Button className='flex justify-center w-full rounded-none' onClick={signoutHandler}><LockIcon />Sign out</Button></li>
                </ul>
            </div>
        </nav>
    )
}


export default Header
