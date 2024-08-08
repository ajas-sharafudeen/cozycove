import Header from './Header';
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className='flex flex-col min-h-screen py-6 px-8'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
    </div>
  );
}
