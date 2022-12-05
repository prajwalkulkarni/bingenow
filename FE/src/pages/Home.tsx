import React, { useEffect, useState, useCallback, useRef } from 'react';
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

    const [count, setCount] = useState(1)
    const [play, setPlay] = useState(false)
    const [open, setOpen] = useState(false);

    const prevCount = useRef(count)
    const [carouselSlides, setCarouselSlides] = useState<any>([])
    const { data: carouselData, isLoading, isError } = useQuery('carousel', async () => {
        const querySnapshot = await getDocs(collection(db, 'home'));
        const data = querySnapshot.docs.map((doc) => doc.data());

        return data;
    })


    const media_data = {
        imdbId: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['imdbID'] : '',
        title: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['Title'] : '',
        poster: `https://image.tmdb.org/t/p/original${carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['Poster'] : ''}`,
        plot: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['Plot'] : '',
        runtime: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['Runtime'] : '',
        year: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['Year'] : '',
        genre: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['Genre'] : '',

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



    useEffect(() => {
        if (!addToWatchlistIsLoading && watchListData) {
            setOpen(true)
        }
    }, [addToWatchlistIsLoading, watchListData])

    // useEffect(() => {
    //     let interval: NodeJS.Timer;

    //     if (!play) {
    //         interval = setInterval(() => {
    //             setCount(p => (p + 1) % 5)
    //         }, 5000);
    //     }

    //     return () => clearInterval(interval);
    // }, [play]);

    

    useEffect(() => {
        if (carouselData) {

            const arr = carouselData.map((item: any, idx: number) => {
                return {
                    imdbId: carouselData?.[Math.abs(idx)]['imdbID'],
                    title: carouselData?.[Math.abs(idx)]['Title'],
                    poster: `https://image.tmdb.org/t/p/original${carouselData?.[Math.abs(idx)]['Poster']}`,
                    plot: carouselData?.[Math.abs(idx)]['Plot'],
                    runtime: carouselData?.[Math.abs(idx)]['Runtime'],
                    year: carouselData?.[Math.abs(idx)]['Year'],
                    genre: carouselData?.[Math.abs(idx)]['Genre'],
                }
            })
            arr.push(arr[0])
            arr.unshift(arr[arr.length - 2])
            setCarouselSlides(arr)

        }
    }, [carouselData])

    const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }, []);

    
    console.log(count,prevCount.current)
    useEffect(()=>{
        
        if(count===6){
            setTimeout(()=>setCount(1),500)
        }

        if(count===0){
            setTimeout(()=>setCount(5),500)
        }

        return () => {prevCount.current = count}

    },[count])

    const [message, severity] = getMessage(watchListData)

    return (
        <div className='flex flex-col'>
            <section>

                <div

                    className='flex relative overflow-hidden flex-col justify-center items-center min-h-[60vh]'
                >
                    <SnackbarExtended open={open} message={message} severity={severity} handleClose={handleClose} />
                    <div className='z-10 flex justify-between w-full px-2'>
                        <button className='text-white' onClick={() => setCount(p => p === 0 ? (p + 6) % 7 : (p - 1) % 7)}><ArrowBackIosIcon /></button>
                        <button className='text-white' onClick={() => setCount(p => p > 6 ? 1 : (p + 1) % 7)}><ArrowForwardIosIcon /></button>
                    </div>


                    {carouselSlides.map((media_data_carousel: any, i: number) => {
                        return (
                        
                                <div
                                key={i}
                                className={`absolute z-0 flex w-4/5 h-full mx-10 ${(count ===1 && prevCount.current ===5) || (count === 5 && prevCount.current === 1)?'transition-none':'transition duration-500 ease-in-out transform'} border-2 rounded-lg border-red hover:scale-105`}

                                style={{
                                    backgroundImage: `url(${media_data_carousel.poster})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                                    transform: `translateX(${(i - count) * 100}%)`,
                                }}


                            >
                                <div
                                    className='absolute w-4/5 h-full p-1 bg-gradient-to-r from-black to-transparent'>
                                    {play && ReactDOM.createPortal(<MediaPortal
                                        mediaType='movie' imdbID={carouselData ? media_data_carousel.imdbId : ''}
                                        onClick={() => setPlay(false)} />, document.getElementById('portal')!)}
                                    <div className='flex'>
                                        <div className='flex flex-col p-6 md:w-4/5'>
                                            {carouselData ? <p className='text-5xl font-bold text-white'>{media_data_carousel.title}</p> : <div className='min-w-[80vw] md:w-full h-6 my-2 text-6xl font-bold bg-gray-600 animate-pulse'></div>}
                                            {carouselData ? <p className='p-1 text-lg text-white'>{media_data_carousel.plot}</p> : <div className='min-w-[80vw] md:w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}

                                            <div className='flex flex-col justify-start mt-4 md:items-center md:flex-row'>
                                                {carouselData ? <p className='flex items-center px-1 text-lg font-semibold text-white'><AlbumIcon /> &nbsp;- {media_data_carousel.genre}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                                <p className='hidden text-lg font-semibold text-white md:flex sm:px-1 md:px-1'>|</p>
                                                {carouselData ? <p className='flex items-center px-1 text-lg font-semibold text-white'><CalendarMonthIcon /> &nbsp;- {media_data_carousel.year}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                                <p className='hidden text-lg font-semibold text-white md:flex sm:px-1 md:px-1'>|</p>
                                                {carouselData ? <p className='flex items-center px-1 text-lg font-semibold text-white'><AccessTimeIcon /> &nbsp;- {media_data_carousel.runtime}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
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
                                                        </> :
                                                        <div className='w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>
                                                }
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            )
                        }
                    )}


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


function returnVal(idx: number, count: number) {

    if (count === 0 && idx === 4) return -1;

    if (idx === 4) return -1;

    if (count === 4 && idx === 0) return 1;

    return idx - count;
}
export default Home;