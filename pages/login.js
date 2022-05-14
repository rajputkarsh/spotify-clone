import { getProviders, signIn } from "next-auth/react"
import { redirect } from "next/dist/server/api-utils"

function Login( { providers } ) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img className="w-52 mb-5" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png" alt="" />

      { 
        Object.values(providers).map((provider) => (
          <div key={provider.name} onClick={() => { signIn(provider.id, {callbackUrl: "/"}) }}>
            <button className="bg-[#18D860] text-white p-5 rounded-lg">Login with {provider.name}</button>
          </div>
        ))
      }

    </div>
  )
}

export default Login

export async function getServerSideProps(){
  const providers = await getProviders()

  return {
    props: {
      providers
    }
  }
}