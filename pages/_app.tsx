import '@/styles/globals.css'
import 'nprogress/nprogress.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'reactflow/dist/style.css'
import 'font-awesome/css/font-awesome.min.css'

import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ThemeProvider } from 'next-themes';
import { Provider as JotaiProvider} from 'jotai'
import Layout from '@/components/Layout';

NProgress.configure({showSpinner : false})

Router.events.on('routeChangeStart',()=>NProgress.start())
Router.events.on('routeChangeComplete',()=>NProgress.done())
Router.events.on('routeChangeError',()=>NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <ThemeProvider>
        <Layout>
          <DefaultSeo 
            openGraph={{
              type: 'website',
              locale: 'en_US',
              url: 'https://pasquale-favella.github.io/',
              siteName: 'Pasquale Favella blogfolio',
              images : [
                { url: 'https://pasquale-favella.github.io/og-image.png' },
              ]
            }}
            titleTemplate = 'Pasquale Favella | %s'
            defaultTitle="Pasquale Favella"
            additionalLinkTags={[
              {
                rel: 'icon',
                href:'/favicon.ico',
              },
            ]}
            additionalMetaTags={[
              {
                name : 'google-site-verification' ,
                content : process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CONTENT as string
              }
            ]}
          />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </JotaiProvider>
  )
}
