import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from "react"
import { items } from '../data/items.js';
import { PiBuildingsFill } from "react-icons/pi";
import { MdOutlineCategory, Md3dRotation, MdArrowBackIos } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { FaAngleRight, FaAngleLeft} from "react-icons/fa";
import { Link } from "react-router-dom"
import { useScreen } from '../context/ScreenContext';
import { div } from 'three/src/nodes/math/OperatorNode.js';
import { companies } from '../data/companies';
import noResult from '../assets/img/icons/noResult.png';
import Fusion from './Fusion.jsx';
import Drawer from './Drawer';
import ButtonFloater from "./ButtonFloater";
import Breadcrumb from './BreadCrumb';
import Items from './Items'
import Footer from './Footer.jsx';
import { category} from '../data/category';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { style } from 'framer-motion/client';


export default function Products() {
    const { isMobile } = useScreen();
    const { cat } = useParams();
    const location = useLocation();
    const ctgry = location.state?.cat;
    const [currentCategory, setCurrentCategory] = useState(location.state?.cat);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    // const filteredCompany = companies.filter(f => f.id != currentCompany.id);
    const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
    const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(false);
    const categorySliderRef = useRef(null);

    const updateCategoryArrows = () => {
        const slider = categorySliderRef.current;

        if (!slider) return;

        const hasOverflow = slider.scrollWidth > slider.clientWidth;

        if (!hasOverflow) {
            setCanScrollCategoryLeft(false);
            setCanScrollCategoryRight(false);
            return;
        }

        setCanScrollCategoryLeft(slider.scrollLeft > 0);

        setCanScrollCategoryRight(
            slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1
        );
    };
    
    useEffect(() => {
        const slider = categorySliderRef.current;

        if (!slider) return;

        updateCategoryArrows();

        slider.addEventListener("scroll", updateCategoryArrows);
        window.addEventListener("resize", updateCategoryArrows);

        return () => {
            slider.removeEventListener("scroll", updateCategoryArrows);
            window.removeEventListener("resize", updateCategoryArrows);
        };
    }, []);

    const filterByCategory = (ctgry) => {
        const filtered = items.filter((item) =>
            item.category == ctgry?.val || ctgry?.val == "all" 
        );
        setFilteredItems(filtered);
        setSelectedCategory(ctgry?.val);
    }
    
    useEffect(() => {
        if (ctgry?.val) {
            let filtered = [];

            if(ctgry?.val != "all") {
                filtered = items.filter((item) => item.category == ctgry?.val);
            } else {
                filtered = items;
            }
            // console.log(ctgry);
            // console.log(filtered);
            setSelectedCategory(ctgry?.val);
            setFilteredItems(filtered);
        }
    }, [cat])

    const scroll = (ref, direction) => {
        const container = ref.current;

        if (!container) return;

        container.scrollBy({
            left: direction === "left" ? -300 : 300,
            behavior: "smooth",
        });
    };

    return (
        <>
            <ButtonFloater page={{
                ...location,
                showCompanyButton: true,
                // companies: filteredCompany
            }}/>
            <div className="min-h-screen flex flex-col">
                <div className="flex-1">
                    <div className={`${isMobile ? 'pt-2' : 'pt-6'} mb-14`}>
                        <div className={`${isMobile ? 'pl-8 pr-8': 'pl-40 pr-40'}`}>
                            <Fusion />
                        </div>
                        <div className={`${isMobile ? 'pl-8 pr-8': 'pl-40 pr-40'}`}>
                             <h1 className={`${isMobile ? 'text-md pt-4' : 'text-xl pt-6 mb-2'} font-semibold`}>TOP BRANDS</h1>
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                spaceBetween={20}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                pagination={{ clickable: true }}
                                navigation>
                                    {companies.map((com, ccindx) => {
                                        const imgSrc = new URL(
                                        `../assets/img/banner/${com.val}.png`,
                                        import.meta.url
                                        ).href;

                                        return (
                                        <SwiperSlide key={`aaa-${ccindx}`}>
                                            <img
                                            src={imgSrc}
                                            alt={com.name}
                                            className="w-full h-40 object-contain rounded-xl"
                                            />
                                        </SwiperSlide>
                                        );
                                    })}
                            </Swiper>
                        </div>
                        <div className={`${isMobile ? 'pl-8 pr-8' : 'pl-40 pr-40'}`}>
                            <div className='mt-22'>
                                <Breadcrumb items={[{ label: 'Shop', to: '/shop' },{ label: currentCategory.text},]}/>
                                    {/* <Link to="/shop" className="inline-block w-fit"> 
                                        <div className='flex items-center hover:text-blue-500 hover:font-semibold'>
                                            <MdArrowBackIos className='mr-2 text-xs'/>
                                            <span className='text-xs'>BACK</span>
                                        </div>
                                    </Link> */}

                                <h1 className={`${isMobile ? 'text-xl pt-4' : 'text-3xl pt-8'} font-bold`}>Category</h1>
                                
                                <div className="flex flex-wrap items-center mt-2">
                                    {canScrollCategoryLeft && (
                                        <button
                                            onClick={() => scroll(categorySliderRef, "left")}
                                            className={`shrink-0 ${!isMobile ? 'p-3' : 'p-1'}`}>
                                            <FaAngleLeft className="text-2xl cursor-pointer" />
                                        </button>
                                    )}

                                    <div
                                        ref={categorySliderRef}
                                        className={`
                                        ${!isMobile ? 'py-6 gap-4' : 'py-4 gap-3'}
                                        flex
                                        overflow-x-hidden
                                        scroll-smooth
                                        flex-1`}>
                                        {category.map((category, cindx) => {
                                            const iconSrc = new URL(`../assets/img/icons/${category.val}.png`,import.meta.url).href;

                                            return(    
                                                <div
                                                    key={cindx}
                                                    onClick={() => {
                                                        const { filterBy, ...updatedCategory } = currentCategory;
                                                        setCurrentCategory(updatedCategory);
                                                        setSelectedCategory(category.val);
                                                        filterByCategory(category);
                                                    }}
                                                    className={`
                                                    ${isMobile ? "w-29 h-29" : "w-35 h-35"}
                                                    shadow-lg
                                                    flex
                                                    flex-col
                                                    justify-center
                                                    items-center
                                                    rounded-xl
                                                    transition-all
                                                    duration-300
                                                    flex-shrink-0
                    
                                                    ${
                                                        selectedCategory == category.val
                                                            ? "bg-blue-400 text-white scale-95 cursor-default"
                                                            : "bg-white shadow-lg hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                                                    }
                                                `}>
                                                    <img
                                                        src={iconSrc}
                                                        alt={category.text}
                                                        className="w-12 h-12 object-contain"
                                                    />
                    
                                                    <h2 className="mt-1 text-sm font-medium text-center">
                                                        {category.text}
                                                    </h2>
                                                </div>
                                                )
                                            }
                                        )}
                                    </div>

                                    {canScrollCategoryRight && (
                                        <button
                                            onClick={() => scroll(categorySliderRef, "right")}
                                            className={`
                                                shrink-0
                                                cursor-pointer
                                                ${!isMobile ? 'p-3' : 'p-1'}`}>
                                            <FaAngleRight className="text-2xl" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <Items filteredItems={filteredItems}/>  
                        </div>
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
