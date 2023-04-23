import React from "react";


const Card: React.FC<React.PropsWithChildren&{className?:string}> = (props) => {
    return (
        <div className={`mx-2 my-1 bg-white border-gray-400 shadow-2xl ${props.className??''}`}>
        {props.children}
        </div>
    );
}

export default Card;