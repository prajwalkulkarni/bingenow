import { useQuery } from "react-query";
import { getLatestAuthToken } from "../../utils/manageToken";

export const useGetEpisodeData = ({
  title,
  season,
  tmdbID,
}: {
  title?: string;
  season: number;
  tmdbID: string;
}) => {
  const queryKey = tmdbID ? "title_season:" + title + season : "";
  const { data, status, error } = useQuery(queryKey, async () => {
    const token = await getLatestAuthToken();
    const episodes = await fetch(
      `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/${tmdbID}/season/${season}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    const season_episodes = await episodes.json();
    const episodes_json = season_episodes["season/" + season];
    return episodes_json["episodes"];
  });

  return {
    data,
    loading: status === "loading",
    error,
  };
};
