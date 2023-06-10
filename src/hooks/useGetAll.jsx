import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useGetAll = (args) => {
  const { url, name, onSuccess, onError, params } = args;

  const getAll = async ({ queryKey }) => {
    const { url, params } = queryKey[1];
    let response = await axios(url, params);
    return response.data;
  };

  return useQuery({
    queryKey: [name, { url, params }],
    queryFn: getAll,
    onSuccess,
    onError,
  });
};

export default useGetAll;
