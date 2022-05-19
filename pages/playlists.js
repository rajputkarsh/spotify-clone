
import Library from '../components/Library'
import { getSession } from 'next-auth/react'

export default function Playlists() {
  
    return (
        <Library />
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