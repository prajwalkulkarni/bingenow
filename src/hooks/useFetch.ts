import { useMutation, useQuery } from "react-query"

const useFetch = (options: RequestInit = {}, queryType:string) => {

    
    async function submitHandler() {
        if(process.env.REACT_APP_ENV==='production'){
            const res = await fetch('https://graphql-apollo-server.herokuapp.com/graphql', options)
            return res.json()
        }
        else{
            const res = await fetch(`${process.env.REACT_APP_BACKEND_DOMAIN}/graphql`, options)
        return res.json()
        }
        
    }

    if(queryType==='query'){
        const { data, isLoading, error } = useQuery('fetch', submitHandler)
        return { isLoading, error, data }
    }
    else{
        
        const { isLoading, error, data, mutate } = useMutation(submitHandler)
        return { isLoading, error, data, mutate }
    }
    
}

export default useFetch