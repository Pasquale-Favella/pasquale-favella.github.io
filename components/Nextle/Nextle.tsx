import useNextle from "@/hooks/use-nextle";
import Guess from "./Guess";
import Qwerty from "./Qwerty";
import WinModal from "./WinModal";
import LoseModal from "./LoseModal";

const Nextle = () => {
  const { guesses , hasWon , hasLost  } = useNextle();

  return (
    <main className="flex  flex-col items-center justify-center bg-base-100">
      {guesses.map((_, i) => (
        <Guess
          key={i}
          index={i}
        />
      ))}
      <Qwerty  />
      {hasWon && <WinModal />}
      {hasLost && <LoseModal />}
    </main>
  );
}

export default Nextle