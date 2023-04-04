import useFetch from "../../hooks/useFetch"

export const useRemoveFromWatchlist = (imdbId: string) => {

    
    const { isLoading, error, data, mutate } = useFetch({
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
    }, 'mutate');

    return { isLoading, error, data, mutate }

}