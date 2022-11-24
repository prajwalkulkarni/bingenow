import React from "react";


const MediaPortal: React.FC<{mediaType:string,imdbID:string,episode?:number,season?:number,onClick:React.MouseEventHandler<HTMLDivElement>}> = (props) => {

    const {mediaType,imdbID} = props
    
    return (
        <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-screen h-screen bg-black" onClick={props.onClick}>
            

                <div className="z-20 w-full bg-black h-3/4 md:w-1/2 md:h-1/2" >
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