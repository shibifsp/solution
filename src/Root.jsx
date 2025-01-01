import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <main className='flex'>
      <div className='w-full'>
        <Outlet />
      </div>
    </main>
  );
}