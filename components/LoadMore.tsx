"use client";
import { Spinner } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface LoadMoreStruct {
  setPage: (val: number) => void;
  page: number;
}

export default function LoadMore({ setPage, page }: LoadMoreStruct) {
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      console.log("Bottom");
      setPage(page + 1);
    }
  }, [inView, page, setPage]);
  return (
    <div className="flex justify-center items-center p-4" ref={ref}>
      <Spinner className="animate-spin" />
    </div>
  );
}
