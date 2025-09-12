import { useState } from 'react'
import { PGlite, PGliteInterfaceExtensions } from '@electric-sql/pglite'
import { live } from '@electric-sql/pglite/live'
import { vector } from '@electric-sql/pglite/vector'
import { makePGliteProvider } from "@electric-sql/pglite-react"
import { useRunOnce } from '@/hooks/use-run-once'

export type DB = PGlite & PGliteInterfaceExtensions<{
    live: typeof live
    vector: typeof vector
}>

const { PGliteProvider: TypedPgLiteProvider, usePGlite } = makePGliteProvider<DB>();

async function initializeDb() {
    const db = await PGlite.create({
        extensions: { live, vector }
    });

    return db;
}

function PGliteProvider({ children }: { children: React.ReactNode }) {

    const [db, setDb] = useState<Awaited<ReturnType<typeof initializeDb>> | undefined>(undefined);

    useRunOnce(async ()=>{
       const db =  await initializeDb();
       setDb(db)
    });

    if (!db) return null;

    return <TypedPgLiteProvider db={db}>{children}</TypedPgLiteProvider>;
}

export { usePGlite, PGliteProvider }