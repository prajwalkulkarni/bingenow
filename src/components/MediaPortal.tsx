import React from "react";
import CloseIcon from "@mui/icons-material/Close";

const MediaPortal: React.FC<{
  mediaType: string;
  imdbID: string;
  episode?: number;
  season?: number;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}> = (props) => {
  const { mediaType, imdbID, season, episode } = props;
  const embed = `${mediaType === "series" ? "tv" : "movie"}?id=${imdbID}${
    mediaType === "series" ? "&s=" + props.season + "&e=" + props.episode : ""
  }`;
  const vidSrc = `/${
    mediaType === "series" ? imdbID + "/" + season + "-" + episode : imdbID
  }`;
  return (
    <div className="fixed top-0 left-0 z-10 flex items-center justify-center w-screen h-screen bg-black">
      <div
        className="fixed top-0 font-bold text-white right-5 hover:cursor-pointer"
        onClick={props.onClick}
      >
        <CloseIcon />
      </div>

      <div className="z-20 w-full md:w-4/5 md:h-3/4">
        <iframe
          src={`${process.env.REACT_APP_PLAYER_URL}/${vidSrc}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          width={"100%"}
          height={"100%"}
          title="Embedded youtube"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

export default MediaPortal;
