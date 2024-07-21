import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useQuery } from "react-query";
import { app } from "../../firebase";

const db = getFirestore(app);
export const useGetCarouselData = ({ movies }: { movies: boolean }) => {
  const {
    data: carouselData,
    isLoading,
    isError,
  } = useQuery(movies ? "carousel" : "carouselshows", async () => {
    const querySnapshot = await getDocs(
      collection(db, movies ? "home" : "shows")
    );
    const data = querySnapshot.docs.map((doc) => doc.data());

    return data;
  });

  return {
    carouselData,
    loading: isLoading,
    error: isError,
  };
};
