import React from 'react';

export const ContentSeparator = () => {
    return (<p className='hidden text-lg font-semibold text-white lg:flex sm:px-1 md:px-1'>|</p>)
}

export const SkeletalPlaceholder = (props:{height: number}) => (<div className={`w-full h-${props.height} text-lg font-bold text-white bg-gray-600 animate-pulse`}></div>)
