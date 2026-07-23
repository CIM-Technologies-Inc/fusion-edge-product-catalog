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
import { motion, AnimatePresence } from "framer-motion";
import Swal from 'sweetalert2'

export default function Items({filteredItems, loading = false}) {
    const [showDrawer, setShowDrawer] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const { isMobile } = useScreen();
    // const filteredBrand = [...new Map(filteredItems.map(item => [item.Store, item])).values()];
    // console.log(filteredBrand);
    // console.log(filteredItems);
    // console.log('----------');
    return (
        <>
            <div className="mb-6 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-x-10 gap-y-12 mt-2">
                <AnimatePresence mode="popLayout">
                    {
                        loading ? (
                            [...Array(8)].map((_, index) => (
                                <div
                                    key={index}
                                    className={`
                                        ${!isMobile ? "pl-4 pr-4 p-6" : ""}
                                    `}
                                >
                                    {/* Image */}
                                    <div className="h-40 lg:h-74 rounded-lg bg-gray-200 animate-pulse" />

                                    {/* Product Name */}
                                    <div className="mt-4 h-5 w-3/4 rounded bg-gray-200 animate-pulse" />

                                    {/* Brand */}
                                    <div className="mt-3 h-4 w-1/2 rounded bg-gray-200 animate-pulse" />

                                    {/* Finish */}
                                    <div className="mt-2 h-3 w-1/3 rounded bg-gray-200 animate-pulse" />
                                </div>
                            ))
                        ) : filteredItems.length > 0 ? (
                            filteredItems.map((item, indx) => {
                                const company = companies.filter(f => f.val == item.brand)[0];
                                // console.log(filteredItems);
                                return (
                                    <motion.div
                                        key={indx}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.25 }}
                                        className={`
                                            cursor-pointer
                                            ${!isMobile ? 'pl-4 pr-4 p-6' : ''}
                                            rounded-lg
                                            transition-all
                                            duration-200
                                            hover:-translate-y-1
                                            flex
                                            flex-col
                                            h-full`}
                                        >
                                        <Link
                                            // to={item.brand ? `/shop/${item.brand}/${item.product_name}` : "#"}
                                            to={`/shop/${item.brand || 'product'}/${item.product_name}`}
                                            state={{ item: item, brands: filteredItems }}
                                            className="flex flex-col grow"
                                            onClick={() => {
                                                if (!item.brand) {
                                                    e.preventDefault();

                                                    // Show notification here
                                                    Swal.fire({
                                                        title: 'Warning!',
                                                        text: "This product doesn't have a brand!",
                                                        icon: 'warning',
                                                        confirmButtonText: 'OK'
                                                    })
                                                    // alert("This product doesn't have a brand.");
                                                    return;
                                                }

                                                window.scrollTo({
                                                    top: 0,
                                                    behavior: "smooth",
                                                });
                                            }}>
                                            <div className=" bg-white
                                                flex
                                                items-center
                                                justify-centerS
                                                h-40
                                                md:h-56S
                                                lg:h-74
                                                overflow-hidden">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.product_name}
                                                    className="w-70 h-70 object-contain"/>
                                            </div>
                                            {/* <h3 className="text-base font-medium leading-snug text-slate-800 hover:text-blue-500">
                                                {item.product_name}
                                            </h3> */}
                                            <div className="relative group">
                                                <h3 className="text-base font-medium leading-snug text-slate-800 hover:text-blue-500">
                                                    {isMobile && item.product_name?.length > 9
                                                        ? `${item.product_name.slice(0, 9)}...`
                                                        : item.product_name}
                                                </h3>

                                                {isMobile && (
                                                    <div className="
                                                        absolute
                                                        left-1/2
                                                        -translate-x-1/2
                                                        bottom-full
                                                        mb-2
                                                        hidden
                                                        group-hover:block
                                                        whitespace-nowrap
                                                        rounded-md
                                                        bg-blue-400
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        text-white
                                                        shadow-lg
                                                        z-50">
                                                        {item.product_name}
                                                    </div>
                                                )}
                                            </div>
                                            <p className={`${isMobile ? 'mt-1' : 'mt-3'} font-semibold`}><small className='uppercase text-[#2c539b]'>{item.brand}</small></p>
                                            <p className={`${isMobile ? 'mt-1' : 'mt-3'} uppercase text-xs text-[#2c539b] font-semibold`}>
                                                {item.finish}
                                            </p>
                                        </Link>
                                        {/* <div className='mt-4'>
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
                                        </div> */}
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.25 }}
                                className="col-span-full flex flex-col justify-center items-center pt-10">
                                <img
                                    src={noResult}
                                    alt="No Image"
                                    className="w-40 h-40"/>

                                <h1 className="text-sm font-semibold text-gray-400 text-center mt-4">
                                    No Product Found!
                                </h1>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
   

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