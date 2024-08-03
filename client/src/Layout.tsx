import Header from './Header'
import { Outlet } from "react-router";

export default function Layout() {
  return(
    <div className='py-6 px-8 flex flex-col min-h-screen'>
      <Header />
      <Outlet />
    </div>
  )
}