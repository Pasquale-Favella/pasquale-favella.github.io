import '@/styles/globals.css'
import 'nprogress/nprogress.css'
import 'highlight.js/styles/atom-one-dark.css'
import 'reactflow/dist/style.css'
import 'font-awesome/css/font-awesome.min.css'

import type { AppProps } from 'next/app';
import Router from 'next/router';
import NProgress from 'nprogress';
import { ThemeProvider } from 'next-themes';
import { Provider as JotaiProvider} from 'jotai';
import Layout from '@/components/Layout';
import DefaultSeo from '@/components/Seo/DefaultSeo';

NProgress.configure({showSpinner : false})

Router.events.on('routeChangeStart',()=>NProgress.start())
Router.events.on('routeChangeComplete',()=>NProgress.done())
Router.events.on('routeChangeError',()=>NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <ThemeProvider>
        <Layout>
          <DefaultSeo />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </JotaiProvider>
  )
}
