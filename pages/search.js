
import SearchWindow from '../components/SearchWindow'
import { getSession } from 'next-auth/react'

export default function Search() {

    return (
        <SearchWindow />
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