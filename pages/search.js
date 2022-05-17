
import Head from 'next/head'

import Sidebar from '../components/Sidebar'
import SearchWindow from '../components/SearchWindow'
import Player from '../components/Player'
import { getSession } from 'next-auth/react'

export default function Search() {


    return (
        <div className='bg-black h-screen overflow-hidden'>
        <Head>
            <title>Spotify Clone</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='flex'>
            <Sidebar />
            <SearchWindow />
        </main>

        <div className="sticky bottom-0">
            <Player />
        </div>

        </div>
    )
}



export async function getServerSideProps(context){
  const session = await getSession(context)

  return {
    props:{
      session
    }
  }
}