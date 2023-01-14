import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import GlobalStyles from "@/components/globalStyles"
import { GoogleAnalytics } from "nextjs-google-analytics";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
    < GoogleAnalytics trackPageViews />
    <SessionProvider session={session}>
      <Toaster />
      <GlobalStyles />
      <Component {...pageProps} />
    </SessionProvider>
    </>
  )
}