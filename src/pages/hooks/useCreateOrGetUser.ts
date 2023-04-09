import useFetch from "../../hooks/useFetch"

export const useCreateOrGetUser = (email: string) => {
    const {error, data, mutate, isLoading} = useFetch({
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'*'
        },
        body: JSON.stringify({
            query: `
            mutation {
                createOrGetUser(email:"${email}"){
                    id
                    email
                }
            }
            `
        })
    },'mutate');

    return {error, data, mutate, isLoading}
}