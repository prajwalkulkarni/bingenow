import React, { useContext, useEffect } from "react";
import { Link } from 'react-router-dom'
import Button from "../../UI/Button";
import Search from '../components/Search'
import Context from "../context/Context";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MovieIcon from '@mui/icons-material/Movie';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerData = [{ title: 'Movies', icon: <MovieIcon />, link: '/' }, { title: 'Series', icon: <TheaterComedyIcon />, link: '/shows' }, { title: 'Watchlist', icon: <FormatListNumberedIcon />, link: '/mywatchlist' }];
const Header: React.FC<Record<string, never>> = () => {

    const ctx = useContext(Context)

    const signoutHandler = () => {
        localStorage.removeItem('auth')
        localStorage.removeItem('username')
        localStorage.removeItem('userId')
        ctx?.setAuth(false)
        ctx?.setUsername(null)
    }
    useEffect(() => {

        ctx?.setAuth(JSON.parse(localStorage.getItem('auth') as string) ?? false)
        ctx?.setUsername(JSON.parse(localStorage.getItem('username') as string) ?? null)
    }, [])

    const [toggleDrawer, setToggleDrawer] = React.useState(false);

    const toggleDrawerFn =
        (open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setToggleDrawer(open);
            };

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawerFn(false)}
            onKeyDown={toggleDrawerFn(false)}
        >
            <List>
                {drawerData.map((drawerItem) => (
                    <ListItem key={drawerItem.title} disablePadding>
                        <ListItemButton>
                            <Link to={drawerItem.link as string}>
                                <ListItemIcon>
                                    {drawerItem.icon}
                                </ListItemIcon>
                            </Link>
                            <Link to={drawerItem.link as string}>
                                <ListItemText primary={drawerItem.title} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem key='Logout' disablePadding>
                    <ListItemButton>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary='Logout' onClick={signoutHandler} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );
    return (

        <nav className="bg-white shadow-lg">
            <div className="w-full">
                <div className={`flex justify-between w-full p-4 bg-gray-100`}>

                    <Link to='/' className={`${ctx?.auth && 'hidden'} lg:flex`}>
                        <img src={require('../assets/bingenow.png')} alt="Bingenow logo" style={{ objectFit: 'contain' }} width="150" />
                    </Link>

                    {ctx?.auth && <>
                        <div className="flex items-center px-2 lg:hidden">
                            <button className="outline-none mobile-menu-button" onClick={toggleDrawerFn(true)}>
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
                        <Search />
                        <div className="items-center hidden lg:flex text-violet-800">
                            <Link
                                className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/'>Movies</Link>
                            <Link
                                className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/shows'>Series</Link>
                            <Link
                                className="px-2 transition duration-500 hover:border-b-2 hover:border-violet-800" to='/mywatchlist'>Watchlist</Link>
                            <Button className='ml-2 text-sm lg:text-md' onClick={signoutHandler}>Sign out</Button>
                        </div>
                    </>}
                    {!ctx?.auth && <Link to='/login' className="z-10 flex items-center justify-center p-2 px-4 py-2 text-sm font-bold text-white rounded-md bg-violet-800 hover:bg-violet-900">Sign in</Link>}

                </div>
            </div>

            {ctx?.auth && <Drawer
                anchor={'left'}
                open={toggleDrawer}
                onClose={toggleDrawerFn(false)}
            >
                {list()}
            </Drawer>
            }
        </nav>
    )
}


export default Header