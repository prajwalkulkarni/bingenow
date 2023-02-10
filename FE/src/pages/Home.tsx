import React, { useEffect, useState, useCallback, useRef } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase'
import { useQuery } from 'react-query';
import { motion } from 'framer-motion'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '../../UI/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlbumIcon from '@mui/icons-material/Album';

import CircularProgress from '@mui/material/CircularProgress';
import MediaPortal from '../components/MediaPortal';
import ReactDOM from 'react-dom';
import useFetch from '../hooks/useFetch';
import SnackbarExtended from '../../UI/SnackbarExtended';
import getMessage from '../common/getMessage';
import { useNavigate } from 'react-router-dom';
import { ContentSeparator, SkeletalPlaceholder } from '../common/CommonComponents';
import moment from 'moment';
import { getHumanizedTimeFromMinutes } from '../utils/commonFunctions';
const db = getFirestore(app);


const CardListLazy = React.lazy(() => import('../components/CardList'));
const Home: React.FC<{ movies: boolean }> = (props) => {

    const { movies } = props
    
    const { data: carouselData, isLoading, isError } = useQuery(movies ? 'carousel' : 'carouselshows', async () => {
        const querySnapshot = await getDocs(collection(db, movies ? 'home' : 'shows'));
        const data = querySnapshot.docs.map((doc) => doc.data());

        return data;
    })
    
 
    if(isError){
        return <div className="flex flex-col items-center w-full h-full">

            <img src={require('../assets/error.png')} alt="Error"/>
            <p className="text-2xl text-gray-500">Something went wrong</p>
        </div>
    }

    return (
        <div className='flex flex-col'>
            <section>

                <div

                    className='flex relative overflow-hidden flex-col justify-center items-center min-h-[30vh] md:min-h-[60vh]'
                >
                    
                        <CarouselSlides
                            movies={movies}
                            carouselData={carouselData}
                            /> 
                </div>

            </section>

            <MediaCardsContainer movies={movies} isLoading={isLoading}/>


        </div>
    );
}


type CarouselType = {
    imdbId: string;
    title: string;
    poster: string;
    plot: string;
    runtime: string;
    year: string;
    genre: string;
}
type CarouselSlidesType = {    
    carouselData: any,
    movies: boolean,

}
const CarouselSlides = (props: CarouselSlidesType) => {

    const { movies, carouselData } = props
    const navigate = useNavigate()

    const [play, setPlay] = useState(false)
    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(1)
    
    
    const prevCount = useRef(count)
    const [carouselSlides, setCarouselSlides] = useState<CarouselType[]>([])
    


    const media_data = {
        imdbId: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['imdbId'] : '',
        title: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['title'] : '',
        poster: `https://image.tmdb.org/t/p/original${carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['poster'] : ''}`,
        plot: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['plot'] : '',
        runtime: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['runtime'] : '',
        year: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['year'] : '',
        genre: carouselSlides.length > 0 ? carouselSlides[Math.abs(count)]['genre'] : '',

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

    const [message, severity] = getMessage(watchListData)

    useEffect(() => {
        let interval: NodeJS.Timer;

        if (!play) {
            interval = setInterval(() => {
                setCount((p:number) => p > 6 ? 1 : (p + 1) % 7)
            }, 5000);
        }

        return () => clearInterval(interval);
    }, [play]);

    useEffect(()=>{

        if(count===6){
            setTimeout(()=>setCount(1),500)
        }

        if(count===0){
            setTimeout(()=>setCount(5),500)
        }

        return () => {prevCount.current = count}

    },[count])

    useEffect(() => {
        if (!addToWatchlistIsLoading && watchListData) {
            setOpen(true)
        }
    }, [addToWatchlistIsLoading, watchListData])


    useEffect(() => {
        if (carouselData) {

            const arr = carouselData.map((_:any, idx: number) => {
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

    if(watchListError){
        return <div className="flex flex-col items-center w-full h-full">

            <img src={require('../assets/error.png')} alt="Error"/>
            <p className="text-2xl text-gray-500">Something went wrong</p>
        </div>
    }
    if(!carouselData){
        return <Placeholder count={count} />
    }
    
    return (
        <>
        <SnackbarExtended open={open} message={message} severity={severity} handleClose={handleClose} />
                    <div className='z-10 flex justify-between w-full px-2'>
                        <button className='text-white' onClick={() => setCount(p => p === 0 ? (p + 6) % 7 : (p - 1) % 7)}><ArrowBackIosIcon /></button>
                        <button className='text-white' onClick={() => setCount(p => p > 6 ? 1 : (p + 1) % 7)}><ArrowForwardIosIcon /></button>
                    </div>
            {carouselSlides.map((media_data_carousel: CarouselType, i: number) => {
                return (

                    <div
                        key={i}
                        className={`absolute z-0 flex w-4/5 h-full mx-5 ${(count === 1 && prevCount.current === 5) || (count === 5 && prevCount.current === 1) ? 'transition-none' : 'transition duration-500 ease-in-out transform'}`}

                        style={{
                            backgroundImage: `url(${media_data_carousel.poster})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',
                            transform: `translateX(${(i - count) * 100}%)`,
                        }}


                    >
                        <div
                            className='absolute w-4/5 h-full p-1 bg-gradient-to-r from-black to-transparent'>
                            {play && ReactDOM.createPortal(<MediaPortal
                                mediaType='movie' imdbID={media_data_carousel.imdbId}
                                onClick={() => setPlay(false)} />, document.getElementById('portal')!)}
                            <div className='flex'>
                                <div className='flex flex-col p-6 md:w-4/5'>
                                    <p className='text-3xl font-bold text-white md:text-5xl'>{media_data_carousel.title}</p>
                                    <p className='hidden p-1 text-lg text-white md:block'>{media_data_carousel.plot}</p>

                                    <div className='flex-col justify-start hidden mt-4 sm:flex md:items-start lg:flex-row'>
                                        <p className='flex items-center px-1 text-lg font-semibold text-white'><AlbumIcon /> &nbsp;- {media_data_carousel.genre}</p>
                                        <ContentSeparator/>
                                        <p className='flex items-center px-1 text-lg font-semibold text-white'><CalendarMonthIcon /> &nbsp;- {media_data_carousel.year}</p>
                                        <ContentSeparator/>
                                        <p className='flex items-center px-1 text-lg font-semibold text-white'><AccessTimeIcon /> &nbsp;- {getHumanizedTimeFromMinutes(parseInt(media_data_carousel.runtime))}</p>
                                    </div>

                                    <div className='flex-col justify-between md:flex md:w-fit md:flex-row md:justify-start'>
                                        {
                                            carouselData ?
                                                <>
                                                    {
                                                        movies ? <Button
                                                            className='m-1'
                                                            onClick={() => setPlay(true)}><PlayCircleOutlineIcon />Watch</Button>
                                                            :
                                                            <Button className='m-1' onClick={() => navigate(`/series/${media_data_carousel.imdbId}`)}><PlayCircleOutlineIcon />Watch</Button>
                                                    }

                                                    <Button
                                                        className='m-1' onClick={watchlistMutate}>
                                                        {addToWatchlistIsLoading ?
                                                            <motion.div
                                                                animate={{
                                                                    transform: 'rotate(360deg)',
                                                                    transition: { duration: 1, repeat: Infinity, repeatType: 'loop' }

                                                                }}

                                                                className='w-6 h-6 border-t-2 border-l-2 border-white rounded-xl'></motion.div> : 'Add to watchlist'}
                                                    </Button>
                                                </> :
                                                <SkeletalPlaceholder height={8}/>
                                        }
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                )
            }
            )}
        </>
    )
}

const Placeholder = (props: { count: number }) => {

    const { count } = props
    return (
        <>
            {
                new Array(3).fill(0).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className='absolute z-0 flex w-4/5 h-full mx-10 border-2 rounded-lg border-red'
                            style={{
                                transform: `translateX(${(i - count) * 100}%)`,
                            }}
                        >
                            <div
                                className='absolute w-4/5 h-full p-1 bg-gradient-to-r from-black to-transparent'>
                                <div className='flex'>
                                    <div className='flex flex-col p-6 md:w-4/5'>
                                        <div className='min-w-[80vw] md:w-full h-6 my-2 text-6xl font-bold bg-gray-600 animate-pulse'></div>
                                        <div className='hidden md:visible min-w-[80vw] md:w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>

                                        <div className='flex flex-col justify-start mt-4 md:items-center md:flex-row'>
                                            <SkeletalPlaceholder height={4}/>
                                            <ContentSeparator/>
                                            <SkeletalPlaceholder height={4}/>
                                            <ContentSeparator/>
                                            <SkeletalPlaceholder height={4}/>
                                        </div>

                                        <div className='flex'>
                                            <SkeletalPlaceholder height={8}/>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

const MediaCardsContainer = (props:{movies:boolean, isLoading:boolean}) => {

    const {movies, isLoading} = props
    const DATA = [{
        id: Math.random(),
        title: 'Action & Drama',
        category: movies? 'action' : 'drama',
    },{
        id: Math.random(),
        title: `Popular animated ${movies ? 'films' : 'shows'}`,
        category: movies?'animated':'cartoon',
    },{
        id: Math.random(),
        title: movies ? "Watch with friends" : "World of Comedy",
        category: movies?'friends':'comedy',
    }]

    return (
        <>
            {
                DATA.map((data) => {
                    return (
                        <MediaCards
                            key={data.id}
                            title={data.title}
                            isLoading={isLoading}
                            movies={movies}
                            category={data.category}
                        />
                    )
                })
            }
        </>
    )


}


type MediaCardsType = {
    title: string,
    movies: boolean,
    isLoading: boolean,
    category: string,
}
const MediaCards = (props: MediaCardsType) => {

    const {title, movies, isLoading, category} = props

    if(isLoading){
        return(
            <div className='flex justify-center m-2'>
                <CircularProgress color='primary' />
            </div>
        )
    }
    return(
        <div className='flex flex-col p-2'>
                <p className='py-3 text-5xl font-bold'>{title}</p>
                <CardListLazy category={category} movies={movies} />
        </div>
    )
}

export default Home