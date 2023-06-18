import React, { useEffect, useState } from "react";

const Feature: React.FC<React.PropsWithChildren & { image: string }> = (
  props
) => {
  const { children, image } = props;

  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    console.log("Loaded");
    setLoaded(true);
  };

  if (!image.includes("tmdb")) {
    return (
      <div
        className="relative w-full h-screen"
        style={{
          backgroundImage: loaded
            ? `url(${require(`../assets/cover/${image}.jpg`)})`
            : `url(${require(`../assets/cover/cover-small.png`)})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          transition: "background 0.5s ease-in-out",
        }}
      >
        <img
          src={require(`../assets/cover/${image}.jpg`)}
          onLoad={handleLoad}
          style={{ display: "none" }}
        />
        <div className="absolute w-full h-full bg-gradient-to-r from-black to-transparent">
          {loaded && children}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="relative w-full h-screen"
        style={{
          backgroundImage: `url(${image})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          transition: "filter 0.5s ease-in-out",
          filter: loaded ? "none" : "blur(10px)",
          transform: loaded ? "none" : "scale(1.1)",
        }}
      >
        <img src={image} onLoad={handleLoad} style={{ display: "none" }} />
        <div className="absolute w-full h-full bg-gradient-to-r from-black to-transparent">
          {loaded && children}
        </div>
      </div>
    );
  }
};

export default Feature;
