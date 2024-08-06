import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext, UserContextType } from "../UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [redirect, setRedirect] = useState<boolean>(false);

  const context = useContext(UserContext);

  // Ensure context is defined and type cast it
  if (!context) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }

  const { setUser } = context as UserContextType;

  async function handleLoginSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      alert('Login successful');
      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64 p-16 border rounded-xl bg-white">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)} />
          <button className="primary font-bold">Sign In</button>
          <div className="text-center py-2 text-gray-500">
            Don't have an account yet? <Link className=" text-green-500 font-bold" to={'/register'}>Register now</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
