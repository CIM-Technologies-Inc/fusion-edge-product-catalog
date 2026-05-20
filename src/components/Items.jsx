import { useState } from 'react';
import { Link } from "react-router-dom";
import { companies } from '../data/companies';
import { IoCloseSharp } from "react-icons/io5";
import { Md3dRotation } from "react-icons/md";
import { useScreen } from '../context/ScreenContext';
import noResult from '../assets/img/icons/noResult.png';
import revit from '../assets/img/icons/revit.svg';
import sketch from '../assets/img/icons/sketch.svg';
import autocad from '../assets/img/icons/autocad.svg';
import Drawer from './Drawer';

export default function Items({filteredItems}) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const { isMobile } = useScreen();

    return (
        <>
            <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-10 gap-y-16 mt-2">
                {
                    filteredItems.length > 0 ? (
                        filteredItems.map((item, indx) => {
                        const company = companies.filter(f => f.id == item.companyID)[0];

                        return (
                            <div
                                key={indx}
                                className="
                                    cursor-pointer
                                    pl-4
                                    pr-4
                                    p-6
                                    rounded-lg
                                    hover:shadow-2xl
                                    transition-all
                                    duration-200
                                    hover:-translate-y-2
                                    flex
                                    flex-col
                                    h-full"
                                    onClick={() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth"
                                        });
                                    }}>
                                <Link
                                    to={`/shop/${item.company}/${item.name}`}
                                    state={{ item: item, currentCompany: company }}
                                    className="flex flex-col grow">
                                    <div className="bg-white flex items-center justify-center h-52">
                                        <img
                                            src={item.src}
                                            alt={item.name}
                                            className="w-full h-full object-contain"/>
                                    </div>
                                    <h3 className="text-base font-medium leading-snug text-slate-800 hover:text-blue-500">
                                        {item.name}
                                    </h3>
                                    <p className='mt-3 font-semibold'><small className='uppercase text-[#2c539b]'>{item.company}</small></p>
                                    <p className="mt-3 uppercase text-xs hover:text-blue-500">
                                        {item.category}
                                    </p>
                                </Link>
                                <div className='mt-4'>
                                    <button onClick={() => {
                                        if(item.hasOwnProperty('files')) {
                                            setSelectedDetails(item.files);
                                        } else {
                                            setSelectedDetails([]);
                                        }

                                        setShowDrawer(true);
                                        setSelectedProduct(item);
                                        }} className='mt-auto cursor-pointer bg-[#2c539b] hover:bg-[#073998] p-2 rounded text-white w-full transition text-sm'>
                                        Download
                                    </button>
                                </div>
                            </div>
                        );
                    })
                    ) : (
                        <div className="col-span-full flex flex-col justify-center items-center pt-10">
                            <img
                                src={noResult}
                                alt="No Image"
                                className="w-40 h-40"/>

                            <h1 className="text-sm font-semibold text-gray-400 text-center mt-4">
                                No Product Found!
                            </h1>
                        </div>
                    )
                    
                }
            </div>
            {/* <div className="flex justify-between flex-wrap mt-6 gap-4">
                {items.map((item, indx) => (
                    <div className='cursor-pointer w-40'>
                        <img
                            src={item.src}
                            alt={item.name}
                            className="w-full h-40 object-contain"
                        />
                        <span className='block text-center pt-6'>{item.name}</span>
                        <p className='text-center pt-4 uppercase text-xs'>{item.category}</p>
                    </div>
                ))}
            </div> */}

            {/* DRAWER */}
            <Drawer
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                showViewer={showViewer}
                setShowViewer={setShowViewer}
                selectedProduct={selectedProduct}
                selectedDetails={selectedDetails}
            />
        </>
    )
}