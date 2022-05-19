import type { NextPage } from 'next'

import Playlist from '../components/Playlist'
import { getSession } from 'next-auth/react'

const Home: NextPage = () => {

  return (
        <Playlist />
  )
}

export default Home


export async function getServerSideProps(context: any){
  const session = await getSession(context)

  return {
    props:{
      session
    }
  }
}