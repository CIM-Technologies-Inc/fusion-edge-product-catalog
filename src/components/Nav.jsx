import { useState } from 'react';
import { Link } from "react-router-dom"
import fusion from '../assets/img/Fusion-Edge-Logo-3.png'
// import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { VscAccount } from "react-icons/vsc";
import { useScreen } from '../context/ScreenContext';

export default function Nav() {
  const { isMobile } = useScreen();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <div className="p-4 sm:p-10 flex items-center justify-between pt-6">
        <Link to='/'>
            <img src={fusion} alt="Logo" className="w-40 sm:w-80 h-auto cursor-pointer"/>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className='text-sm font-medium hover:text-[#265bbd] hover:scale-125 transition-all duration-300 ease-in-out'>
                Login
            </Link>

            <Link to="/shop" className='text-sm font-medium hover:text-[#265bbd] hover:scale-125 transition-all duration-300 ease-in-out'>
                Shop
            </Link>

            <VscAccount className="cursor-pointer text-2xl hover:text-[#265bbd] hover:scale-125 transition-all duration-300 ease-in-out"/>
        </div>

        {/* Burger Icon (Mobile Only) */}
        <button
            className="md:hidden text-2xl"
            onClick={() => setOpenMenu(true)}>
            <GiHamburgerMenu />
        </button>
      </div>
      {/* Overlay */}
    {openMenu && (
      <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpenMenu(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
          fixed top-0 right-0 h-full ${ isMobile ? 'w-50' : 'w-105'} bg-gray-800 text-white z-50 shadow-lg
          transform transition-transform duration-300
          ${openMenu ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 flex justify-end items-center">
          <button onClick={() => setOpenMenu(false)} className="text-2xl cursor-pointer">
              ×
          </button>
        </div>

        <div className="flex flex-col p-5 gap-5">
          <Link
            to="/account"
            onClick={() => setOpenMenu(false)}
            className="text-sm font-medium hover:text-blue-600">
            <span className='text-xl font-semibold'>My Account</span>
          </Link>
          <Link
            to="/shop"
            onClick={() => setOpenMenu(false)}
            className="text-sm font-medium hover:text-blue-600">
              <span className='text-xl font-semibold'>Shop</span>
          </Link>
          
          <div className="flex items-center gap-2 cursor-pointer hover:text-blue-600">
            <span className="text-xl">Search</span>
          </div>

          <Link
            to="/login"
            onClick={() => setOpenMenu(false)}
            className="text-sm font-medium hover:text-blue-600">
            <span className='text-xl font-semibold'>Login</span>
          </Link>
        </div>
      </div>
    </>
  )
}