import React,{useEffect} from 'react'
import useFetch from '../hooks/useFetch'
import CircularProgress from '@mui/material/CircularProgress';
import Watchlistitem from '../components/Watchlistitem'

const Watchlist:React.FC = () => {

    const [watchlist, setWatchlist] = React.useState<any>([])
    
    const { isLoading: watchlistIsLoading, error: watchListError, data: watchListData} = useFetch({
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
    }, 'query')

    useEffect(() => {
        if(!!watchListData){
            console.log(watchListData)
            setWatchlist(watchListData.data.watchlist??[])
        }

       
        
    }, [watchListData])


    const rerender = (imdbId:string) => {
        const watchlistArr = watchlist.filter((item:any) => item.imdbId !== imdbId)
        setWatchlist(watchlistArr)
    }

       
    return (
        <div>
                   
            <p className='self-start p-3 text-5xl font-bold'>My Watchlist</p>
            
            {watchlistIsLoading && <div className='flex justify-center h-full'><CircularProgress color='primary'/></div>}
            {watchListError && <p>Error</p>}
            {watchListData && watchlist?.map((item:any) => {
                return (
                    <Watchlistitem
                        key={item.imdbId}
                        imdbId={item.imdbId}
                        title={item.title}
                        poster={item.poster}
                        plot={item.plot}
                        runtime={item.runtime}
                        year={item.year}
                        rerenderer={rerender}
                        genre={item.genre}
                        media={item.media}
                        />
                )
            })}
        </div>
    )
}

export default Watchlist