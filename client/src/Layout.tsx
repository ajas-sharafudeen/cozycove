import Header from './Header'
import { Outlet } from "react-router";

export default function Layout() {
  return(
    <div className='p-4'>
      <Header />
      <Outlet />
    </div>
  )
}