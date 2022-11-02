import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getDocs, collection, getFirestore } from 'firebase/firestore'
import { app } from '../firebase'
import CardItem from './CardItem'
const db = getFirestore(app)

type CardListType = {
    Title: string,
    Year: string,
    Runtime: string,
    Poster: string,
    imdbID: string,
}


const CardList: React.FC<{ category: string }> = (props) => {

    const { data, isLoading, isError } = useQuery(props.category, async () => {
        const querySnapshot = await getDocs(collection(db, props.category));
        const data = querySnapshot.docs.map((doc) => doc.data());

        return data;
    })

    
    return (
        <div className='flex flex-no-wrap w-full overflow-x-scroll no-scrollbar'>
            {data?.map((item: any) => {
                
              
                return (
                    
                        <CardItem key={item['imdbID']}  title={item['Title']} year={item['Year']} runtime={item['Runtime']} poster={item['Poster']} imdbID={item['imdbID']} />
                )
            })}

        </div>
    )
}

export default CardList