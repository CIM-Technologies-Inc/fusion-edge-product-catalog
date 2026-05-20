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
                    <Link to="/shop" className='pr-6 text-sm font-medium hover:text-[#265bbd] hover:scale-110 transition-all duration-300 ease-in-out'>
                        Shop
                    </Link>
                    <VscAccount className="cursor-pointer text-2xl text-[#265bbd] hover:scale-125 transition-all duration-300 ease-in-out"/>
                </div>
            </div>
        </>
    )
}