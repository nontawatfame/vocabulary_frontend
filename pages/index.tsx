import type { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next'
import { redirect } from 'next/dist/server/api-utils'
import styles from '../styles/Home.module.css'
const Home: NextPage<any> = ({data}) => {

  return (
    <div className={styles.container}>
      serfiseofjsdf
    </div>
  )
}

export async function getStaticProps(contexet: GetStaticPropsContext): Promise<GetStaticPropsResult<any>> {
  console.log(process.env.NEXT_PUBLIC_URL)
  return {
      props: {
      }
  }
}

export default Home
