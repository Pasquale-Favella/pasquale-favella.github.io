import Nextle from "@/components/Nextle/Nextle";
import GithubService from "@/services/github.service";
import { nextleGameStateAtom, wordsAtom } from "@/store/nextle.atom";
import { NextleUtils } from "@/utils";
import { useHydrateAtoms } from "jotai/utils";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";


type Props = {
  words : string[]
};

const NextlePage : React.FC<Props>  = ({ words })=> {

  useHydrateAtoms([
    [wordsAtom , words] as const ,
    [nextleGameStateAtom , NextleUtils.initializeGameState(words)] as const
  ]);

  return (
    <>
      <NextSeo 
        title='Nextle' 
        description='Put your word-solving skills to the test with Nextle, a fun and addictive word puzzle game inspired by Wordle. Guess the hidden word in as few attempts as possible by deciphering the clues. Challenge your vocabulary and logic while having a blast. Play Nextle now and see how sharp your word-guessing skills really are!'
      />

      <Nextle />
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const {data : words} = await GithubService.getNextleWords();
    
  return {
    props: {
      words : words.map(w=> w.toUpperCase())
    }
  };
}


export default NextlePage