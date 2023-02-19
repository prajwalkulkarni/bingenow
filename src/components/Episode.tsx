import React from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import ReactDOM from "react-dom";
import MediaPortal from "./MediaPortal";
import Button from "../../UI/Button";
type Props = {
    image: string,
    episode: number,
    name: string,
    overview: string,
    air_date: string,
    imdbID: string,
    season: number
}
const Episode: React.FC<Props> = (props) => {

    const { image, imdbID, season, episode, name, overview, air_date } = props

    const [play, setPlay] = React.useState(false)

    return (
        <div className='flex flex-col p-1 m-2 bg-white md:flex-row'>

            {play && ReactDOM.createPortal(<MediaPortal 
            mediaType='series' imdbID={imdbID} 
            onClick={()=>setPlay(false)}
            season={season} episode={episode} />, document.getElementById('portal') as HTMLElement)}
            <img src={`https://image.tmdb.org/t/p/w500${image}`} alt={name} className='object-contain w-full md:w-1/4' />
            <div className='flex flex-col ml-2'>
                <h1 className='text-2xl font-bold'>{name}</h1>
                <p className='text-md'>{overview}</p>
                <p className='text-sm'>Air Date: {air_date}</p>
                <div className="flex items-end h-full ">
                    <Button onClick={()=>setPlay(true)}
                    ><PlayCircleOutlineIcon/>Watch</Button>
                </div>
            </div>
        </div>
    )
}

export default Episode