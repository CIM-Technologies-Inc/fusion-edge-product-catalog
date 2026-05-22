import fusion from '../assets/img/Fusion-Edge-Logo-3.png';
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";

export default function Fusion() {
    return (
        <>
            <div className='text-3xl flex items-center justify-between mt-4'>
                <Link to='/'>
                    <img src={fusion} alt="Logo" className="w-40 sm:w-80 h-auto cursor-pointer"/>
                </Link>
                <div className='flex items-center'>
                    <Link to="/shop" className='pr-6 text-sm font-medium hover:scale-115 transition-all duration-300 ease-in-out'>
                        Shop
                    </Link>
                    <button className='rounded-full border-2 p-1 border-gray-100 hover:border-gray-200 cursor-pointer hover:scale-125 transition-all duration-300 ease-in-out'>
                        <img src="/myaccount.svg" className='w-6 h-6'/>
                    </button>
                    {/* <VscAccount className="cursor-pointer text-2xl text-[#265bbd] hover:scale-125 transition-all duration-300 ease-in-out"/> */}
                </div>
                
            </div>
        </>
    )
}