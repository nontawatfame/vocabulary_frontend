import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next'
import { redirect } from 'next/dist/server/api-utils'
import styles from '../styles/Home.module.css'
const Home: NextPage<any> = ({data}) => {
  return (
    <div className={styles.container}>
    </div>
  )
}

export async function getStaticProps(contexet: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  return {
    redirect: {
      permanent: false,
      destination: '/login',
    }
  }
}

export default Home
