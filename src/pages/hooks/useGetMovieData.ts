import { GENRE } from "../../utils/GENRE";
import useFetch from "../../hooks/useFetch";
import { useContext } from "react";
import { SeasonsContext } from "../../context/Context";

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

  const { seasonsCount } = useContext(SeasonsContext);

  const isIMDBIDTMDBID = window.location.pathname.split("/")[2].includes("tt")
    ? false
    : true;
  const MEDIA = mediaType === "movie" ? "movie" : "tv";
  const TARGET_QUERY = isIMDBIDTMDBID
    ? MEDIA === "tv"
      ? `query {
           getmediadata(media_type: "${MEDIA}", imdbId: "${imdbID}"){
               backdrop_path
               genres
               season_number
               show_id
               first_air_date
               number_of_seasons
               genres{
                id
                name
               }
               original_names
               overview
               poster_path
               seasons{
                 air_date
                 episode_count
                 id
                 name
                 overview
                 poster_path
                 season_number
                 vote_average
               }
           }
        }`
      : `getmediadata(media_type: "${MEDIA}", imdbId: "${imdbID}"){
               backdrop_path
               title
               genres{
                id
                name
               }
                release_date
                vote_average
           }`
    : `query {
           findMovieOrTV(imdbId:"${imdbID}"){
             movie_results{
               poster_path
               backdrop_path
               id
               title
               release_date
               overview
               genre_ids
               vote_average
             }
               tv_results{
               backdrop_path
               id
               name
               first_air_date
               overview
               vote_average
               genre_ids
              

               }
           }
        }`;
  const {
    data: mediaData,
    isLoading,
    error,
  } = useFetch(
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*",
      },
      body: JSON.stringify({
        query: TARGET_QUERY,
      }),
    },
    "query",
    [QUERY_KEY]
  );

  let backdrop_path, media_details_json;
  let data: MediaDetailsType | undefined = undefined;

  if (isIMDBIDTMDBID) {
    media_details_json = mediaData?.data?.getmediadata;
  } else {
    media_details_json = mediaData?.data?.findMovieOrTV;
  }

  if (media_details_json) {
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
        ...(mediaType === "series" && {
          seasons: media_details_json["number_of_seasons"],
        }),
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
          ...(MEDIA === "tv" && {
            seasons: seasonsCount || 1,
          }),
        };
      }
    }
  }

  // const tmdbId = data?.tmdbID || 0;

  // if (mediaType === "series") {
  //   const seasons = await (
  //     await fetch(
  //       `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/${tmdbId}`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     )
  //   ).json();
  //   const {} = useFetch({
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Accept: "*",
  //     },
  //     body: JSON.stringify({
  //       query: `query{
  //       getseasondetails()
  //       }`,
  //     }),
  //   },"query",[QUERY_KEY+tmdbId])
  //   const seasons_count = seasons["number_of_seasons"];
  //   data!.seasons = seasons_count;
  // }

  return {
    data,
    error,
    loading: isLoading,
  };
};
