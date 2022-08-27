import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next'
import { redirect } from 'next/dist/server/api-utils'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
const Home: NextPage<any> = ({data}) => {
  const router = useRouter()
  useEffect(() => {
    router.push("/vocabulary")
  },[])

  return (
    <></>
  )
}

export default Home
