import { ContentSeparator, SkeletalPlaceholder } from "../common/CommonComponents";
import React from 'react';

const Placeholder = (props: { count: number }) => {

    const { count } = props
    return (
        <>
            {
                new Array(3).fill(0).map((_, i) => {
                    return (
                        <div
                            key={i}
                            className='absolute z-0 flex w-4/5 h-full mx-10 border-2 rounded-lg border-red'
                            style={{
                                transform: `translateX(${(i - count) * 100}%)`,
                            }}
                        >
                            <div
                                className='absolute w-4/5 h-full p-1 bg-gradient-to-r from-black to-transparent'>
                                <div className='flex'>
                                    <div className='flex flex-col p-6 md:w-4/5'>
                                        <div className='min-w-[80vw] md:w-full h-6 my-2 text-6xl font-bold bg-gray-600 animate-pulse'></div>
                                        <div className='hidden md:visible min-w-[80vw] md:w-full h-8 text-lg font-bold text-white bg-gray-600 animate-pulse'></div>

                                        <div className='flex flex-col justify-start mt-4 md:items-center md:flex-row'>
                                            <SkeletalPlaceholder height={4}/>
                                            <ContentSeparator/>
                                            <SkeletalPlaceholder height={4}/>
                                            <ContentSeparator/>
                                            <SkeletalPlaceholder height={4}/>
                                        </div>

                                        <div className='flex'>
                                            <SkeletalPlaceholder height={8}/>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}

export default Placeholder;
