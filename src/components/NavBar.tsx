import { signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router"

function AuthButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <>
        <button className="button" onClick={() => signOut()}><span>Wyloguj się</span></button>
      </>
    )
  }

  return (
    <>
      <button className="button" onClick={() => signIn()}><span>Zaloguj się</span></button>
    </>
  )
}

function AdminPanelButton() {
  const { data: session } = useSession()
  const router = useRouter()

  if (session?.user.isAdmin) {
    return (
      <>
        <button className="button" onClick={() => router.push("/admin")}><span>Panel admina</span></button>
      </>
    )
  }

  return (
    <></>
  )
}

export default function NavBar() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <nav className="navbar">
      <span className="logo" onClick={() => router.push("/")}>
        Wydarzenia
      </span>

      <div className="profile">
        {session && <span>
          Zalogowano jako {session?.user?.username}
        </span>}
        <AdminPanelButton />
        <AuthButton />
      </div>
    </nav>
  )
}