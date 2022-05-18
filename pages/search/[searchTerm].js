
import Head from 'next/head'

import Sidebar from '../../components/Sidebar'
import SearchTerm from '../../components/SearchTerm'
import Player from '../../components/Player'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function searchTerm() {

    const router = useRouter()
    const { searchTerm } = router.query

    return (
      <div className='bg-black h-screen overflow-hidden'>
      <Head>
          <title>Spotify Clone</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='flex'>
          <Sidebar />
          <SearchTerm term={searchTerm} />
      </main>

      <div className="sticky bottom-0">
          <Player />
      </div>

      </div>
  )
}

export default searchTerm


export async function getServerSideProps(context){
  const session = await getSession(context)

  return {
    props:{
      session
    }
  }
}