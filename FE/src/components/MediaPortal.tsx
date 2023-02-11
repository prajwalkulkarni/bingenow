import React from "react";


const MediaPortal: React.FC<{mediaType:string,imdbID:string,episode?:number,season?:number,onClick:React.MouseEventHandler<HTMLDivElement>}> = (props) => {

    const {mediaType,imdbID} = props
    
    return (
        <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-screen h-screen bg-black">
               <div className="fixed top-0 font-bold text-white right-5 hover:cursor-pointer" onClick={props.onClick}>X</div>

                <div className="z-20 w-full bg-black h-1/4 md:w-4/5 md:h-3/4" >
                <iframe
                src={`${process.env.REACT_APP_PLAYER_URL}/${mediaType==='series'?'tv':'movie'}?id=${imdbID}${mediaType==='series'?'&s='+props.season+'&e='+props.episode:''}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                
                width={'100%'}
                height={'100%'}
                title="Embedded youtube"
                className="w-full h-full"
                />
                </div>
            
        </div>
    )
}

export default MediaPortal