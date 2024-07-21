import React, { useEffect, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useQuery } from "react-query";
import Seasons from "../components/Seasons";
import Feature from "../components/Feature";
import MediaPortal from "../components/MediaPortal";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import SnackbarExtended from "../../UI/SnackbarExtended";
import getMessage from "../common/getMessage";
import Error from "../components/ErrorPage";
import {
  ContentSeparator,
  FullScreenLoader,
  SkeletalPlaceholder,
} from "../common/CommonComponents";
import { getHumanizedTimeFromMinutes } from "../utils/commonFunctions";
import { useAddtoWatchlist } from "./hooks/useAddToWatchlist";
import { getLatestAuthToken } from "../utils/manageToken";
import { ButtonCustom } from "../../UI/Button";
import { useGetMovieData } from "./hooks/useGetMovieData";

const Movie: React.FC<Record<string, never>> = () => {
  const route = useParams();

  const seasonsRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    message: "",
    severity: "success",
  });

  const [season, setSeason] = React.useState(1);

  const [src, setSrc] = useState<number>(0);

  const [play, setPlay] = React.useState(false);
  const { mediaType, imdbID } = route;

  const { data, error, loading } = useGetMovieData({
    imdbID: imdbID!,
    mediaType,
  });

  const media_data = {
    title: data?.title ?? "",
    year: data?.year ?? "",
    genre: data?.genre ?? "",
    runtime: data?.runtime ?? "",
    plot: data?.plot ?? "",
    poster: `https://image.tmdb.org/t/p/w500${data?.backdrop}`,
    imdbId: imdbID ?? "",
    media: mediaType,
  };
  const {
    isLoading: addToWatchlistIsLoading,
    error: watchListError,
    data: watchListData,
    mutate: watchlistMutate,
  } = useAddtoWatchlist(media_data);

  const changeSeason = (e: SelectChangeEvent<number>) => {
    setSeason(Number(e.target.value));
  };

  useEffect(() => {
    if (season && seasonsRef.current) {
      seasonsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [season]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleClose = useCallback(
    (_: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    },
    []
  );

  if (!addToWatchlistIsLoading && watchListData && !toast.message) {
    setOpen(true);

    const [message, severity] = getMessage(watchListData);
    setToast({
      message,
      severity,
    });
  }

  if (error || watchListError) {
    return <Error />;
  }

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <main>
      <section>
        <Feature image={`https://image.tmdb.org/t/p/original${data?.backdrop}`}>
          {play &&
            ReactDOM.createPortal(
              <MediaPortal
                mediaType="movie"
                imdbID={imdbID!}
                onClick={() => setPlay(false)}
                src={src}
              />,
              document.getElementById("portal")!
            )}

          <div className="flex">
            <div className="flex flex-col p-6 md:w-1/2">
              <SnackbarExtended
                open={open}
                message={toast.message}
                severity={toast.severity}
                handleClose={handleClose}
              />
              {data ? (
                <p className="text-2xl font-bold text-white md:text-5xl">
                  {data.title}
                </p>
              ) : (
                <SkeletalPlaceholder height={6} />
              )}
              <div className="flex flex-col py-3 md:flex-row md:items-center">
                {mediaType === "series" && (
                  <FormControl
                    sx={{ minWidth: 120 }}
                    size="small"
                    className="text-white border-none h-fit w-fit bg-violet-800 hover:border-none hover:text-white"
                  >
                    <Select
                      labelId="demo-select-small"
                      id="demo-select-small"
                      value={season}
                      label="Season"
                      sx={{
                        color: "white",
                        boxShadow: "none",
                        ".MuiOutlinedInput-notchedOutline": { border: 0 },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: 0,
                        },
                      }}
                      notched={false}
                      className="text-white bg-violet-800 hover:border-none hover:text-white"
                      onChange={changeSeason}
                    >
                      {new Array(data?.seasons).fill(0).map((_, i) => {
                        return (
                          <MenuItem
                            className="p-2 text-black bg-gray-500 rounded-none hover:bg-violet-900"
                            key={i}
                            value={i + 1}
                          >
                            Season {i + 1}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
                {data ? (
                  <div className="flex flex-col md:flex-row">
                    <p className="flex items-center font-semibold text-white text-md md:text-lg sm:px-1">
                      <AccessTimeIcon /> &nbsp;-{" "}
                      {getHumanizedTimeFromMinutes(parseInt(data.runtime))}
                    </p>
                    <ContentSeparator />
                    <p className="flex items-center font-semibold text-white text-md md:text-lg sm:px-1">
                      <StarOutlineIcon /> &nbsp;- IMdb {data.imdbRating}
                    </p>
                    <ContentSeparator />
                    <p className="flex items-center font-semibold text-white text-md md:text-lg sm:px-1">
                      <CalendarMonthIcon /> &nbsp;- {data.year}
                    </p>
                  </div>
                ) : (
                  <SkeletalPlaceholder height={4} />
                )}
              </div>
              {data ? (
                <p className="p-1 text-white text-md md:text-lg">{data.plot}</p>
              ) : (
                <SkeletalPlaceholder height={8} />
              )}

              <div className="flex flex-col justify-center mt-4">
                {data ? (
                  <>
                    <p className="font-semibold text-white text-md md:text-lg sm:px-1">
                      Director: {data.director}
                    </p>
                    <p className="font-semibold text-white text-md md:text-lg sm:px-1">
                      Actors: {data.actors}
                    </p>
                    <p className="font-semibold text-white text-md md:text-lg sm:px-1">
                      Genre: {data.genre}
                    </p>
                  </>
                ) : (
                  <SkeletalPlaceholder height={8} />
                )}
                <div className="flex">
                  {data ? (
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 1, sm: 2 }}
                    >
                      {mediaType === "movie" && (
                        <>
                          <ButtonCustom
                            onClick={() => {
                              setPlay(true);
                              setSrc(0);
                            }}
                          >
                            <PlayCircleOutlineIcon />
                            Watch
                          </ButtonCustom>
                          <ButtonCustom
                            variant="outlined"
                            onClick={() => {
                              setPlay(true);
                              setSrc(1);
                            }}
                          >
                            Watch #2
                          </ButtonCustom>
                        </>
                      )}
                      <ButtonCustom
                        onClick={() => watchlistMutate?.()}
                        disabled={addToWatchlistIsLoading}
                        loading={addToWatchlistIsLoading}
                      >
                        Add to watchlist
                      </ButtonCustom>
                    </Stack>
                  ) : (
                    <SkeletalPlaceholder height={8} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </Feature>
      </section>
      <section>
        {mediaType === "series" && data?.tmdbID && (
          <Seasons
            title={data?.title}
            ref={seasonsRef}
            imdbID={imdbID!}
            season={season}
            tmdbID={data?.tmdbID}
          />
        )}
      </section>
    </main>
  );
};

export default Movie;
