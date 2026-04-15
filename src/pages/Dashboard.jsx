import React, { useState } from 'react'
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import Sidebar from '../components/core/Dashboard/Sidebar'
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx"
const Dashboard = () => {
    const {loading:authLoading} = useSelector((state)=>state.auth)
    const {loading:profileLoading} = useSelector((state)=>state.profile)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    if (profileLoading || authLoading) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)]">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[950] bg-black/40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-14 z-[1000] h-[calc(100vh-3.5rem)] transition-transform duration-200 md:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
      </div>

      <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
        <div className="mx-auto w-11/12 max-w-[1000px] py-6 md:py-10">
          <button
            className="mb-5 inline-flex items-center gap-2 rounded-md border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-50 md:hidden"
            onClick={() => setMobileSidebarOpen((prev) => !prev)}
          >
            {mobileSidebarOpen ? <RxCross2 size={18} /> : <RxHamburgerMenu size={18} />}
            Menu
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard