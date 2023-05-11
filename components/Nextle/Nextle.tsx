import useNextle from "@/hooks/use-nextle";
import Guess from "./Guess";
import Qwerty from "./Qwerty";
import WinModal from "./WinModal";
import LoseModal from "./LoseModal";

const Nextle = () => {
  const { guesses , hasWon , hasLost  } = useNextle();

  return (
    <section className="h-[87vh] md:h-[80vh] flex flex-col items-center justify-between w-full mx-auto">
      <div className="flex justify-center items-center w-full my-auto">
        <div className="grid grid-rows-6 gap-1 md:gap-2 box-border p-2">
          {guesses.map((_, i) => (
            <Guess
              key={i}
              index={i}
            />
          ))}
        </div>
      </div>
      <Qwerty  />
      {hasWon && <WinModal />}
      {hasLost && <LoseModal />}
    </section>
  );
}

export default Nextle