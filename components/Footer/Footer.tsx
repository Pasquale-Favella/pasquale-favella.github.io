import { CONSTANTS } from "@/config";
import GitOwner from "@/config/owner";
import Link from "next/link";

import dynamic from "next/dynamic";
const Chatbot = dynamic(() => import('@/components/Chatbot'), {
    ssr: false,
    loading: () => {
        return (
            <div className="fixed bottom-4 right-1 sm:bottom-10 sm:right-6 z-50">
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    },
});

const Footer = ()=>{

    const year = new Date().getFullYear();

    return (
        <footer className="text-gray-600">
            <div className="max-w-6xl px-5 py-4 mx-auto flex items-center sm:flex-row flex-col">
                
                <a className="text-primary hover:underline underline-offset-2"
                aria-label={`Email to ${GitOwner.contact_mail}`}
                title={`Email to ${GitOwner.contact_mail}`} 
                href={`mailto:${GitOwner.contact_mail}`}
                >
                    {`${GitOwner.name} ${GitOwner.surname}`}
                </a>

                <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                    ©{year} • made with 💚
                </p>
                <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center items-center sm:justify-start gap-4">        
                    {CONSTANTS.HERO_LINKS.map((link, i) => (
                    <Link key={i} href={link.href} className='transition-all duration-300 hover:text-primary'>
                        <link.icon size={20}/>
                    </Link>
                    ))}
                </span>
            </div>
            <Chatbot/>
        </footer>
    )
}

export default Footer;