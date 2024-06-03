import { Spinner } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface LoadMoreProps {
  setPage: () => void;
  isLoading: boolean;
}

const LoadMore: React.FC<LoadMoreProps> = ({ setPage, isLoading }) => {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && !isLoading) {
      console.log("Bottom");
      setPage();
    }
  }, [inView, isLoading, setPage]);

  return (
    <div className="flex justify-center items-center p-4" ref={ref}>
      {isLoading ? <Spinner className="animate-spin" /> : <p>No more tasks</p>}
    </div>
  );
};

export default LoadMore;
