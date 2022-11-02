import React, { Fragment } from "react"
import Landing from "./pages/Landing"
import Header from "./components/Header"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { QueryClientProvider, QueryClient } from "react-query"
import Home from "./pages/Home"
import Movie from "./pages/Movie"

const queryClient = new QueryClient()
const App: React.FC = () => {
    
    return (
        <Fragment>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Header />




                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/home" element={<Home />} />
                        <Route path='/:mediaType/:imdbID' element={<Movie/>} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </Fragment>
    )
}

export default App