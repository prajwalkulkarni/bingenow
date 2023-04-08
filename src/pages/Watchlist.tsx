import React,{useEffect, useCallback} from 'react'
import useFetch from '../hooks/useFetch'
import Loader from '../../UI/Loader';
import Watchlistitem from '../components/Watchlistitem'
import SnackbarExtended from '../../UI/SnackbarExtended';
import { useGetWatchlist } from './hooks/useGetWatchlist';


type WatchlistType = {
    imdbId: string,
    title: string,
    poster: string,
    plot: string,
    runtime: string,
    year: string,
    genre: string,
    media: string,
    rerenderer?: (imdbId: string) => void,
}
const Watchlist:React.FC = () => {

    const [watchlist, setWatchlist] = React.useState<WatchlistType[]>([])
    const [open, setOpen] = React.useState<boolean>(false)
    const { isLoading: watchlistIsLoading, error: watchListError, data: watchListData} = useGetWatchlist()

    useEffect(() => {
        if(watchListData){
            setWatchlist(watchListData.data.watchlist??[])
        }
    }, [watchListData])


    const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }, []);
    const rerender = (imdbId:string) => {
        const watchlistArr = watchlist.filter((item:WatchlistType) => item.imdbId !== imdbId)
        setWatchlist(watchlistArr)
    }

    if(watchlistIsLoading){
        return <Loader text='Loading your watchlist...' />
    }

    if(watchListError){
        return <SnackbarExtended severity='error' message='Something went wrong, please try again later.' open={open} handleClose={handleClose}/>
    }
    
    if(watchlist.length === 0){
        return <div className='flex flex-col items-center justify-center w-full h-screen'>
            <img src={require('../assets/watchlistempty.png')} width="300" className='mx-auto'/>
            <p className='text-2xl font-bold'>Ahoy! There's nothing in here.</p>
            </div>
    }
    return (
        <div>
                   
            <p className='self-start p-3 text-3xl font-bold md:text-5xl'>My Watchlist</p>
            {watchListData && watchlist?.map((item:WatchlistType) => {
                return (
                    <Watchlistitem
                        key={item.imdbId}
                        imdbId={item.imdbId}
                        title={item.title}
                        poster={item.poster}
                        plot={item.plot}
                        runtime={item.runtime}
                        year={item.year}
                        rerenderer={rerender}
                        genre={item.genre}
                        media={item.media}
                        />
                )
            })}
        </div>
    )
}

export default Watchlist