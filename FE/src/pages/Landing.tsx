import React from 'react'
import Typed from 'react-typed'
import { motion } from 'framer-motion'

const Landing: React.FC = () => {

    return (
        <main>
            <section>
                <div className='flex flex-col items-center justify-center h-screen'>

                    <p className='font-bold text-7xl'>Bingenow</p>

                    <p className='py-4 text-3xl font-semibold'>Stream great <Typed
                        strings={[
                            "Movies",
                            "TV shows",
                            "Web series",
                        ]}
                        typeSpeed={50}
                        backSpeed={100}
                        loop
                    /></p>
                    <p className='text-3xl font-semibold'>All at one place</p>

                </div>

            </section>
            <section>
                <div className='grid grid-cols-1 p-3 md:grid-cols-2'>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                    // transition={{ duration: 0.5 }}
                    // variants={{
                    //     visible: { opacity: 1, scale: 1 },
                    //     hidden: { opacity: 0, scale: 0 }
                    //   }}


                    >
                        <motion.div
                            variants={{
                                visible: {
                                    x: 0,
                                    transition: {
                                        duration: 0.5
                                    }
                                },
                                hidden: { x: -500 }
                            }}>
                            <p className='text-2xl font-semibold'>No limit. No cost</p>
                            <p className='text-xl'>Watch unlimited movies, TV shows & web series for FREE.</p>
                        </motion.div>
                    </motion.div>

                    <div className='visuals'>

                    </div>
                </div>
                {/* <p>Bingenow is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!</p> */}

            </section>
            <section>
                <div className='grid grid-cols-1 p-3 md:grid-cols-2'>


                    <div className='visuals'>
                        <p>Lorem ipsum dumb text</p>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        variants={{
                            hidden:{
                                overflow: 'hidden',
                            }
                        }}
                    >
                        <motion.div
                            variants={{
                                visible: {
                                    x: 0,
                                    transition: {
                                        duration: 0.5,
                                    }
                                },
                                
                                hidden: { x: 500}
                            }}>

                            <p className='text-2xl font-semibold'>Anytime. Anywhere</p>
                            <p className='text-xl'>Access and watch your favorite shows and movies, by creating a FREE account.</p>
                        </motion.div>
                    </motion.div>
                </div>
                {/* <p>Bingenow is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!</p> */}

            </section>

            <section>


                <motion.div className='flex flex-col items-center'
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
                variants={{
                    visible: { opacity: 1, scale: 1 },
                    hidden: { opacity: 0, scale: 0 }
                }}>
                    <p className='text-2xl font-semibold'>Watch on Any Device</p>
                    <p className='text-xl'>Bingenow works well on all sizes of devices. Enjoy your content on both large displays and small devices, such as smartphones.</p>

                </motion.div>

            </section>
        </main>
    )
}

export default Landing