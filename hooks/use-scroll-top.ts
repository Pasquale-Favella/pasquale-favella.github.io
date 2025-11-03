import { useEffect } from "react";

const useScrollTop = (trackTrigger: boolean | number | string) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [trackTrigger]);
};

export { useScrollTop };
