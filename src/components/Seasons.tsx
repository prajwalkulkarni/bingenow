import React from "react"
import {useQuery} from 'react-query'
import CircularProgress from '@mui/material/CircularProgress';
import Episode from "./Episode";

type EpisodeType = {
    air_date: string,
    name: string,
    overview: string,
    episode_number: number,
    season_number: number,
    still_path: string,
}

const Seasons =  React.forwardRef<HTMLDivElement, {title:string|undefined,imdbID:string,season:number,tmdbID:string|undefined}>((props, ref) => {
    
    const {title,imdbID, season,tmdbID} = props

    const queryKey = title? title+season: ''
    const {data, status, error} = useQuery(queryKey, async()=>{
        const episodes = await fetch(`https://api.themoviedb.org/3/tv/${tmdbID}/season/${season}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
        const episodes_json = await episodes.json()
        return episodes_json['episodes']
    }
    )

    if(error){
        return <div className="flex flex-col items-center w-full h-full">

            <img src={require('../assets/error.png')} alt="Error"/>
            <p className="text-2xl text-gray-500">Something went wrong</p>
        </div>
    }

    
        return (
            <div className="w-full h-full" ref={ref}>
                {status==='loading' && <div className='flex justify-center py-2'><CircularProgress color="primary"/></div>}
                {
                    data && data.map((episode:EpisodeType)=>{
                        return <Episode 
                        key={episode.episode_number} 
                        image={episode.still_path} 
                        episode={episode.episode_number} 
                        name={episode.name} 
                        overview={episode.overview} 
                        air_date={episode.air_date}
                        imdbID={imdbID}
                        season={season}/>
                    })
                }
            </div>
        )
    })
    
export default Seasons