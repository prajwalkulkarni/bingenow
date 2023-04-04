import useFetch from "../../hooks/useFetch"
import { CarouselType } from "../Home";

export const useAddtoWatchlist = (media_data: CarouselType) => {


    const { isLoading, error, data, mutate } = useFetch({
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
    }, 'mutate');

    return { isLoading, error, data, mutate }
}