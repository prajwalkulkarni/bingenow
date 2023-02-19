import { useMutation, useQuery } from "react-query"

const useFetch = (options: RequestInit = {}, queryType:string) => {

    
    async function submitHandler() {
        const res = await fetch('http://localhost:3000/graphql', options)
        return res.json()
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