import React from "react";
import Card from "../../UI/Card";

type CardItemProps = {
  title: string;
  year: string;
  runtime: string;
  poster: string;
  imdbID: string;
  movie: boolean;
};

import { Link } from "react-router-dom";
const CardItem: React.FC<CardItemProps> = (props) => {
  const { title, year, poster, imdbID, movie } = props;

  return (
    <Card className="flex-shrink-0 mx-2 basis-1/2 sm:basis-2/5 md:basis-1/5">
      <div className="relative flex flex-wrap overflow-hidden group">
        <figure className="relative flex flex-wrap w-100">
          <Link to={`/${!movie ? "series" : "movie"}/${imdbID}`}>
            <img
              src={poster}
              alt="poster"
              className="object-cover overflow-hidden transition duration-500 transform w-100 hover:scale-150"
              loading="lazy"
              style={{ aspectRatio: "2/3" }}
            />
          </Link>
        </figure>
        <div className="absolute bottom-0 left-0 z-10 w-full transition duration-500 translate-y-full bg-white group-hover:translate-y-0">
          <Link to={`/${!movie ? "series" : "movie"}/${imdbID}`}>
            <p className="px-3 text-2xl font-bold text-black text-ellipsis">
              {title}
            </p>
          </Link>
          <p className="px-3 font-bold text-black text-gray-500 ">{year}</p>
        </div>
      </div>
    </Card>
  );
};

export default CardItem;
