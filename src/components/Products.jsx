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
import { supabase } from "./supabase";

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
    const filteredCompany = companies.filter(f => f.id != currentCompany.id);
    const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
    const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(false);
    const categorySliderRef = useRef(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

  
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
        async function fetchData() {
            setIsLoading(true);
            const result = await supabase
                .from("product")
                .select("*");

            const dt = result.data.filter(f => f.brand == currentCompany.val);
  
            setFilteredItems(dt);
            setIsLoading(false);
        }

        fetchData();
    }, []);

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

    const filterByCategory = (cat) => {
        const filtered = items.filter((item) =>
            item.company === brand &&
            (cat.val === "all" || item.category === cat.val)
        );
        setFilteredItems(filtered);
        setSelectedCategory(cat.val);
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
                companies: filteredCompany
            }}/>
            <div className="min-h-screen flex flex-col">
                <div className="flex-1">
                    <div className={`${isMobile ? 'pt-2' : 'pt-6'} mb-14`}>
                        <div className={`${isMobile ? 'pl-8 pr-8': 'pl-40 pr-40'}`}>
                            <Fusion />
                        </div>
                        <div className={`${isMobile ? 'pl-8 pr-8' : 'pl-40 pr-40'}`}>
                            <div className='mt-12'>
                                <Breadcrumb items={[{ label: 'Shop', to: '/shop' },{ label: currentCompany.product_name},]}/>
                                    {/* <Link to="/shop" className="inline-block w-fit"> 
                                        <div className='flex items-center hover:text-blue-500 hover:font-semibold'>
                                            <MdArrowBackIos className='mr-2 text-xs'/>
                                            <span className='text-xs'>BACK</span>
                                        </div>
                                    </Link> */}
                                {!isMobile ? (
                                    <div className="mt-10 text-2xl font-bold text-gray-500">
                                        <div className="flex items-center mr-2">
                                            <PiBuildingsFill className="mr-2 text-[#2c539b]" />
                                            <h2 className="text-[#2c539b]">{currentCompany.product_name}</h2>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='mt-4 w-full'>
                                        <img
                                            src={new URL(`../assets/img/banner/${currentCompany.val}.png`, import.meta.url).href}
                                            alt={currentCompany.product_name}
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                )}
                                <div className='flex flex-wrap gap-3items-center mt-10'>
                                    <MdOutlineCategory className='mr-1 text-gray-500 text-lg mt-1'/>
                                    <h1 className="text-xl text-gray-500 font-bold">Category </h1><small className='pl-1 font-extralight pt-1'> (Browse all building product categories)</small>
                                </div>
                                
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
                                        {currentCompany.category.map((category, cindx) => {
                                            const iconSrc = new URL(`../assets/img/icons/${category.val}.png`,import.meta.url).href;

                                            return(    
                                                <div
                                                    key={cindx}
                                                    onClick={() => {
                                                        const { filterBy, ...updatedCompany } = currentCompany;
                                                        setCurrentCompany(updatedCompany);
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
                            {
                                isLoading ? (
                                    <div className="flex space-x-2 justify-center items-center h-50">
                                        <div className="w-5 h-5 bg-[#2c539b] rounded-full animate-bounce"></div>
                                        <div
                                            className="w-5 h-5 bg-[#2c539b] rounded-full animate-bounce"
                                            style={{ animationDelay: "0.1s" }}> 
                                                
                                            </div>
                                        <div
                                            className="w-5 h-5 bg-[#2c539b] rounded-full animate-bounce"
                                            style={{ animationDelay: "0.3s" }}>
                                        </div>
                                    </div>
                                ) : (
                                    <Items filteredItems={filteredItems}/>  
                                )
                            }
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