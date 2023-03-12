import { CircularProgress } from "@mui/material";
import React from "react"

const Loader = ({ text = "" }: { text: string }) => {
    return (
        <div className='flex flex-col items-center justify-center w-full h-full p-3'><CircularProgress color='primary' />
            <div>{text}</div>
        </div>
    )
}

export default Loader;