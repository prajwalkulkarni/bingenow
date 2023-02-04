import React, { useEffect } from 'react';
import Card from '../../UI/Card';
import { Link } from 'react-router-dom';
import Button from '../../UI/Button';
import { motion } from 'framer-motion';
import useFetch from '../hooks/useFetch';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AlbumIcon from '@mui/icons-material/Album';


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


    const { isLoading: watchlistRmLoading, error: watchListRmError, data: watchListRmData, mutate: watchlistMutate } = useFetch({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
        },
        body: JSON.stringify({
            query: `
            mutation {
                removeFromWatchlist(imdbId:"${imdbId}",id:"${JSON.parse(localStorage.getItem('userId')!)}"){
                    imdbId
                    title
                }
            }
            `
        })
    }, 'mutate')

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
                    <p className="text-md"><AccessTimeIcon /> &nbsp;- {runtime}</p>

                    <p className="text-sm">{plot}</p>

                    <div className='flex h-full my-1 md:items-end'>

                        <Link className='mx-1' to={`/${media}/${imdbId}`}>
                            <Button>Watch</Button></Link>

                        <Button onClick={() => watchlistMutate!()} className='bg-red-500 hover:bg-red-600'>
                            {watchlistRmLoading ?
                                <motion.div
                                    animate={{
                                        transform: 'rotate(360deg)',
                                        transition: { duration: 1, repeat: Infinity, repeatType: 'loop' }

                                    }}

                                    className='w-6 h-6 border-t-2 border-l-2 border-white rounded-xl'></motion.div> : 'Remove'}
                        </Button>
                    </div>

                </div>
            </div>
        </Card>
    )
}

export default Watchlistitem