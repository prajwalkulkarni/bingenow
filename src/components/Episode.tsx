import React, { useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ReactDOM from "react-dom";
import MediaPortal from "./MediaPortal";
type Props = {
  image: string;
  episode: number;
  name: string;
  overview: string;
  air_date: string;
  imdbID: string;
  season: number;
};
const Episode: React.FC<Props> = (props) => {
  const { image, imdbID, season, episode, name, overview, air_date } = props;

  const [play, setPlay] = useState(false);
  const [src, setSrc] = useState<number>(0);

  return (
    <div className="flex flex-col rounded-md bg-white m-1 w-full shrink-0 grow-0  hover:cursor-pointer">
      <div className="p-1 relative rounded-md bg-white/10 hover:cursor-pointer">
        {play &&
          ReactDOM.createPortal(
            <MediaPortal
              mediaType="series"
              imdbID={imdbID}
              onClick={() => setPlay(false)}
              season={season}
              src={src}
              episode={episode}
            />,
            document.getElementById("portal") as HTMLElement
          )}
        <div className="absolute bg-white top-0 left-0 rounded-md p-1 text-sm m-1">
          S
          {season.toString().padStart(2, "0") +
            " " +
            "E" +
            episode.toString().padStart(2, "0")}
        </div>

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
            src={`https://image.tmdb.org/t/p/w500${image}`}
            alt={name}
            width="100%"
            height="100%"
            className="object-cover aspect-video rounded-md h-full"
          />
        </span>
        <button
          className="backdrop-blur-lg z-10 hover:scale-[1.04] flex items-center justify-center absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] rounded-full smoothie overflow-hidden"
          onClick={() => {
            setSrc(1);
            setPlay(true);
          }}
        >
          <PlayCircleOutlineIcon fontSize="large" />
        </button>
      </div>
      <p className="text-md px-1 font-bold">{name}</p>
    </div>
  );
};

export default Episode;
