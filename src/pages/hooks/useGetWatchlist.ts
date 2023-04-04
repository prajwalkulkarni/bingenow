import useFetch from "../../hooks/useFetch";

export const useGetWatchlist = () => {
    const { isLoading, error, data} = useFetch({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
        },
        body: JSON.stringify({
            query: `
            query {
                watchlist(id:"${JSON.parse(localStorage.getItem('userId')!)}"){
                    imdbId
                    title
                    poster
                    plot
                    runtime
                    year
                    genre
                    media

                }
            }
            `            
        })
    }, 'query');

    return { isLoading, error, data }

}