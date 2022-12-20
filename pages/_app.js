import { SessionProvider } from "next-auth/react"
import { Toaster } from "react-hot-toast"
import GlobalStyles from "@/components/globalStyles"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <GlobalStyles />
      <Component {...pageProps} />
    </SessionProvider>
  )
}