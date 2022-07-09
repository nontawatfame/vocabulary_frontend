import type { GetStaticPathsResult, GetStaticPropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useEffect } from 'react'
import Header from '../component/Header'
import styles from '../styles/Home.module.css'
const Home: NextPage<any> = ({data}) => {

  return (
    <div className={styles.container}>
    </div>
  )
}

export default Home
