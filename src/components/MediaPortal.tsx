import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const MediaPortal: React.FC<{
  mediaType: string;
  imdbID: string;
  episode?: number;
  season?: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
  src: number;
}> = (props) => {
  const { mediaType, imdbID, season, episode, onClick, src } = props;

  let vidSrc = "";

  if (src === 0) {
    vidSrc = `${
      mediaType === "series"
        ? "tv/" + imdbID + "/" + season + "/" + episode
        : "movie/" + imdbID
    }`;
  } else {
    vidSrc = `${
      mediaType === "series"
        ? "tv/" + imdbID + "/" + season + "-" + episode
        : "movie/" + imdbID
    }`;
  }

  let mediaSrc =
    src === 0
      ? process.env.REACT_APP_PLAYER_URL
      : process.env.REACT_APP_PLAYER_URL_SECONDARY;

  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-screen h-screen bg-black">
      <div
        className="fixed top-0 font-bold text-white right-5 hover:cursor-pointer"
        onClick={onClick}
      >
        <CloseIcon />
      </div>

      <div className="z-20 w-full md:w-4/5 md:h-3/4">
        <iframe
          src={`${mediaSrc}/${vidSrc}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          width={"100%"}
          height={"100%"}
          title="Embedded Player"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default MediaPortal;
