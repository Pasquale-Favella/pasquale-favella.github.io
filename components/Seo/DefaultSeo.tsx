import { DefaultSeo as Default } from 'next-seo';

const DefaultSeo  = ()=> {

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/';
    const googleSiteVerificationContent = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CONTENT as string;

    return (
        <Default
            openGraph={{
              type: 'website',
              locale: 'en_US',
              url: baseUrl,
              siteName: 'Pasquale Favella blogfolio',
              images : [
                { url: `${baseUrl}og-image.png` },
              ]
            }}
            titleTemplate = 'Pasquale Favella | %s'
            defaultTitle="Pasquale Favella"
            additionalLinkTags={[
              {
                rel: 'icon',
                href:`${baseUrl}favicon.ico`,
              },
            ]}
            additionalMetaTags={[
              {
                name : 'google-site-verification' ,
                content : googleSiteVerificationContent
              }
            ]}
        />
    );
}

export default DefaultSeo;