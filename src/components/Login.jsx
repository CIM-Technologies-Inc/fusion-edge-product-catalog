import Fusion from './Fusion';
import Footer from './Footer';
import { useScreen } from '../context/ScreenContext';

export default function Login() {
    const { isMobile } = useScreen();
    return (
        <div className="min-h-screen flex flex-col">

            <div className="grow pt-6 mb-14">

                <div className="pl-20 pr-20">
                    <Fusion />
                </div>

                <div className={` flex justify-center ${isMobile ? 'mt-12 md:mt-18 px-4' : 'mt-18'}`}>
                    <div className={`${isMobile ? 'w-full max-w-md' : ''}`}>

                        <div className="mb-6">
                            <label className="block tracking-wide text-gray-700 text-sm font-base mb-2">
                                Username or email address<span className="text-red-400 pl-1">*</span>
                            </label>

                            <input
                                className={`appearance-none block ${isMobile ? 'w-full' : 'w-110'} text-gray-300 border rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white`}
                            />
                        </div>

                        <div>
                            <label className="block tracking-wide text-gray-700 text-sm font-base mb-2">
                                Password<span className="text-red-400 pl-1">*</span>
                            </label>

                            <input
                                type="password"
                                className={`appearance-none block ${isMobile ? 'w-full' : 'w-110'} text-gray-300 border rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white`}
                            />
                        </div>

                        <div className="mt-8 flex items-center">
                            <input
                                type="checkbox"
                                className="w-4 h-4 accent-blue-500 mr-4"
                            />
                            <p className="block text-sm font-light text-gray-500">
                                Remember me.
                            </p>
                        </div>

                        <button className="cursor-pointer bg-[#2872fa] hover:bg-[#1864f1] p-2 mt-8 text-white w-full transition text-base">
                            Login
                        </button>
                        <span className='block mt-6 underline text-sm cursor-pointer text-blue-400 hover:text-blue-500'>Lost your password?</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />

        </div>
    );
}