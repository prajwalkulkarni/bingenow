import React from "react";


const Feature: React.FC<React.PropsWithChildren & {image:string}> = (props) => {

    const {children,image} = props
    
    if(!image.includes('tmdb')){
        return (
        <div className="relative w-full h-screen"
        style={{backgroundImage:`url(${require(`../assets/cover/${image}.jpg`)})`,backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>

            <div className="absolute w-full h-full bg-gradient-to-r from-black to-transparent">
                {children}
            </div>
        </div>
    )
    }
    else{
        return (
            <div className="relative w-full h-screen"
            style={{backgroundImage:`url(${image})`,backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
    
                <div className="absolute w-full h-full bg-gradient-to-r from-black to-transparent">
                    {children}
                </div>
            </div>
        )
    }
    

}

export default Feature;