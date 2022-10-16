import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../firebase'
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const db = getFirestore(app);
const Home: React.FC = () => {

    const { data, isLoading, isError } = useQuery('carousel', async () => {
        const querySnapshot = await getDocs(collection(db, 'home'));
        const data = querySnapshot.docs.map((doc) => doc.data());

        return data;
    })

    const [count, setCount] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(p => (p + 1) % 5)
        }, 5000);
        return () => clearInterval(interval);
    }, []);

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
                    style={{ backgroundImage: `url(${require(`../assets/cover/${Math.abs(count)}.jpg`)})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}
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
                                <div className='flex flex-col w-1/2 p-6'>
                                    <p className='text-6xl font-bold text-white'>{data ? data[Math.abs(count)]['Title'] : ''}</p>
                                    <p className='px-1 text-lg text-white'>{data ? data[Math.abs(count)]['Plot'] : ''}</p>

                                    <div className='flex flex-row items-center justify-start mt-4'>
                                        <p className='px-1 text-lg font-semibold text-white'>Genre: {data ? data[Math.abs(count)]['Genre'] : ''}</p>
                                        <p className='px-1 text-lg font-semibold text-white'>|</p>
                                        <p className='px-1 text-lg font-semibold text-white'>Year: {data ? data[Math.abs(count)]['Year'] : ''}</p>
                                        <p className='px-1 text-lg font-semibold text-white'>|</p>
                                        <p className='px-1 text-lg font-semibold text-white'><AccessTimeIcon/> {data ? data[Math.abs(count)]['Runtime'] : ''}</p>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </motion.div>
                    </AnimatePresence>

                </div>

            </section>

            <div className='flex flex-col p-2'>
                <p className='text-2xl bold'>Top IMDB rated movies</p>
                <div className='flex'>

                </div>
            </div>

            <div className='flex flex-col p-2'>
                <p className='text-2xl bold'>Top IMDB rated TV shows</p>
                <div className='flex'>

                </div>
            </div>
        </div>
    );
}

export default Home;