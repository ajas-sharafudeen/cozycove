import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Navigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import axios from "axios"
import PlacesPage from "./PlacesPage"
import AccountNav from "../AccountNav"

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ready, user, setUser } = useContext(UserContext)

  // eslint-disable-next-line react-hooks/rules-of-hooks
  let { subpage } = useParams()
  if (subpage === undefined) {
    subpage = 'profile'
  }

  async function logout() {
    await axios.post('/logout')
    setRedirect('/')
    setUser(null)
  }

  if (!ready) {
    return 'Loading...'
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }

  

  if (redirect) {
    return <Navigate to={redirect} />
  }
  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  )
}