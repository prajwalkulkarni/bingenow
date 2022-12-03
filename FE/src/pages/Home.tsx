import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase'
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '../../UI/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlbumIcon from '@mui/icons-material/Album';

import CircularProgress from '@mui/material/CircularProgress';
import MediaPortal from '../components/MediaPortal';
import ReactDOM from 'react-dom';
import useFetch from '../hooks/useFetch';
import SnackbarExtended from '../../UI/SnackbarExtended';
import getMessage from '../common/getMessage';

const db = getFirestore(app);

const CardListLazy = React.lazy(() => import('../components/CardList'));
const Home: React.FC = () => {

    const [count, setCount] = useState(0)
    const [play, setPlay] = useState(false)
    const [open, setOpen] = useState(false);
    const { data: carouselData, isLoading, isError } = useQuery('carousel', async () => {
        const querySnapshot = await getDocs(collection(db, 'home'));
        const data = querySnapshot.docs.map((doc) => doc.data());

        return data;
    })

    const media_data = {
        imdbId: carouselData?.[Math.abs(count)]['imdbID'],
        title: carouselData?.[Math.abs(count)]['Title'],
        poster: `https://image.tmdb.org/t/p/original${carouselData?.[Math.abs(count)]['Poster']}`,
        plot: carouselData?.[Math.abs(count)]['Plot'],
        runtime: carouselData?.[Math.abs(count)]['Runtime'],
        year: carouselData?.[Math.abs(count)]['Year'],
        genre: carouselData?.[Math.abs(count)]['Genre'],

    }

    
    const { isLoading: addToWatchlistIsLoading, error: watchListError, data: watchListData, mutate: watchlistMutate } = useFetch({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
        },
        body: JSON.stringify({
            query: `
            mutation {
                addToWatchlist(item:{
                    imdbId:"${media_data.imdbId}",
                    title:"${media_data.title}",
                    poster:"${media_data.poster}",
                    plot:"${media_data.plot}",
                    runtime:"${media_data.runtime}",
                    year:"${media_data.year}",
                    genre:"${media_data.genre}",
                    media:"movie"
                },userId:"${JSON.parse(localStorage.getItem('userId')!)}"){
                    imdbId
                    title
                }
            }
            `
            
                
        })
    }, 'mutate')

    useEffect(()=>{
        if(!addToWatchlistIsLoading&& watchListData){
            setOpen(true)
        }
    },[addToWatchlistIsLoading, watchListData])

    useEffect(() => {
        let interval: NodeJS.Timer;

        if (!play) {
            interval = setInterval(() => {
                setCount(p => (p + 1) % 5)
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [play]);


    const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    },[]);

    const [message,severity] = getMessage(watchListData)
    
    return (
        <div className='flex flex-col'>
            <section>

                <div

                    className='flex relative overflow-hidden flex-col justify-center min-h-[80vh]'
                >
                    <SnackbarExtended open={open} message={message} severity={severity} handleClose={handleClose}/>
                    <div className='z-10 flex justify-between px-2'>
                        <button className='text-white' onClick={() => setCount(p => p === 0 ? (p + 4) % 5 : (p - 1) % 5)}><ArrowBackIosIcon /></button>
                        <button className='text-white' onClick={() => setCount(p => (p + 1) % 5)}><ArrowForwardIosIcon /></button>
                    </div>

                    <AnimatePresence>
                        <motion.div
                            key={count}
                            className='absolute w-full h-full'
                            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${carouselData ? carouselData[Math.abs(count)]['Poster'] : require('../assets/cover/cover.jpg')})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
                            initial={{ x: 1500 }}
                            animate={{
                                x: 0,

                                transition: {
                                    duration: 1.3,

                                }
                            }}
                            exit={{

                                x: -1500,
                                transition: {
                                    duration: 1.5,
                                }
                            }}>
                            <div
                                className='absolute w-full h-full p-1 bg-gradient-to-r from-black to-transparent'>
                                {play && ReactDOM.createPortal(<MediaPortal
                                    mediaType='movie' imdbID={carouselData ? media_data.imdbId : ''}
                                    onClick={() => setPlay(false)} />, document.getElementById('portal')!)}
                                <div className='flex'>
                                    <div className='flex flex-col p-6 md:w-1/2'>
                                        {carouselData ? <p className='text-6xl font-bold text-white'>{media_data.title}</p> : <div className='min-w-[80vw] md:w-full h-6 my-2 text-6xl font-bold bg-gray-600 animate-pulse'></div>}
                                        {carouselData ? <p className='p-1 text-lg text-white'>{media_data.plot}</p> : <div className='min-w-[80vw] md:w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}

                                        <div className='flex flex-col justify-start mt-4 md:items-center md:flex-row'>
                                            {carouselData ? <p className='flex items-center px-1 text-lg font-semibold text-white'><AlbumIcon/> &nbsp;- {media_data.genre}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                            <p className='hidden text-lg font-semibold text-white md:flex sm:px-1 md:px-1'>|</p>
                                            {carouselData ? <p className='flex items-center px-1 text-lg font-semibold text-white'><CalendarMonthIcon/> &nbsp;- {media_data.year}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                            <p className='hidden text-lg font-semibold text-white md:flex sm:px-1 md:px-1'>|</p>
                                            {carouselData ? <p className='flex items-center px-1 text-lg font-semibold text-white'><AccessTimeIcon/> &nbsp;- {media_data.runtime}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                        </div>

                                        <div className='flex'>
                                            {
                                                carouselData ?
                                                <>
                                                <Button
                                                className='mx-1'
                                                onClick={() => setPlay(true)}><PlayCircleOutlineIcon />Watch</Button>

                                            <Button
                                                className='mx-1' onClick={watchlistMutate}>
                                                {addToWatchlistIsLoading ?
                                                    <motion.div
                                                        animate={{
                                                            transform: 'rotate(360deg)',
                                                            transition: { duration: 1, repeat: Infinity, repeatType: 'loop' }

                                                        }}

                                                        className='w-6 h-6 border-t-2 border-l-2 border-white rounded-xl'></motion.div> : 'Add to watchlist'}
                                            </Button>
                                                </>:
                                                <div className='w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>
                                            }
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                </div>

            </section>

            <div className='flex flex-col p-2'>
                <p className='py-3 text-5xl font-bold'>Action & Drama</p>
                {isLoading ? <div className='flex justify-center'><CircularProgress /></div> : <CardListLazy category='action' />}
            </div>

            <div className='flex flex-col p-2'>
                <p className='py-3 text-5xl font-bold'>Popular animated films</p>
                {isLoading ? <div className='flex justify-center'><CircularProgress /></div> : <CardListLazy category='animated' />}
            </div>

            <div className='flex flex-col p-2'>
                <p className='py-3 text-5xl font-bold'>Watch with friends</p>
                {isLoading ? <div className='flex justify-center'><CircularProgress /></div> : <CardListLazy category='friends' />}
            </div>


        </div>
    );
}

export default Home;