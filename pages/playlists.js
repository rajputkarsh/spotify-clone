
import Head from 'next/head'

import Sidebar from '../components/Sidebar'
import Library from '../components/Library'
import Player from '../components/Player'
import { getSession } from 'next-auth/react'

export default function Playlists() {

    

    return (
        <div className='bg-black h-screen overflow-hidden'>
        <Head>
            <title>Spotify Clone</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className='flex'>
            <Sidebar />
            <Library />
        </main>

        <div className="sticky bottom-0">
            {/* <Player /> */}
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