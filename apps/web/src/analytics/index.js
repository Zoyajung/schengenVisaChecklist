// =============================================================================
// Analytics — CMS-driven provider loader. Reads IDs from the Sanity
// `siteSettings.analytics` object and mounts only providers with an ID set.
// Supports: Google Analytics 4, Google Tag Manager, Plausible, Microsoft Clarity.
// To add a provider: edit siteSettings in Sanity Studio → Integrations.
// No IDs configured → renders nothing (zero overhead).
// =============================================================================

import Script from 'next/script'

/**
 * CMS-driven analytics. Reads the `analytics` object from Site Settings and
 * mounts only the providers that have an ID. No IDs => renders nothing.
 *
 * @param {{analytics?: {ga4Id?:string, gtmId?:string, plausibleDomain?:string, clarityId?:string}}} props
 */
export function Analytics({analytics}) {
  if (!analytics) return null
  const {ga4Id, gtmId, plausibleDomain, clarityId} = analytics

  return (
    <>
      {ga4Id ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}

      {gtmId ? (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      ) : null}

      {plausibleDomain ? (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}

      {clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`}
        </Script>
      ) : null}
    </>
  )
}

export default Analytics
