
import React from 'react';
interface Props {
    children?: React.ReactNode;
    key?: string;
}
interface State {
    hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {


    constructor(props:Props){
        super(props);
        this.state = {
            hasError: false,
        }
    }


    static getDerivedStateFromError(){
        return { hasError: true }
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log("Error:", errorInfo)
    }

    render() {

        if(this.state.hasError){
            return <div className="flex flex-col items-center w-full h-full">
            <img src={require('../assets/error.png')} alt="Error" />
            <p className="text-2xl text-gray-500">Something went wrong</p>
            </div>
        }

        return this.props.children     
    
    }
}