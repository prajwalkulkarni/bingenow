import React from 'react'


type ButtonProps = {
    children: React.ReactNode,
    onClick?: () => void,
    disabled?: boolean,
    className?: string,
    type?: 'button' | 'submit' | 'reset' | undefined
}
const Button: React.FC<ButtonProps> = ({ children, ...props }) => {

    const {className:class_name, ...restProps} = props
    return (
        <button
        {...restProps}
        className={`flex rounded-md z-10 items-center px-4 py-2 font-bold flex justify-center p-2 text-white rounded-md bg-violet-800 hover:bg-violet-900 ${class_name??''}`}
        >
        {children}
        </button>
    );
}

export default Button
