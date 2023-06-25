import React from "react";
import Typed from "react-typed";
import { motion } from "framer-motion";
import Feature from "../components/Feature";
import Card from "../../UI/Card";
const Landing: React.FC = () => {
  return (
    <main>
      <section className="p-0 m-0">
        <Feature image="cover">
          <div className="flex flex-col items-center justify-center h-screen text-white">
            <p className="text-4xl font-bold sm:text-7xl">Bingenow</p>

            <p className="py-4 text-2xl font-semibold sm:text-3xl">
              Stream great{" "}
              <Typed
                strings={["Movies", "TV shows", "Web series"]}
                typeSpeed={50}
                backSpeed={100}
                loop
              />
            </p>
            <p className="text-2xl font-semibold sm:text-3xl">
              All at one place
            </p>
          </div>
        </Feature>
      </section>
      <section>
        <Card className="mx-0 my-3">
          <div className="grid grid-cols-1 p-3 md:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.div
                variants={{
                  visible: {
                    x: 0,
                    transition: {
                      duration: 0.5,
                    },
                  },
                  hidden: { x: -500 },
                }}
                className="flex flex-col justify-center h-full"
              >
                <p className="text-6xl font-bold">Save Now, Watch Later</p>
                <p className="py-1 text-xl text-gray-400">
                  Save Your Favorites, Watch at Your Convenience: Personalized
                  Watchlist for Uninterrupted Entertainment.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: {
                  overflow: "hidden",
                },
              }}
            >
              <motion.div
                variants={{
                  visible: {
                    x: 0,
                    transition: {
                      duration: 0.5,
                    },
                  },

                  hidden: { x: 800 },
                }}
                className="flex justify-center md:justify-end"
              >
                <img src={require("../assets/cover/card1.png")} width={"50%"} />
              </motion.div>
            </motion.div>
          </div>
        </Card>
      </section>
      <section>
        <Card className="mx-0 my-3">
          <div className="grid grid-cols-1 p-3 md:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <motion.div
                variants={{
                  visible: {
                    x: 0,
                    transition: {
                      duration: 0.5,
                    },
                  },
                  hidden: { x: -800 },
                }}
                className="flex justify-center md:justify-start"
              >
                <img
                  src={require("../assets/cover/card2.png")}
                  style={{ objectFit: "contain", width: 600 }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={{
                hidden: {
                  overflow: "hidden",
                },
              }}
            >
              <motion.div
                variants={{
                  visible: {
                    x: 0,
                    transition: {
                      duration: 0.5,
                    },
                  },

                  hidden: { x: 800 },
                }}
                className="flex flex-col justify-center h-full p-4"
              >
                <p className="text-6xl font-bold">You name it.</p>
                <p className="py-1 text-xl text-gray-400">
                  Action to Thriller. Comedy to Romance. You name it, we got it.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </Card>
        {/* <p>Bingenow is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want without a single commercial – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!</p> */}
      </section>

      <section>
        <Card className="mx-0 my-3">
          <motion.div
            className="flex flex-col items-center p-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0, overflow: "hidden" },
            }}
          >
            <p className="text-6xl font-bold">Watch on Any Device</p>
            <br />
            <p className="text-xl">
              Bingenow works well on all sizes of devices.
            </p>
            <p className="text-xl text-gray-400">
              Enjoy your content on both large displays and small devices, such
              as smartphones.
            </p>
          </motion.div>

          <div className="flex flex-col items-center p-4">
            <img
              src={require("../assets/cover/card3.png")}
              className="object-contain"
              style={{ width: 600, objectFit: "contain" }}
            />
          </div>
        </Card>
      </section>
    </main>
  );
};

export default Landing;
