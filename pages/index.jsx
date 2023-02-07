
import HomeSections from '../components/HomeSections'
import { getSession } from 'next-auth/react'

export default function Home() {
  
    return (
        <HomeSections />
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