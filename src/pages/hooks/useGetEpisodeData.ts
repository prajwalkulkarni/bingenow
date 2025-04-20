import { useContext } from "react";
import useFetch from "../../hooks/useFetch";
import Context, { SeasonsContext } from "../../context/Context";

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
  // const { data, status, error } = useQuery(
  //   queryKey,
  //   async () => {
  //     const token = await getLatestAuthToken();
  //     const episodes = await fetch(
  //       `https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/tmdb/${tmdbID}/season/${season}`,
  //       {
  //         headers: {
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );
  //     const season_episodes = await episodes.json();
  //     const episodes_json = season_episodes["season/" + season];
  //     return episodes_json["episodes"];
  //   },
  //   {
  //     refetchOnWindowFocus: false,
  //   }
  // );

  const { setSeasonsCount } = useContext(SeasonsContext);

  const query = `
  query {
     getseasondetails(tmdbId: "${tmdbID}", season:"${season}"){
     
          episodes{
            air_date
            episode_number
            name
            overview
            season_number
            still_path
            vote_average
            vote_count
          }
          number_of_seasons
     }
  }
  `;

  const { data, isLoading, error } = useFetch(
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
    [queryKey]
  );

  const responseData = data?.data.getseasondetails;
  if (responseData) {
    setSeasonsCount(responseData["number_of_seasons"]);
  }

  return {
    data: responseData?.episodes,
    loading: isLoading,
    error,
  };
};
