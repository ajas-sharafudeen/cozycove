import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate, useParams } from "react-router";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

interface User {
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  ready: boolean;
}

export default function ProfilePage() {
  const [redirect, setRedirect] = useState<string | null>(null);
  const { ready, user, setUser } = useContext(UserContext) as UserContextType;

  let { subpage } = useParams<{ subpage?: string }>();

  if (subpage === undefined) {
    subpage = 'profile'
  }

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && user && (
        <div className="h-24 text-center text-black bg-white rounded-md max-w-lg mx-auto">
          <div className="text-2xl py-2">
            <div>Username: <span className="text-green-500">{user.name}</span></div>
            <div>Email: <span className="text-green-500">{user.email}</span></div>
          </div>
          <button onClick={logout} className="warning max-w-xm font-semibold">Sign Out</button>
        </div>
      )}
      {subpage === 'places' && (
        <PlacesPage />
      )}
    </div>
  );
}
