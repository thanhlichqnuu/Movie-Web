import useSWRV from 'swrv';
import axios from 'axios';

const fetcher = (url) => axios.get(url).then(res => res.data);

export const useFetchMovies = (apiKey, apiUrls) => {
  const { data, error } = useSWRV(apiUrls[apiKey], fetcher);

  return {
    movies: data,
    isLoading: !error && !data,
    isError: error
  };
};
