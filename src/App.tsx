import React, { Fragment, lazy, Suspense, useContext, useEffect } from "react"
import Landing from "./pages/Landing"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { QueryClientProvider, QueryClient } from "react-query"
import Context from "./context/Context"
import ErrorBoundary from "./components/ErrorBoundary"
import Loader from "../UI/Loader"

const Home = lazy(() => import("./pages/Home"));
const Movie = lazy(() => import("./pages/Movie"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

const queryClient = new QueryClient()
let routes;
const App: React.FC = () => {

    const ctx = useContext(Context)

    useEffect(()=>{
        const handleContextmenu = (e:Event) => {
            e.preventDefault()
        }
        document.addEventListener('contextmenu', handleContextmenu)
        return () => {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
    },[])

    if (JSON.parse(localStorage.getItem('auth') as string) || ctx?.auth) {
        routes = (

            <Routes>
                <Route path="/" element={<ErrorBoundary key="home"><Home movies={true} /></ErrorBoundary>} />
                <Route path="/:mediaType/:imdbID/" element={<ErrorBoundary key="media"><Movie /></ErrorBoundary>} />
                <Route path="/mywatchlist" element={<ErrorBoundary key="watchlist"><Watchlist /></ErrorBoundary>} />
                <Route path='/contact' element={<ErrorBoundary key="contact"><Contact /></ErrorBoundary>} />
                <Route path="/privacypolicy" element={<ErrorBoundary key="privacy"><PrivacyPolicy /></ErrorBoundary>} />
                <Route path="*" element={<Navigate to='/' replace />} />
                <Route path='/shows' element={<ErrorBoundary key="shows"><Home movies={false} /></ErrorBoundary>} />
            </Routes>

        )
    }
    else {
        routes = (
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path='/contact' element={<Contact />} />
                <Route path="/privacypolicy" element={<PrivacyPolicy />} />
                <Route path="*" element={<Navigate to='/' replace />} />
            </Routes>
        )
    }

    return (
        <Fragment>
            <QueryClientProvider client={queryClient}>

                <BrowserRouter>
                    <Header />
                    <Suspense fallback={<Loader text="Loading..." />}>
                        {routes}
                    </Suspense>
                    <Footer />
                </BrowserRouter>

            </QueryClientProvider>
        </Fragment>
    )
}

export default App