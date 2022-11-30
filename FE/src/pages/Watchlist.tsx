import Button from '../../UI/Button'
import React,{useEffect} from 'react'
import Card from '../../UI/Card'
import useFetch from '../hooks/useFetch'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom';
const Watchlist:React.FC = () => {


    const [currImdb, setCurrImdb] = React.useState<string>('')
    
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

    const { isLoading: watchlistRmLoading, error: watchListRmError, data: watchListRmData, mutate: watchlistMutate} = useFetch({
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': '*'
        },
        body: JSON.stringify({
            query: `
            mutation {
                removeFromWatchlist(imdbId:"${currImdb}",id:"${JSON.parse(localStorage.getItem('userId')!)}"){
                    imdbId
                    title
                }
            }
            `
            
                
        })
    }, 'mutate')

    useEffect(()=>{
        console.log("Call")
        if(!!currImdb) {
            watchlistMutate()
        }
    },[currImdb])
    return (
        <div>
            <p className='self-start p-3 text-5xl font-bold'>My Watchlist</p>

            {watchlistIsLoading && <p>Loading...</p>}

            {watchListError && <p>Error</p>}
            {watchListData && watchListData.data.watchlist.map((item:any) => {
                return (
                    <Card key={item.imdbId}>
                        <div className="flex flex-col my-2 md:flex-row">
                            <img src={item.poster} alt="poster" className="w-full p-1 rounded-r-none md:w-1/3 rounded-l-md"/>
                            <div className="flex flex-col p-2">
                                
                                    <p className="text-3xl font-bold">{item.title}</p>
                                    <p className="text-sm">{item.year}</p>
                                    <p className="text-md">{item.genre}</p>
                                    <p className="text-md">{item.runtime}</p>
                                
                                    <p className="text-sm">{item.plot}</p>

                                    <div className='flex h-full my-1 md:items-end'>
                                    
                                    <Link className='mx-1' to={`/${item['media']}/${item['imdbId']}`}>
                                    <Button>Watch</Button></Link>
                                    
                                    <Button onClick={()=>setCurrImdb(item.imdbId)}>
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
            
            })}
        </div>
    )
}

export default Watchlist