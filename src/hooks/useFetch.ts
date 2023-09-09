import { useMutation, useQuery } from "react-query";
import { getLatestAuthToken } from "../utils/manageToken";

const useFetch = (
  options: RequestInit = {},
  queryType: string,
  queryKey: string[]
) => {
  async function submitHandler() {
    const token = await getLatestAuthToken();
    const res = await fetch(`${process.env.REACT_APP_BACKEND_API}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Bearer " + token,
      },
    });
    return res.json();
  }

  if (queryType === "query") {
    const { data, isLoading, error } = useQuery([...queryKey], submitHandler);
    return { isLoading, error, data };
  } else {
    const { isLoading, error, data, mutate } = useMutation(submitHandler);
    return { isLoading, error, data, mutate };
  }
};

export default useFetch;
