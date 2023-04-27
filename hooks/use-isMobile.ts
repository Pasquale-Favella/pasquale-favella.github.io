import { useState , useEffect } from "react";

const MOBILES_REG =  /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;

export default function useIsMobile() {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;

    const mobile = Boolean(userAgent.match(MOBILES_REG));

    setMobile(mobile);
  }, []);

  return  isMobile;
}