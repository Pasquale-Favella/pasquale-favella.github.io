import { CONSTANTS } from "@/config";
import Link from "next/link";

const Footer = ()=>{

    const year = new Date().getFullYear();

    return (
        <footer className="text-gray-600 ">
          <div className="max-w-6xl px-5 py-4 mx-auto flex items-center sm:flex-row flex-col">
              
            <a className="text-primary hover:underline underline-offset-2"
                aria-label="Email to paskfdev@gmail.com" title="Email to paskfdev@gmail.com" href="mailto:paskfdev@gmail.com">
                Pasquale Favella
            </a>

            <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                ©{year} • made with love 💚
            </p>
            <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start gap-4">        
                {CONSTANTS.HERO_LINKS.map((link, i) => (
                <Link key={i} href={link.href} className='transition-all duration-300 hover:text-primary'>
                    <link.icon size={20}/>
                </Link>
                ))}
            </span>
          </div>
        </footer>
    )
}

export default Footer;