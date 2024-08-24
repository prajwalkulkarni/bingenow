import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Episode from "./Episode";
import { useGetEpisodeData } from "../pages/hooks/useGetEpisodeData";

type EpisodeType = {
  air_date: string;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string;
};

const Seasons = React.forwardRef<
  HTMLDivElement,
  {
    title: string | undefined;
    imdbID: string;
    season: number;
    tmdbID: string | undefined;
  }
>((props, ref) => {
  const { title, imdbID, season, tmdbID } = props;

  const { data, loading, error } = useGetEpisodeData({
    title,
    season,
    tmdbID: tmdbID!,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center w-full h-full">
        <img src={require("../assets/error.png")} alt="Error" />
        <p className="text-2xl text-gray-500">Something went wrong</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full" ref={ref}>
        <div className="flex justify-center py-2">
          <CircularProgress color="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-white/10 rounded-lg pt-2 pb-3">
      <div
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2"
        ref={ref}
      >
        {data?.map((episode: EpisodeType) => {
          return (
            <Episode
              key={episode.episode_number}
              image={episode.still_path}
              episode={episode.episode_number}
              name={episode.name}
              overview={episode.overview}
              air_date={episode.air_date}
              imdbID={imdbID}
              season={season}
            />
          );
        })}
      </div>
    </div>
  );
});

export default Seasons;
