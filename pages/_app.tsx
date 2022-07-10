import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../component/Header'
import { useEffect, useState } from 'react'
import * as authServie from '../service/authentication'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  console.log("myApp")
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    console.log("useEffect")
    authServie.userSubject.next(localStorage.getItem("user") as string)
    const hideContent = () => {
      console.log("hideContent")
      setAuthorized(false)
    };
    authCheck(router.asPath)

    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck)

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
  }
  },[])

  const authCheck = (url: string) => {
    const publicPaths = ['/login'];
    const path = url.split('?')[0];
    console.log(!authServie.userSubject.value)
    console.log("!authServie.userSubject.value")
    if (!authServie.userSubject.value && !publicPaths.includes(path)) {
        setAuthorized(false);
        router.push({
            pathname: '/login'
        });
    } else if (publicPaths.includes(path)) {
        if (authServie.userSubject.value) {
          router.push({
            pathname: '/vocabulary'
        });
        }
    } else {
        setAuthorized(true);
    }
  }

  return (
    <div>
        <Header></Header>
        {authorized && <Component {...pageProps} />}
    </div>
  )
  
}

export default MyApp
