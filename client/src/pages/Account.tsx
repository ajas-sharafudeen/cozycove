import { useContext } from "react"
import { UserContext } from "../UserContext"
import { Navigate } from "react-router"

export default function AccountPage() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { ready, user } = useContext(UserContext)

  if(!ready) {
    return 'Loading...'
  }

  if (ready && !user) {
    return <Navigate to={'/login'} />
  }

  return (
    <div>account page for {user.name}</div>
  )
}