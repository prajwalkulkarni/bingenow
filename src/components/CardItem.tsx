import React from "react"
import Card from "../../UI/Card"

type CardItemProps = {
    title: string,
    year: string,
    runtime: string,
    poster: string,
    imdbID: string,
    movie: boolean
}

import { Link } from "react-router-dom"
const CardItem: React.FC<CardItemProps> = (props) => {

    const { title, year, poster, imdbID, movie } = props

    return (
        <Card className="flex-shrink-0 mx-2 basis-1/2 sm:basis-2/5 md:basis-1/5">
            <div className='flex flex-col items-start justify-start overflow-hidden'>

                <Link to={`/${!movie?'series':'movie'}/${imdbID}`}><img src={poster} alt='poster' className="object-cover overflow-hidden transition duration-500 transform rounded-t-md hover:scale-150" loading="lazy" /></Link>
                <div className="z-10 w-full bg-white">
                <Link to={`/${!movie?'series':'movie'}/${imdbID}`}><p className='px-3 text-xl font-bold text-black text-ellipsis'>{title}</p></Link>
                <p className='px-3 font-bold text-black text-gray-500 '>{year}</p>
                </div>

            </div>
        </Card>
    )
}

export default CardItem