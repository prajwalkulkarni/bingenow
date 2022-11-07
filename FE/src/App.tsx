import React, { Fragment, useContext } from "react"
import Landing from "./pages/Landing"
import Header from "./components/Header"
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { QueryClientProvider, QueryClient } from "react-query"
import Home from "./pages/Home"
import Movie from "./pages/Movie"
import Context from "./context/Context"
const queryClient = new QueryClient()
let routes;
const App: React.FC = () => {

    const ctx = useContext(Context)

    if(JSON.parse(localStorage.getItem('auth') as string) || ctx.auth) {
        routes = (
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:mediaType/:imdbID/" element={<Movie/>} />
                <Route path="*" element={<Navigate to='/' replace/>} />
            </Routes>
        
        )
    }
     else {
        routes = (
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to='/' replace/>} />
            </Routes>
        )
    }
    
    return (
        <Fragment>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Header />
                    {routes}
                </BrowserRouter>
            </QueryClientProvider>
        </Fragment>
    )
}

export default App