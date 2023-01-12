import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo';
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <DefaultSeo 
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://pasquale-favella.github.io/',
          siteName: 'Pasquale blogfolio',
        }}
        titleTemplate = 'Pasquale blogfolio | %s'
        defaultTitle="Pasquale blogfolio"
        additionalLinkTags={[
          {
            rel: 'icon',
            href:'/favicon.ico',
          },
        ]}
      />
      <Component {...pageProps} />
    </Layout>
  )
}
