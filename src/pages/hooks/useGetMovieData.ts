import { useQuery } from "react-query";
import { getLatestAuthToken } from "../../utils/manageToken";

type MediaDetailsType = {
  title: string;
  year: string;
  rated: string;
  runtime: string;
  genre: string;
  director: string;
  backdrop: string;
  plot: string;
  imdbRating: string;
  actors: string;
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
  const { data, error, isLoading } = useQuery([imdbID!], async () => {
    const token = await getLatestAuthToken();
    const backdrop = await fetch(
      `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/find/${imdbID}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const backdrop_json = await backdrop.json();

    const backdrop_path =
      mediaType === "movie"
        ? backdrop_json["movie_results"][0]["backdrop_path"] ||
          backdrop_json["movie_results"][0]["poster_path"]
        : backdrop_json["tv_results"][0]["backdrop_path"];
    const tmdbId =
      mediaType === "movie"
        ? backdrop_json["movie_results"][0]["id"]
        : backdrop_json["tv_results"][0]["id"];

    const media_details = await fetch(
      `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/omdb/media/${imdbID}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const media_details_json = await media_details.json();

    const data: MediaDetailsType = {
      title: media_details_json["Title"],
      year: media_details_json["Year"],
      rated: media_details_json["Rated"],
      runtime: media_details_json["Runtime"],
      genre: media_details_json["Genre"],
      director: media_details_json["Director"],
      backdrop: backdrop_path,
      plot: media_details_json["Plot"],
      imdbRating: media_details_json["imdbRating"],
      actors: media_details_json["Actors"],
      tmdbID: tmdbId,
    };
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
      data.seasons = seasons_count;
      return data;
    } else {
      return data;
    }
  });

  return {
    data,
    error,
    loading: isLoading,
  };
};
