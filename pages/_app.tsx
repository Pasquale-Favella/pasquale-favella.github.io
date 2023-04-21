import '@/styles/globals.css'
import 'nprogress/nprogress.css'
import 'highlight.js/styles/atom-one-dark.css'

import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ThemeProvider } from 'next-themes';
import Layout from '@/components/Layout';
import { Theme } from '@/types';

NProgress.configure({showSpinner : false})

Router.events.on('routeChangeStart',()=>NProgress.start())
Router.events.on('routeChangeComplete',()=>NProgress.done())
Router.events.on('routeChangeError',()=>NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme={Theme.dark}>
      <Layout>
        <DefaultSeo 
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: 'https://pasquale-favella.github.io/',
            siteName: 'Pasquale Favella blogfolio',
          }}
          titleTemplate = 'Pasquale Favella | %s'
          defaultTitle="Pasquale Favella"
          additionalLinkTags={[
            {
              rel: 'icon',
              href:'/favicon.ico',
            },
          ]}
        />
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}
