import React, { ChangeEvent, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useDebounce } from "../hooks/useDebounce";
import { getLatestAuthToken } from "../utils/manageToken";
const Search = () => {
  const [search, setSearch] = useState("");

  const debouncedValue = useDebounce(search, search === "" ? 100 : 500);

  const queryClient = useQueryClient();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  const { data, status, isLoading, isError, refetch } = useQuery(
    "searchquery:" + debouncedValue,
    async () => {
      if (debouncedValue && debouncedValue.length > 3) {
        const token = await getLatestAuthToken();
        const data = await fetch(
          "https://54aoybt2ja.execute-api.ap-southeast-1.amazonaws.com/omdb/" +
            search.trim().split(" ").join("+"),
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        const json = await data.json();

        const results = json["Search"];

        return results
          ? results.length <= 5
            ? results
            : results.slice(0, 5)
          : [];
      } else {
        return [];
      }
    },
    {
      enabled: debouncedValue.length > 0,
    }
  );

  const resetSearch = () => {
    setSearch("");
    queryClient.cancelQueries("");
    queryClient.cancelQueries(debouncedValue);
  };

  return (
    <div className="relative w-full md:w-1/2 lg:w-1/4">
      <input
        type="text"
        className="w-full p-2 rounded-md"
        value={search}
        onChange={handleSearch}
        placeholder="Search (enter min. 4 characters)"
      />

      {isError && <p>Error</p>}
      <div
        className="absolute z-100 w-full bg-white rounded-b-md"
        style={{ zIndex: 100 }}
      >
        {isLoading && !!search && (
          <div className="flex justify-center py-2 text-violet-800">
            <CircularProgress color="primary" />
          </div>
        )}
        {data?.map((item: any, key: number) => (
          <Link
            to={`/${item["Type"]}/${item["imdbID"]}`}
            key={item.imdbID}
            onClick={resetSearch}
          >
            <div
              className={`flex p-1 ${
                key === data.length - 1 ? "" : "border-b"
              } border-gray-300`}
            >
              <div className="hidden h-14 lg:flex">
                <img
                  src={item.Poster}
                  alt="poster not found"
                  width="80"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col w-full px-2">
                <p className="font-bold text-md">
                  {item.Title.length > 50
                    ? item.Title.substr(0, 50) + "..."
                    : item.Title}
                </p>
                <p className="text-base text-gray-500">{item.Year}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
