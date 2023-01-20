import Link from "next/link"
import { FiHome } from "react-icons/fi"

export default function Custom404() {
    return (
        <div className="container mx-auto text-center">
            <h1 className="font-bold text-4xl sm:text-6xl mt-10 mb-5 flex align-middle justify-center">
                Page not found
            </h1>
            <Link href={`/`}>
                <div className="btn btn-primary text-white hover:text-white/80 gap-2">
                    <FiHome size={20} />
                    back home
                </div>
            </Link>
        </div>
    )
  }