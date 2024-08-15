import { useQuery } from "react-query";
import { getLatestAuthToken } from "../../utils/manageToken";

export interface CarouselMovies {
  imdbId?: string;

  id: string;
  backdrop_path: string;
  overview: string;
  poster_path: string;
  release_date: Date;
  title: string;
  vote_average: number;
  vote_count: number;
  first_air_date: Date;
}

export interface CarouselSeries {
  imdbId?: string;

  id: string;
  backdrop_path: string;
  overview: string;

  name: string;
  vote_average: number;
  vote_count: number;
  first_air_date: Date;
}

interface CarouselResponse {
  page: number;
  results: CarouselMovies[] | CarouselSeries[];
  total_pages: number;
  total_results: number;
}

export const useGetCarouselData = ({ movies }: { movies: boolean }) => {
  const {
    data: carouselData,
    isLoading,
    isError,
  } = useQuery(movies ? "carousel" : "carouselshows", async () => {
    const TARGET_ENDPOINT = movies
      ? `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/latestpopularmovies`
      : `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/trendingtvshows`;

    const token = await getLatestAuthToken();
    const latestdata = await fetch(TARGET_ENDPOINT, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const jsonData: CarouselResponse = await latestdata.json();

    return jsonData.results.slice(0, 5);
  });

  return {
    carouselData,
    loading: isLoading,
    error: isError,
  };
};
