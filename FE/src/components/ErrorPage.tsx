import React from 'react';

const ErrorPage = () => {

    return <div className="flex flex-col items-center w-full h-full">
        <img src={require('../assets/error.png')} alt="Error" />
        <p className="text-2xl text-gray-500">Something went wrong</p>
    </div>


}

export default ErrorPage