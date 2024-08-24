import { useQuery } from "react-query";
import { getLatestAuthToken } from "../../utils/manageToken";
import { GENRE } from "../../utils/GENRE";

type MediaDetailsType = {
  title: string;
  year: string;
  // rated: string;
  // runtime: string;
  genre: string;
  // director: string;
  backdrop: string;
  plot: string;
  imdbRating: string;
  // actors: string;
  seasons?: number;
  tmdbID: string;
};

export const useGetMovieData = ({
  imdbID,
  mediaType,
}: {
  imdbID: string;
  mediaType?: string;
}) => {
  const QUERY_KEY = "media_data:" + imdbID!;
  const { data, error, isLoading } = useQuery(
    QUERY_KEY,
    async () => {
      const token = await getLatestAuthToken();
      const isIMDBIDTMDBID = window.location.pathname
        .split("/")[2]
        .includes("tt")
        ? false
        : true;

      const MEDIA = mediaType === "movie" ? "movie" : "tv";
      const TARGET_ENDPOINT = isIMDBIDTMDBID
        ? `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/3/${MEDIA}/${imdbID}`
        : `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/find/${imdbID}`;
      const media_details = await fetch(TARGET_ENDPOINT, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const media_details_json = await media_details.json();

      let backdrop_path;
      let data: MediaDetailsType | undefined = undefined;

      if (isIMDBIDTMDBID) {
        backdrop_path = media_details_json["backdrop_path"];
        data = {
          title:
            mediaType === "movie"
              ? media_details_json["title"]
              : media_details_json["name"],
          year:
            mediaType === "movie"
              ? media_details_json["release_date"]
              : media_details_json["first_air_date"],
          backdrop: backdrop_path,
          plot: media_details_json["overview"],
          imdbRating: media_details_json["vote_average"],
          tmdbID: imdbID,
          genre: media_details_json["genres"]
            .map((genre: { name: string; id: number }) => genre.name)
            .join(", "),
        };
      } else {
        backdrop_path =
          mediaType === "movie"
            ? media_details_json["movie_results"][0]["backdrop_path"] ||
              media_details_json["movie_results"][0]["poster_path"]
            : media_details_json["tv_results"][0]["backdrop_path"];

        if (mediaType === "movie") {
          const movie = media_details_json["movie_results"][0];
          data = {
            tmdbID: movie.id,
            backdrop: backdrop_path,
            title: movie.title,
            year: movie["release_date"],
            plot: movie.overview,
            imdbRating: movie["vote_average"],
            genre: movie["genre_ids"]
              .map(
                (id: number) =>
                  GENRE.movie.find((genre_id) => genre_id.id === id)?.genre
              )
              .join(", "),
          };
        } else {
          const tv = media_details_json["tv_results"][0];
          data = {
            tmdbID: tv.id,
            backdrop: backdrop_path,
            title: tv.name,
            year: tv["first_air_date"],
            plot: tv.overview,
            imdbRating: tv["vote_average"],
            genre: tv["genre_ids"]
              .map(
                (id: number) =>
                  GENRE.tv.find((genre_id) => genre_id.id === id)?.genre
              )
              .join(", "),
          };
        }
      }
      const tmdbId = data?.tmdbID || 0;

      // const media_details = await fetch(
      //   `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/omdb/media/${imdbID}`,
      //   {
      //     headers: {
      //       Authorization: "Bearer " + token,
      //     },
      //   }
      // );

      // const media_details_json = await media_details.json();

      if (mediaType === "series") {
        const seasons = await (
          await fetch(
            `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/${tmdbId}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          )
        ).json();
        const seasons_count = seasons["number_of_seasons"];
        data!.seasons = seasons_count;
        return data;
      } else {
        return data;
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return {
    data,
    error,
    loading: isLoading,
  };
};
