
import SearchTerm from '../../components/SearchTerm'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'

function searchTerm() {

    const router = useRouter()
    const { searchTerm } = router.query

    return (
      <SearchTerm term={searchTerm} />
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