import dynamic from "next/dynamic";
import { Theme } from "@/types";
import { useTheme } from "@/hooks/use-theme";

const Excalidraw = dynamic(
  () => import("@excalidraw/excalidraw").then(m => m.Excalidraw),
  {
    ssr: false,
    loading: () => {
      return (
        <div className="flex justify-center px-4 py-16">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      );
    },
  },
);

const CanvasDrawer = () => {

  const { theme } = useTheme();

  return (
    <div className="h-[90vh] w-screen sm:w-full">
      <Excalidraw theme={theme === Theme.dark ? Theme.dark : Theme.light} />
    </div>
  )
};

export default CanvasDrawer;
