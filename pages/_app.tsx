import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../component/Header'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
        <Header></Header>
        <Component {...pageProps} />
    </div>
  )
  
}

export default MyApp
