import React, { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom'
import Button from '../../UI/Button'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useQuery } from 'react-query';
import Seasons from '../components/Seasons';
import Feature from '../components/Feature';
import MediaPortal from '../components/MediaPortal';
import { motion, AnimatePresence } from 'framer-motion'
import useFetch from '../hooks/useFetch';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SnackbarExtended from '../../UI/SnackbarExtended';
import getMessage from '../common/getMessage'
type MediaDetailsType = {
    title: string,
    year: string,
    rated: string,
    runtime: string,
    genre: string,
    director: string,
    backdrop: string,
    plot: string,
    imdbRating: string,
    actors: string,
    seasons?: number,
    tmdbID: string,
}

const Movie: React.FC<{}> = (props) => {

    const route = useParams()

    const [open, setOpen] = useState(false);

    const [toast, setToast] = useState<{ message: string, severity: "success" | "error" | "info" | "warning" }>({
        message: '',
        severity: 'success'
    })

    const [season, setSeason] = React.useState(1)

    const [play, setPlay] = React.useState(false)
    const { mediaType, imdbID } = route

    const changeSeason = (e: SelectChangeEvent<number>) => {
        setSeason(Number(e.target.value))
    }


    const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }, []);


    const { data, status, isLoading, error } = useQuery([imdbID!], async () => {

        const backdrop = await fetch(`https://api.themoviedb.org/3/find/${imdbID}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&external_source=imdb_id`)
        const backdrop_json = await backdrop.json()

        const backdrop_path = mediaType === 'movie' ? backdrop_json['movie_results'][0]['backdrop_path'] : backdrop_json['tv_results'][0]['backdrop_path']
        const tmdbId = mediaType === 'movie' ? backdrop_json['movie_results'][0]['id'] : backdrop_json['tv_results'][0]['id']


        const media_details = await fetch(`https://omdbapi.com/?i=${imdbID}&apiKey=${process.env.REACT_APP_OMDB_API_KEY}`)
        const media_details_json = await media_details.json()


        if (mediaType === 'series') {
            const seasons = await (await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)).json()
            const seasons_count = seasons['number_of_seasons']
            const data: MediaDetailsType = {
                title: media_details_json['Title'],
                year: media_details_json['Year'],
                rated: media_details_json['Rated'],
                runtime: media_details_json['Runtime'],
                genre: media_details_json['Genre'],
                director: media_details_json['Director'],
                backdrop: backdrop_path,
                plot: media_details_json['Plot'],
                imdbRating: media_details_json['imdbRating'],
                actors: media_details_json['Actors'],
                seasons: seasons_count,
                tmdbID: tmdbId

            }
            return data;
        }
        else {

            const data: MediaDetailsType = {
                title: media_details_json['Title'],
                year: media_details_json['Year'],
                rated: media_details_json['Rated'],
                runtime: media_details_json['Runtime'],
                genre: media_details_json['Genre'],
                director: media_details_json['Director'],
                backdrop: backdrop_path,
                plot: media_details_json['Plot'],
                imdbRating: media_details_json['imdbRating'],
                actors: media_details_json['Actors'],
                tmdbID: tmdbId
            }
            return data;
        }

    })

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
                    imdbId:"${imdbID}",
                    title:"${data?.title}",
                    poster:"https://image.tmdb.org/t/p/original${data?.backdrop}",
                    plot:"${data?.plot}",
                    runtime:"${data?.runtime}",
                    year:"${data?.year}",
                    genre:"${data?.genre}",
                    media:"${mediaType}"
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

            const [message, severity] = getMessage(watchListData)
            setToast({
                message,
                severity
            })
        }
    }, [addToWatchlistIsLoading, watchListData])


    return (
        <main>
            <section>
                <Feature image={`https://image.tmdb.org/t/p/original${data?.backdrop}`}>
                    {play && ReactDOM.createPortal(<MediaPortal
                        mediaType='movie' imdbID={imdbID!}
                        onClick={() => setPlay(false)} />, document.getElementById('portal')!)}

                    <div className='flex'>
                        <div className='flex flex-col p-6 md:w-1/2'>
                            <SnackbarExtended open={open} message={toast.message} severity={toast.severity} handleClose={handleClose} />
                            {data ? <p className='text-5xl font-bold text-white'>{data.title}</p> : <div className='w-full h-6 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                            <div className='flex flex-col py-3 md:flex-row md:items-center'>
                                {mediaType === 'series' && <FormControl sx={{ minWidth: 120 }} size="small"
                                    className='text-white border-none h-fit w-fit bg-violet-800 hover:border-none hover:text-white'>

                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={season}
                                        label="Season"
                                        sx={{
                                            color: 'white',
                                            boxShadow: 'none',
                                            '.MuiOutlinedInput-notchedOutline': { border: 0 },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                border: 0,
                                            },
                                        }}
                                        notched={false}
                                        className='text-white bg-violet-800 hover:border-none hover:text-white'
                                        onChange={changeSeason}
                                    >
                                        {new Array(data?.seasons).fill(0).map((_, i) => {
                                            return <MenuItem className='p-2 text-black bg-gray-500 rounded-none hover:bg-violet-900' key={i} value={i + 1}>Season {i + 1}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>}
                                {data ? <div className='flex flex-col md:flex-row'>
                                    <p className='flex items-center text-lg font-semibold text-white sm:px-1'><AccessTimeIcon /> &nbsp;- {data.runtime}</p>
                                    <p className='hidden text-lg font-semibold text-white md:flex sm:px-1 md:px-1'>|</p>
                                    <p className='flex items-center text-lg font-semibold text-white sm:px-1'><StarOutlineIcon/> &nbsp;- IMdb {data.imdbRating}</p>
                                    <p className='hidden px-1 text-lg font-semibold text-white md:flex md: sm:px-1'>|</p>
                                    <p className='flex items-center text-lg font-semibold text-white sm:px-1'><CalendarMonthIcon/> &nbsp;- {data.year}</p></div> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}

                            </div>
                            {data ? <p className='p-1 text-lg text-white'>{data.plot}</p> : <div className='w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}

                            <div className='flex flex-col justify-center mt-4'>
                                {
                                    data ?
                                        <>
                                            <p className='text-lg font-semibold text-white sm:px-1'>Director: {data.director}</p>
                                            <p className='text-lg font-semibold text-white sm:px-1'>Actors: {data.actors}</p>
                                            <p className='text-lg font-semibold text-white sm:px-1'>Genre: {data.genre}</p>
                                            

                                        </> :
                                        <div className='w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>
                                }
                                {mediaType === 'movie' && <div className='flex'>
                                    {
                                        data ? <>
                                            <Button className='mx-1' onClick={() => setPlay(true)}><PlayCircleOutlineIcon />Watch</Button>
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
                                </div>}
                            </div>
                        </div>
                    </div>
                </Feature>
            </section>
            <section>
                {mediaType === 'series' && data?.tmdbID && <Seasons title={data?.title}
                    imdbID={imdbID!}
                    season={season}
                    tmdbID={data?.tmdbID} />}
            </section>

        </main>
    )
}

export default Movie