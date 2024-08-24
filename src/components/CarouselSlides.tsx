import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { ButtonCustom } from "../../UI/Button";
import { useNavigate } from "react-router-dom";
import { CarouselType } from "../pages/Home";
import getMessage from "../common/getMessage";
import Placeholder from "./Placeholder";
import SnackbarExtended from "../../UI/SnackbarExtended";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Stack from "@mui/material/Stack";
import { useAddtoWatchlist } from "../pages/hooks/useAddToWatchlist";

import { Event, Star } from "@mui/icons-material";
import {
  CarouselMovies,
  CarouselSeries,
} from "../pages/hooks/useGetCarouselData";
type CarouselSlidesType = {
  carouselData: CarouselMovies[] | CarouselSeries[] | undefined;
  movies: boolean;
};
const CarouselSlides = (props: CarouselSlidesType) => {
  const { movies, carouselData } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(1);

  const prevCount = useRef(count);
  const [carouselSlides, setCarouselSlides] = useState<CarouselType[]>([]);

  const currentIndex = Math.abs(count);
  const media_data = {
    imdbId:
      carouselSlides.length > 0 ? carouselSlides[currentIndex]["imdbId"] : "",
    title:
      carouselSlides.length > 0 ? carouselSlides[currentIndex]["title"] : "",
    poster: `https://image.tmdb.org/t/p/original${
      carouselSlides.length > 0 ? carouselSlides[currentIndex]["poster"] : ""
    }`,
    plot: carouselSlides.length > 0 ? carouselSlides[currentIndex]["plot"] : "",
    runtime:
      carouselSlides.length > 0 ? carouselSlides[currentIndex]["runtime"] : "",
    year: carouselSlides.length > 0 ? carouselSlides[currentIndex]["year"] : "",
    genre:
      carouselSlides.length > 0 ? carouselSlides[currentIndex]["genre"] : "",
    rating:
      carouselSlides.length > 0 ? carouselSlides[currentIndex]["rating"] : 0,
    media: "movie",
  };

  const {
    isLoading: addToWatchlistIsLoading,
    error: watchListError,
    data: watchListData,
    mutate: watchlistMutate,
  } = useAddtoWatchlist(media_data);

  const carouselDataMemoized = useMemo(() => carouselData, [carouselData]);

  useEffect(() => {
    let timeout = count === 6 ? 500 : 4000;
    let timer: NodeJS.Timeout | undefined = undefined;
    if (carouselData) {
      timer = setTimeout(() => {
        setCount((prev) => {
          if (prev === 6) {
            return 1;
          } else if (prev === 0) {
            return 5;
          }

          return prev + 1;
        });
      }, timeout);
    }

    return () => {
      clearTimeout(timer);
      prevCount.current = count;
    };
  }, [count, carouselDataMemoized]);

  const [message, severity] = getMessage(watchListData);

  if (carouselData && !carouselSlides.length) {
    const arr = carouselData.map((_, idx) => {
      const currentItem = Math.abs(idx);

      if (movies) {
        return {
          imdbId: carouselData[currentItem]["id"],
          title: (carouselData[currentItem] as CarouselMovies)["title"],
          poster: `https://image.tmdb.org/t/p/original${carouselData?.[currentItem]["backdrop_path"]}`,
          plot: carouselData[currentItem]["overview"],
          runtime: "100",
          year: (carouselData[currentItem] as CarouselMovies)[
            "release_date"
          ].toString(),
          rating: +carouselData[currentItem]["vote_average"].toFixed(1),
          genre: "NA",
        };
      }

      return {
        imdbId: carouselData[currentItem]["id"],
        title: (carouselData[currentItem] as CarouselSeries)["name"],
        poster: `https://image.tmdb.org/t/p/original${carouselData?.[currentItem]["backdrop_path"]}`,
        plot: carouselData[currentItem]["overview"],
        runtime: "100",
        year: carouselData[currentItem]["first_air_date"].toString(),
        rating: +carouselData[currentItem]["vote_average"].toFixed(1),
        genre: "NA",
      };
    });
    arr.push(arr[0]);
    arr.unshift(arr[arr.length - 2]);
    setCarouselSlides(arr);
  }

  const handleClose = useCallback(
    (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }

      setOpen(false);
    },
    []
  );

  if (watchListError) {
    return (
      <div className="flex flex-col items-center w-full h-full">
        <img src={require("../assets/error.png")} alt="Error" />
        <p className="text-2xl text-gray-500">Something went wrong</p>
      </div>
    );
  }
  if (!carouselData) {
    return <Placeholder count={count} />;
  }

  return (
    <>
      <SnackbarExtended
        open={open}
        message={message}
        severity={severity}
        handleClose={handleClose}
      />

      <div className="w-full">
        <div className="w-full md:h-[480px] lg:h-[600px] 2xl:h-[750px] 3xl:h-[800px] relative rounded-2xl md:rounded-none xl:rounded-2xl bg-white/5">
          <div className="margin-auto relative overflow-hidden p-0 block list-none z-10  swiper-horizontal w-full h-full rounded-xl md:rounded-none xl:rounded-2xl overflow-hidden">
            <div
              className={`${
                (count === 1 && prevCount.current === 5) ||
                (count === 5 && prevCount.current === 1)
                  ? "transition-none"
                  : "transition-[translate] duration-300 ease-in-out "
              }relative flex w-100 h-100 `}
              style={{ translate: `${-count * 100}%` }}
            >
              {carouselSlides.map((media_data) => (
                <div
                  key={media_data.imdbId + Math.random()}
                  className="flex-shrink-0 w-100 h-100 relative block flex flex-col md:flex-row w-full relative md:p-10 xl:p-16"
                >
                  <div className="!absolute top-0 left-0 z-[-1] blur-3xl overflow-hidden w-full h-full lg:h-[700px] object-cover opacity-50">
                    <span
                      className=" lazy-load-image-background blur lazy-load-image-loaded"
                      style={{
                        color: "transparent",
                        display: "inline-block",
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <img
                        src={media_data.poster}
                        width="100%"
                        height="100%"
                        className="w-full h-full object-cover object-center"
                      />
                    </span>
                  </div>
                  <div className="w-full max-w-3xl mx-auto md:w-1/2 lg:w-[45%] mr-auto tracking-wide p-5 pb-6 pt-3 sm:p-8 lg:pt-12 flex gap-2 lg:gap-4 flex-col ">
                    <div className="text-2xl font-bold lg:text-4xl !leading-tight ">
                      {media_data.title}
                    </div>
                    <div className="text-xs flex gap-3 ">
                      <span className="flex gap-[2px] items-center">
                        <Star /> {media_data.rating}
                      </span>

                      {/* <span className="flex gap-[2px] items-center">
                        <AccessTime />{" "}
                        {getHumanizedTimeFromMinutes(
                          parseInt(media_data.runtime)
                        )}
                      </span> */}

                      <span className="flex gap-[2px] items-center">
                        <Event /> {media_data.year}
                      </span>
                    </div>
                    <div className="text-xs lg:text-sm text-gray-200 !italic line-clamp-3 lg:line-clamp-5">
                      {media_data.plot}
                    </div>
                    <div className="mt-3 flex gap-2 lg:gap-3">
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 1, sm: 2 }}
                      >
                        <ButtonCustom
                          onClick={() =>
                            navigate(
                              `/${movies ? "movie" : "series"}/${
                                media_data.imdbId
                              }`
                            )
                          }
                          className="rounded-lg"
                        >
                          <PlayCircleOutlineIcon />
                          Watch
                        </ButtonCustom>

                        {/* <ButtonCustom
                          onClick={() => watchlistMutate?.()}
                          disabled={addToWatchlistIsLoading}
                          loading={addToWatchlistIsLoading}
                        >
                          Add to watchlist
                        </ButtonCustom> */}
                      </Stack>
                    </div>
                  </div>
                  <div className="w-full max-w-3xl mx-auto order-first md:order-none md:w-[50%] h-[calc(100%-100px)] md:p-5">
                    <div className="w-full aspect-video sm:aspect-[16/10]	md:rounded-2xl overflow-hidden bg-white/5 relative group">
                      <span
                        className={` lazy-load-image-background lazy-load-image-loaded`}
                        style={{
                          color: "transparent",
                          display: "inline-block",
                          height: "100%",
                          width: "100%",
                        }}
                      >
                        <img
                          src={media_data.poster}
                          width="100%"
                          height="100%"
                          className="w-full object-cover h-full"
                        />
                      </span>
                      <button
                        className="backdrop-blur-lg opacity-0 p-3 md:p-5 group-hover:opacity-100 hover:scale-[1.04] hidden md:flex items-center justify-center absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded-full smoothie overflow-hidden"
                        onClick={() =>
                          navigate(
                            `/${movies ? "movie" : "series"}/${
                              media_data.imdbId
                            }`
                          )
                        }
                      >
                        <PlayCircleOutlineIcon fontSize="large" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarouselSlides;
