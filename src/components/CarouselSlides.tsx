import React, {useState, useEffect, useRef, useCallback} from 'react';
import ReactDOM from 'react-dom';
import Button from '../../UI/Button';
import { ContentSeparator, SkeletalPlaceholder } from '../common/CommonComponents';
import MediaPortal from './MediaPortal';
import { useNavigate } from 'react-router-dom';
import { CarouselType } from '../pages/Home';
import getMessage from '../common/getMessage';
import Placeholder from './Placeholder';
import SnackbarExtended from '../../UI/SnackbarExtended';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlbumIcon from '@mui/icons-material/Album';
import { motion } from 'framer-motion'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useAddtoWatchlist } from '../pages/hooks/useAddToWatchlist';
import { getHumanizedTimeFromMinutes } from '../utils/commonFunctions';

type CarouselSlidesType = {    
    carouselData: any,
    movies: boolean,

}
const CarouselSlides = (props: CarouselSlidesType) => {

    const { movies, carouselData } = props
    const navigate = useNavigate();

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
        media: "movie"

    }

    const { isLoading: addToWatchlistIsLoading, error: watchListError, data: watchListData, mutate: watchlistMutate } = useAddtoWatchlist(media_data);

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
                                    <p className='text-2xl font-bold text-white md:text-5xl'>{media_data_carousel.title}</p>
                                    <p className='hidden p-1 text-lg text-white lg:block'>{media_data_carousel.plot}</p>

                                    <div className='flex-col justify-start hidden mt-4 md:flex md:items-start lg:flex-row'>
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
                                                        className='m-1 disbaled:opacity-75' onClick={watchlistMutate}
                                                        disabled={addToWatchlistIsLoading}>
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

export default CarouselSlides;