import { makePGliteProvider } from "@electric-sql/pglite-react"
import { useAtomValue } from 'jotai'
import { DeSignDB, deSignDbLoadableAtom } from '@/store/de-sign.atom'
import ErrorCard from '@/components/ErrorCard'
import { PGliteProvider, usePGlite  } from "@electric-sql/pglite-react"

//const { PGliteProvider: TypedPgLiteProvider, usePGlite: usePGliteDeSign,  } = makePGliteProvider<DeSignDB>();

function LoadingDeSignPgLite() {
    return <div className="skeleton mx-auto h-[calc(90dvh)] rounded"></div>
}

function PGliteDeSignProvider({ children }: { children: React.ReactNode }) {

    const dbInstance = useAtomValue(deSignDbLoadableAtom);

    if (dbInstance.state === 'hasError') return (
        <ErrorCard message="Your browser does not support DB provided" />
    );

    if (dbInstance.state === 'loading') {
        return <LoadingDeSignPgLite />
    }

    return <PGliteProvider db={dbInstance.data}>{children}</PGliteProvider>;
}

export { usePGlite as usePGliteDeSign, PGliteDeSignProvider }