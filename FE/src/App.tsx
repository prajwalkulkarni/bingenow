import React, { Fragment, useContext } from "react"
import Landing from "./pages/Landing"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { QueryClientProvider, QueryClient } from "react-query"
import Home from "./pages/Home"
import Movie from "./pages/Movie"
import Context from "./context/Context"
import Watchlist from "./pages/Watchlist"
import Contact from "./pages/Contact"
import PrivacyPolicy from "./pages/PrivacyPolicy"
const queryClient = new QueryClient()
let routes;
const App: React.FC = () => {

    const ctx = useContext(Context)

    
    if(JSON.parse(localStorage.getItem('auth') as string) || ctx?.auth) {
        routes = (
            
            <Routes>
                <Route path="/" element={<Home movies={true} />} />
                <Route path="/:mediaType/:imdbID/" element={<Movie/>} />
                <Route path="/mywatchlist" element={<Watchlist/>} />
                <Route path='/contact' element={<Contact/>} />
            <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
                <Route path="*" element={<Navigate to='/' replace/>} />
                <Route path='/shows' element={<Home movies={false} />} />
            </Routes>
        
        )
    }
     else {
        routes = (
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path='/contact' element={<Contact/>} />
            <Route path="/privacypolicy" element={<PrivacyPolicy/>} />
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
                    <Footer />
                </BrowserRouter>
            </QueryClientProvider>
        </Fragment>
    )
}

export default App