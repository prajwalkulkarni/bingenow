import React, { useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ReactDOM from "react-dom";
import MediaPortal from "./MediaPortal";
import { ButtonCustom } from "../../UI/Button";
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
    <div className="flex flex-col p-1 m-2 bg-white md:flex-row">
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
      <img
        src={`https://image.tmdb.org/t/p/w500${image}`}
        alt={name}
        className="object-contain w-full md:w-1/4"
      />
      <div className="flex flex-col ml-2">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-md">{overview}</p>
        <p className="text-sm">Air Date: {air_date}</p>
        <div className="flex items-end h-full gap-x-1">
          <ButtonCustom onClick={() => setPlay(true)}>
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
        </div>
      </div>
    </div>
  );
};

export default Episode;
