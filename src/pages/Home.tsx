import React, { useContext, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import CarouselSlides from "../components/CarouselSlides";
import { useCreateOrGetUser } from "./hooks/useCreateOrGetUser";
import Context from "../context/Context";
import { useGetCarouselData } from "./hooks/useGetCarouselData";

const CardListLazy = React.lazy(() => import("../components/CardList"));
const Home: React.FC<{ movies: boolean }> = (props) => {
  const ctx = useContext(Context);
  const {
    error: dbError,
    data: dbData,
    mutate: dbMutate,
    isLoading: dbLoading,
  } = useCreateOrGetUser(ctx?.email as string);

  useEffect(() => {
    if (dbData) {
      localStorage.setItem(
        "userId",
        JSON.stringify((dbData as any).data?.createOrGetUser.id)
      );
    } else {
      dbMutate?.();
    }
  }, [dbData]);

  const { movies } = props;

  const { carouselData, loading, error } = useGetCarouselData({ movies });

  if (error) {
    return (
      <div className="flex flex-col items-center w-full h-full">
        <img src={require("../assets/error.png")} alt="Error" />
        <p className="text-2xl text-gray-500">Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <section>
        <div className="flex relative overflow-hidden flex-col justify-center items-center min-h-[30vh] sm:min-h-[50vh] md:min-h-[60vh]">
          <CarouselSlides movies={movies} carouselData={carouselData} />
        </div>
      </section>

      <MediaCardsContainer movies={movies} isLoading={loading} />
    </div>
  );
};

export type CarouselType = {
  imdbId: string;
  title: string;
  poster: string;
  plot: string;
  runtime: string;
  year: string;
  genre: string;
  media?: string;
};

const MediaCardsContainer = (props: {
  movies: boolean;
  isLoading: boolean;
}) => {
  const { movies, isLoading } = props;
  const DATA = [
    {
      id: 1,
      title: "Action & Drama",
      category: movies ? "action" : "drama",
    },
    {
      id: 2,
      title: `Popular animated ${movies ? "films" : "shows"}`,
      category: movies ? "animated" : "cartoon",
    },
    {
      id: 3,
      title: movies ? "Watch with friends" : "World of Comedy",
      category: movies ? "friends" : "comedy",
    },
  ];

  return (
    <>
      {DATA.map((data) => {
        return (
          <MediaCards
            key={data.id}
            title={data.title}
            isLoading={isLoading}
            movies={movies}
            category={data.category}
          />
        );
      })}
    </>
  );
};

type MediaCardsType = {
  title: string;
  movies: boolean;
  isLoading: boolean;
  category: string;
};
const MediaCards = (props: MediaCardsType) => {
  const { title, movies, isLoading, category } = props;

  if (isLoading) {
    return (
      <div className="flex justify-center m-2">
        <CircularProgress color="primary" />
      </div>
    );
  }
  return (
    <div className="flex flex-col p-2">
      <p className="py-3 text-3xl font-bold md:text-5xl">{title}</p>
      <CardListLazy category={category} movies={movies} />
    </div>
  );
};

export default Home;
