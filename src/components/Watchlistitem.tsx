import React, { useEffect } from 'react';
import Card from '../../UI/Card';
import { Link } from 'react-router-dom';
import Button from '../../UI/Button';
import {CircularProgress} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlbumIcon from '@mui/icons-material/Album';
import { getHumanizedTimeFromMinutes } from '../utils/commonFunctions';
import { useRemoveFromWatchlist } from '../pages/hooks/useRemoveFromWatchlist';

type WatchlistType = {
    imdbId: string,
    title: string,
    poster: string,
    plot: string,
    runtime: string,
    year: string,
    genre: string,
    media: string,
    rerenderer: (imdbId: string) => void,
}
const Watchlistitem: React.FC<WatchlistType> = (props) => {

    const { imdbId, title, poster, rerenderer, plot, runtime, year, genre, media } = props; 

    const { isLoading: watchlistRmLoading, error: watchListRmError, data: watchListRmData, mutate: watchlistMutate } = useRemoveFromWatchlist(imdbId);

    useEffect(() => {

        if (watchListRmData) {
            rerenderer(imdbId)
        }

    }, [watchListRmData])

    if (watchListRmError) {

        return (
        <div className="flex flex-col items-center w-full h-full">
            <img src={require('../assets/error.png')} alt="Error" />
            <p className="text-2xl text-gray-500">Something went wrong</p>
        </div>
        )
    }

    return (
        <Card>

            <div className="flex flex-col my-2 md:flex-row">
                <img src={poster} alt="poster" className="w-full p-1 rounded-r-none md:w-1/3 rounded-l-md" />
                <div className="flex flex-col p-2">

                    <p className="text-3xl font-bold">{title}</p>
                    <p className="text-sm">{year}</p>
                    <p className="text-md"><AlbumIcon /> &nbsp;- {genre}</p>
                    <p className="text-md"><AccessTimeIcon /> &nbsp;- {getHumanizedTimeFromMinutes(parseInt(runtime))}</p>

                    <p className="text-sm">{plot}</p>

                    <div className='flex h-full my-1 md:items-end'>

                        <Link className='mx-1' to={`/${media}/${imdbId}`}>
                            <Button>Watch</Button></Link>

                        <Button onClick={() => watchlistMutate!()} className='bg-red-500 hover:bg-red-600'>
                            {watchlistRmLoading ?
                                <CircularProgress style={{color:"white"}} size={20}/> : 'Remove'}
                        </Button>
                    </div>

                </div>
            </div>
        </Card>
    )
}

export default Watchlistitem