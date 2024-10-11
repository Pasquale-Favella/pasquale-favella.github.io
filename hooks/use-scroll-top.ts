import { useEffect } from "react";

const useScrollTop = (condition: boolean) => {
  useEffect(() => {
    if (condition) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [condition]);
};

export { useScrollTop };
