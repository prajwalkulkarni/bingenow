import { SkeletalPlaceholder } from "../common/CommonComponents";
import React from "react";

const Placeholder = (props: { count: number }) => {
  return (
    <>
      <div className="w-full">
        <div className="w-full md:h-[480px] lg:h-[600px] 2xl:h-[750px] 3xl:h-[800px] relative rounded-2xl md:rounded-none xl:rounded-2xl bg-white/5">
          <div className="margin-auto relative overflow-hidden p-0 block list-none z-10  swiper-horizontal w-full h-full rounded-xl md:rounded-none xl:rounded-2xl overflow-hidden">
            <div className={`relative flex w-100 h-100 `}>
              <div
                key={Date.now() + Math.random()}
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
                      src={require("../assets/bingenow-square.png")}
                      width="100%"
                      height="100%"
                      className="w-full h-full object-cover object-center"
                    />
                  </span>
                </div>
                <div className="w-full max-w-3xl mx-auto md:w-1/2 lg:w-[45%] mr-auto tracking-wide p-5 pb-6 pt-3 sm:p-8 lg:pt-12 flex gap-2 lg:gap-4 flex-col ">
                  <div className="text-2xl font-bold lg:text-4xl !leading-tight ">
                    <SkeletalPlaceholder height={40} />
                  </div>
                  <div className="text-xl">
                    <span className="flex gap-[2px] items-center">
                      <SkeletalPlaceholder height={20} />
                    </span>

                    {/* <span className="flex gap-[2px] items-center">
                        <AccessTime />{" "}
                        {getHumanizedTimeFromMinutes(
                          parseInt(media_data.runtime)
                        )}
                      </span> */}

                    <span className="flex gap-[2px] items-center">
                      <SkeletalPlaceholder height={80} />
                    </span>
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
                        src={require("../assets/bingenow-square.png")}
                        width="100%"
                        height="100%"
                        className="w-full object-cover h-full"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Placeholder;
