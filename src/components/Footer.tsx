import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {

    return (
        <footer className="flex flex-col w-full mt-12 bg-gray-100">
            <div className='flex flex-col justify-between w-full p-2 md:items-center md:flex-row'>
                <div className='flex justify-center w-full md:w-fit'>
                    <img src={require('../assets/bingenow-square.png')} alt="Bingenow" style={{ objectFit: 'contain' }} width="200" />
                </div>

                <div className="flex flex-col m-2">
                    <h3 className="text-xl font-bold">Bingenow</h3>
                    <Link to='/contact' className="text-gray-500 underline">Contact</Link>
                    <Link to="/privacypolicy" className="text-gray-500 underline">Privacy Policy</Link>
                    <a target="_blank" href="https://github.com/prajwalkulkarni/bingenow/blob/main/CONTRIBUTING.md" className="text-gray-500 underline">Contribute</a>
                </div>


                <p className='w-full m-2 md:w-1/2'>Bingenow is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.
                    You can watch as much as you want, whenever you want without a single commercial – all for absolutely free.
                    There's always something new to discover.</p>
            </div>

            <div className='flex flex-col'>
                <hr />
                <p className="flex items-center justify-center p-2 text-gray-500">Made with <span className="text-red-500">❤</span> by &nbsp;<a href="https://prajwalkulkarni.github.io">Prajwal</a></p>
            </div>
        </footer>
    )
}

export default Footer