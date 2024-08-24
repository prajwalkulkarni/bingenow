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
    <Card className="rounded-md flex-shrink-0 mx-2">
      <div className="relative flex flex-wrap overflow-hidden group aspect-[1/1.5] w-full rounded-md">
        <figure className="relative flex flex-wrap w-100">
          <Link to={`/${!movie ? "series" : "movie"}/${imdbID}`}>
            <img
              src={poster}
              alt="poster"
              className="object-cover rounded-md overflow-hidden transition duration-500 transform w-full h-full hover:scale-150"
              loading="lazy"
            />
          </Link>
        </figure>
        <div className="absolute bottom-0 left-0 z-10 w-full transition duration-500 translate-y-full bg-white group-hover:translate-y-0">
          <Link to={`/${!movie ? "series" : "movie"}/${imdbID}`}>
            <p className="px-3 text-lg font-bold text-black text-ellipsis">
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
