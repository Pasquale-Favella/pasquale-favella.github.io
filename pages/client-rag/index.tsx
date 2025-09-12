import { PGliteProvider } from "@/providers/pglite.provider";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
const ClientRag = dynamic(() => import('@/components/ClientRag'), {
    ssr: false,
    loading: () => {
        return (
            <div className="flex justify-center px-4 py-16">
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    },
});


type Props = {};

const ClientRagPage: React.FC<Props> = () => {

    return (
        <>
            <NextSeo
                title='Client Rag'
                description='Powerfull client Side AI Rag'
            />
            <script src="/pdfjs/pdf.min.mjs" type="module" defer />
            <PGliteProvider>
                <ClientRag />
            </PGliteProvider>
        </>
    )
}

export default ClientRagPage