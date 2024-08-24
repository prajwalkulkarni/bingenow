import React from "react";
import { useQuery } from "react-query";
import {
  getDocs,
  collection,
  getFirestore,
  DocumentData,
} from "firebase/firestore";
import { app } from "../firebase";
import CardItem from "./CardItem";
import { CircularProgress } from "@mui/material";
const db = getFirestore(app);

const CardList: React.FC<{ category: string; movies: boolean }> = (props) => {
  const { data, isLoading } = useQuery(props.category, async () => {
    const querySnapshot = await getDocs(collection(db, props.category));
    const data = querySnapshot.docs.map((doc) => doc.data());

    return data;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 w-full">
      {data?.map((item: DocumentData, index: number) => (
        <CardItem
          movie={props.movies}
          key={index}
          title={item["Title"]}
          year={item["Year"]}
          runtime={item["Runtime"]}
          poster={item["Poster"]}
          imdbID={item["imdbID"]}
        />
      ))}
    </div>
  );
};

export default CardList;
