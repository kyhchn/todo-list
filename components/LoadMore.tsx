"use client";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface LoadMoreStruct {
  setPage: () => void;
  isLoading: boolean;
}

export default function LoadMore({ setPage, isLoading }: LoadMoreStruct) {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      console.log("Bottom");
      setPage();
    }
  }, [inView]);
  return (
    <div className="flex justify-center items-center p-4" ref={ref}>
      {isLoading ? <Spinner className="animate-spin" /> : <p>No more task</p>}
    </div>
  );
}
