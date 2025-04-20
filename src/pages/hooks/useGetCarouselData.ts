import useFetch from "../../hooks/useFetch";

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
  const key = movies ? "carousel" : "carouselshows";

  const query = getQuery(movies);
  const { isLoading, error, data } = useFetch(
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*",
      },
      body: JSON.stringify({
        query,
      }),
    },
    "query",
    [key]
  );

  return {
    carouselData: data?.data,
    loading: isLoading,
    error: error,
  };
};

const getQuery = (movies: boolean) => {
  return movies
    ? `query {
        latestpopularmovies{
            page
            results{     
              backdrop_path
              genre_ids
              id
              original_language
              original_title
              overview
              popularity
              poster_path
              release_date
              title
              vote_average
              vote_count
            }

        }
    }`
    : `query {
        trendingtvshows{
            page
            results{     
              backdrop_path
              genre_ids
              id
              original_language
              original_name
              overview
              popularity
              poster_path
              first_air_date
              name
              vote_average
              vote_count

            }

        }
    }`;
};
