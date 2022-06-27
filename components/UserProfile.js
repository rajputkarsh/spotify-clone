
import { useSession, signOut } from "next-auth/react"
import { ChevronDownIcon } from "@heroicons/react/outline"

function UserProfile() {

    const {data: session, status} = useSession();

    return (
    <header className="absolute top-5 right-8  z-10">
        <div onClick={signOut} className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
            <img className="rounded-full w-10 h-10" src={session?.user?.image ?? "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"} alt="" />
            <h2>{ session?.user?.name }</h2>
            <ChevronDownIcon className="h-5 w-5" />
        </div>
    </header>
  )
}

export default UserProfile
