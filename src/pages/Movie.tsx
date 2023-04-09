import React, { useEffect, useState, useCallback } from 'react'
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom'
import Button from '../../UI/Button'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useQuery } from 'react-query';
import Seasons from '../components/Seasons';
import Feature from '../components/Feature';
import MediaPortal from '../components/MediaPortal';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SnackbarExtended from '../../UI/SnackbarExtended';
import getMessage from '../common/getMessage'
import Error from '../components/ErrorPage';
import { ContentSeparator, SkeletalPlaceholder } from '../common/CommonComponents';
import { getHumanizedTimeFromMinutes } from '../utils/commonFunctions';
import { useAddtoWatchlist } from './hooks/useAddToWatchlist';
import {CircularProgress} from '@mui/material';

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

const Movie: React.FC<Record<string, never>> = () => {

    const route = useParams()

    const seasonsRef = React.useRef<HTMLDivElement>(null);
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

    useEffect(() => {
        if (seasonsRef.current) {
            seasonsRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [season])

    const handleClose = useCallback((event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    }, []);


    const { data, error } = useQuery([imdbID!], async () => {

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

    const media_data = {
        title: data?.title ?? "",
        year: data?.year ?? "",
        genre: data?.genre ?? "",
        runtime: data?.runtime ?? "",
        plot: data?.plot ?? "",
        poster: `https://image.tmdb.org/t/p/original${data?.backdrop}`,
        imdbId: imdbID ?? "",
        media: mediaType

    }
    const { isLoading: addToWatchlistIsLoading, error: watchListError, data: watchListData, mutate: watchlistMutate } = useAddtoWatchlist(media_data)

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


    if (error || watchListError) {

        return <Error />
    }

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
                            {data ? <p className='text-2xl font-bold text-white md:text-5xl'>{data.title}</p> : <SkeletalPlaceholder height={6} />}
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
                                    <p className='flex items-center font-semibold text-white text-md md:text-lg sm:px-1'><AccessTimeIcon /> &nbsp;- {getHumanizedTimeFromMinutes(parseInt(data.runtime))}</p>
                                    <ContentSeparator />
                                    <p className='flex items-center font-semibold text-white text-md md:text-lg sm:px-1'><StarOutlineIcon /> &nbsp;- IMdb {data.imdbRating}</p>
                                    <ContentSeparator />
                                    <p className='flex items-center font-semibold text-white text-md md:text-lg sm:px-1'><CalendarMonthIcon /> &nbsp;- {data.year}</p></div> : <SkeletalPlaceholder height={4} />}

                            </div>
                            {data ? <p className='p-1 text-white text-md md:text-lg'>{data.plot}</p> : <SkeletalPlaceholder height={8} />}

                            <div className='flex flex-col justify-center mt-4'>
                                {
                                    data ?
                                        <>
                                            <p className='font-semibold text-white text-md md:text-lg sm:px-1'>Director: {data.director}</p>
                                            <p className='font-semibold text-white text-md md:text-lg sm:px-1'>Actors: {data.actors}</p>
                                            <p className='font-semibold text-white text-md md:text-lg sm:px-1'>Genre: {data.genre}</p>


                                        </> :
                                        <SkeletalPlaceholder height={8} />
                                }
                                <div className='flex'>
                                    {
                                        data ? <>
                                            {mediaType === 'movie' && <Button className='mx-1' onClick={() => setPlay(true)}><PlayCircleOutlineIcon />Watch</Button>}
                                            <Button
                                                className='mx-1 disabled:opacity-75' onClick={watchlistMutate}
                                                disabled={addToWatchlistIsLoading}>
                                                {addToWatchlistIsLoading ?
                                                    <CircularProgress style={{color:"white"}} size={20}/> : 'Add to watchlist'}
                                            </Button>
                                        </> :
                                            <SkeletalPlaceholder height={8} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Feature>
            </section>
            <section>
                {mediaType === 'series' && data?.tmdbID && <Seasons title={data?.title}
                    ref={seasonsRef}
                    imdbID={imdbID!}
                    season={season}
                    tmdbID={data?.tmdbID} />}
            </section>

        </main>
    )
}

export default Movie