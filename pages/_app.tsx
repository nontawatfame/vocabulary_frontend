import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../component/Header'
import { SessionProvider } from "next-auth/react"
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { useEffect } from 'react'
config.autoAddCss = false

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <div>
      <Header></Header>
      {/* <SessionProvider session={session}> */}
        <Component {...pageProps} />
      {/* </SessionProvider> */}
    </div>
  )
  
}

export default MyApp
