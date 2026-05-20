import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react"
import { items } from '../data/items.js';
import { PiBuildingsFill } from "react-icons/pi";
import { MdOutlineCategory, Md3dRotation, MdArrowBackIos } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { Link } from "react-router-dom"
import Fusion from './Fusion.jsx';
import noResult from '../assets/img/icons/noResult.png';
import Footer from './Footer.jsx';
import { useScreen } from '../context/ScreenContext';
import { div } from 'three/src/nodes/math/OperatorNode.js';
import Drawer from './Drawer';
import ButtonFloater from "./ButtonFloater";
import Breadcrumb from './BreadCrumb';

export default function Products() {
    const { isMobile } = useScreen();
    const { brand } = useParams();
    const location = useLocation();

    // const company = location.state?.company;
    const [currentCompany, setCurrentCompany] = useState(location.state?.company);

    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showViewer, setShowViewer] = useState(false);


    const filterByCategory = (cat) => {
        const filtered = items.filter((item) =>
            item.company === brand &&
            (cat.val === "all" || item.category === cat.val)
        );
        setFilteredItems(filtered);
        setSelectedCategory(cat);
    }
    
    useEffect(() => {
        if (brand) {
            let filtered = [];
            
            if(currentCompany?.filterBy != undefined) {
                filtered = items.filter((item) => item.company == brand && item.category == currentCompany.filterBy);
            } else {
                filtered = items.filter((item) => item.company == brand);
            }

            setFilteredItems(filtered);
        }
    }, [brand])

    return (
        <>
            <ButtonFloater />
            <div className={`${isMobile ? 'pt-2' : 'pt-6'} mb-14`}>
                <div className={`${isMobile ? 'pl-8 pr-8': 'pl-20 pr-20'}`}>
                    <Fusion />
                </div>
                <div className={`${isMobile ? 'pl-8 pr-8' : 'pl-20 pr-20'}`}>
                    <div className='mt-22'>
                        <Breadcrumb items={[{ label: 'Shop', to: '/shop' },{ label: currentCompany.name},]}/>
                            {/* <Link to="/shop" className="inline-block w-fit"> 
                                <div className='flex items-center hover:text-blue-500 hover:font-semibold'>
                                    <MdArrowBackIos className='mr-2 text-xs'/>
                                    <span className='text-xs'>BACK</span>
                                </div>
                            </Link> */}
                        <div className='mt-10 text-2xl font-bold text-gray-500'>
                            <div className='flex items-center mr-2'>
                                <PiBuildingsFill className='mr-2 text-[#2c539b]'/>
                                <h2 className='text-[#2c539b]'>{currentCompany.name}</h2>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-3items-center mt-10'>
                            <MdOutlineCategory className='mr-1 text-gray-500 text-lg mt-1'/>
                            <h1 className="text-xl text-gray-500 font-bold">Category </h1><small className='pl-1 font-extralight pt-1'> (Browse all building product categories)</small>
                        </div>

                        <div className='pl-4 mt-2 flex flex-wrap items-center gap-1'>
                            {currentCompany.category.map((category, cindx) => {
                                // const Icon = iconMap[category.val];
                                const iconSrc = new URL(`../assets/img/icons/${category.val}.png`,import.meta.url).href;

                                return (
                                <button
                                            key={`aaa-${cindx}`}
                                            onClick={() => {
                                                const { filterBy, ...updatedCompany } = currentCompany;
                                                setCurrentCompany(updatedCompany);
                                                setSelectedCategory(category);
                                                filterByCategory(category);
                                            }}
                                            className={`
                                                transition-all duration-300 ease-in-out
                                                cursor-pointer
                                                ${isMobile
                                                    ? `
                                                        p-4
                                                        mb-2
                                                        rounded-xl
                                                        shadow-lg
                                                        flex 
                                                        items-center 
                                                        w-full 
                                                        overflow-hidden
                                                        text-center
                                                        transition-all 
                                                        duration-300 
                                                        hover:-translate-x-4
                                                    `
                                                    : `
                                                        py-2 px-4
                                                        mt-2 mr-3
                                                        rounded-full
                                                        border border-gray-300
                                                        flex items-center gap-2
                                                        hover:scale-110
                                                    `
                                                }

                                                ${selectedCategory == category || (currentCompany?.filterBy && currentCompany.filterBy == category.val)
                                                    ? "bg-[#3b5fa1] text-white" 
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-[#1748a3]"
                                                }
                                            `}>
                                        {/* {Icon && <Icon className="text-sm" />}
                                        */}
                                        <img
                                            src={iconSrc}
                                            alt="No Image"
                                            className={`${isMobile ? 'w-15 h-15' : 'w-10 h-10'}`}
                                        />
                                        <span className={`min-w-0 wrap-break-words ${isMobile ? 'text-base pl-2' : 'text-sm'}`}>{category.text}</span>
                                    </button> 
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 
                        gap-x-4 sm:gap-x-6 lg:gap-x-10 
                        gap-y-8 sm:gap-y-12 lg:gap-y-16 
                        mt-8"> */}
                    <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-10 gap-y-16 mt-2">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((itm, itmndx) => (
                                <div
                                    key={itmndx}
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
                                        h-full">
                                    <Link
                                        to={`/shop/${brand}/${itm.name}`}
                                        state={{ item: itm, currentCompany}}
                                        // key={itmndx}
                                        className="flex flex-col grow">
                                        {/* <div className="cursor-pointer hover:shadow-xl p-3 sm:p-4 md:p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-lg"> */}
                                            <div className="bg-white flex items-center justify-center h-40 sm:h-48 md:h-52">
                                                <img
                                                    src={itm.src}
                                                    alt={itm.name}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                            <h3 className="text-base font-medium leading-snug text-slate-800 hover:text-blue-500">
                                                {itm.name}
                                            </h3>

                                            <p className="mt-3 uppercase text-xs hover:text-blue-500">
                                                {itm.category}
                                            </p>
                                        {/* </div> */}
                                    </Link>
                                    <div className='mt-4'>
                                        <button onClick={() => {
                                            
                                            if(itm) {
                                                setSelectedDetails(itm.files || []);
                                            } else {
                                                setSelectedDetails([]);
                                            }
      
                                            setShowDrawer(true);
                                            setSelectedProduct(itm);
                                        }} className='mt-auto cursor-pointer bg-[#2c539b] hover:bg-[#073998] p-2 rounded text-white w-full transition text-sm'>
                                            Download
                                        </button>   
                                    </div>
                                </div>
                            ))
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
                        )}
                    </div>
                </div>
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
            <Footer />
        </>
    )
}