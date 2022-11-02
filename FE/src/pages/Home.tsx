import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase'
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Button from '../../UI/Button';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';

const db = getFirestore(app);

const CardListLazy = React.lazy(() => import('../components/CardList'));
const Home: React.FC = () => {

    const { data: carouselData, isLoading, isError } = useQuery('carousel', async () => {
        const querySnapshot = await getDocs(collection(db, 'home'));
        const data = querySnapshot.docs.map((doc) => doc.data());

        return data;
    })

    const [count, setCount] = useState(0)

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCount(p => (p + 1) % 5)
    //     }, 5000);
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div className='flex flex-col'>
            <section>

                <div

                    className='flex relative overflow-hidden flex-col justify-center min-h-[80vh]'
                >
                    <div className='z-10 flex justify-between px-2'>
                        <button className='text-white' onClick={() => setCount(p => p === 0 ? (p + 4) % 5 : (p - 1) % 5)}><ArrowBackIosIcon /></button>
                        <button className='text-white' onClick={() => setCount(p => (p + 1) % 5)}><ArrowForwardIosIcon /></button>
                    </div>

                    <AnimatePresence>
                        <motion.div
                            key={count}
                            className='absolute w-full h-full'
                            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${carouselData ? carouselData[Math.abs(count)]['Poster'] : require('../assets/cover/cover.jpg')})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 1,

                                transition: {
                                    duration: 0.8,

                                }
                            }}
                            exit={{

                                opacity: 0,
                            }}>
                            <div
                                className='absolute w-full h-full p-1 bg-gradient-to-r from-black to-transparent'>
                                <div className='flex'>
                                    <div className='flex flex-col p-6 md:w-1/2'>
                                        {carouselData ? <p className='text-6xl font-bold text-white'>{carouselData[Math.abs(count)]['Title']}</p> : <div className='min-w-[80vw] md:w-full h-6 m-2 text-6xl font-bold bg-gray-600 animate-pulse'></div>}
                                        {carouselData ? <p className='p-1 text-lg text-white'>{carouselData[Math.abs(count)]['Plot']}</p> : <div className='min-w-[80vw] md:w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}

                                        <div className='flex flex-row items-center justify-start mt-4'>
                                            {carouselData ? <p className='px-1 text-lg font-semibold text-white'>Genre: {carouselData[Math.abs(count)]['Genre']}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                            <p className='px-1 text-lg font-semibold text-white'>|</p>
                                            {carouselData ? <p className='px-1 text-lg font-semibold text-white'>Year: {carouselData[Math.abs(count)]['Year']}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                            <p className='px-1 text-lg font-semibold text-white'>|</p>
                                            {carouselData ? <p className='px-1 text-lg font-semibold text-white'>Runtime: {carouselData[Math.abs(count)]['Runtime']}</p> : <div className='w-full h-4 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>}
                                        </div>

                                        <Button
                                        ><PlayCircleOutlineIcon />Watch</Button>

                                    </div>

                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                </div>

            </section>

            <div className='flex flex-col p-2'>
                <p className='py-3 text-5xl font-bold'>Action & Drama</p>
                {isLoading ? <div className='flex justify-center'><CircularProgress /></div> : <CardListLazy category='action' />}
            </div>

            <div className='flex flex-col p-2'>
                <p className='py-3 text-5xl font-bold'>Popular animated films</p>
                {isLoading ? <div className='flex justify-center'><CircularProgress /></div> : <CardListLazy category='animated' />}
            </div>

            <div className='flex flex-col p-2'>
                <p className='py-3 text-5xl font-bold'>Watch with friends</p>
                {isLoading ? <div className='flex justify-center'><CircularProgress /></div> : <CardListLazy category='friends' />}
            </div>


        </div>
    );
}

export default Home;