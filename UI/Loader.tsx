import { CircularProgress } from "@mui/material";
import React from "react"

const Loader = ({ text = "" }: { text: string }) => {
    return (
        <div className='flex-col items-center justify-center h-full'><CircularProgress color='primary' />
            <div>{text}</div>
        </div>
    )
}

export default Loader;