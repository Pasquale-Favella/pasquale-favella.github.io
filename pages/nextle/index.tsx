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
      <NextSeo title='Nextle' description='Pasquale Favella , guess the hidden word in 6 tries.'/>
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