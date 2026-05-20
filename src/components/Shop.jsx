import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { TiHome } from "react-icons/ti";
import { MdKeyboardArrowRight } from "react-icons/md";
import Items from './Items'
import { items } from '../data/items';
import { companies } from '../data/companies';
import Products from "./Products";
import { useScreen } from '../context/ScreenContext';
import { IoSearch, IoChevronBack, IoChevronForward } from "react-icons/io5";
import ButtonFloater from "./ButtonFloater";
import Breadcrumb from './BreadCrumb';

export default function Shop() {
    const { isMobile } = useScreen();
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [isAll, setIsAll] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);
    const sliderRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);

    const handleSearchClick = () => {
        setShowSearch(true);

        setTimeout(() => {
            inputRef.current?.focus();
        }, 200);
    };

    const scroll = (direction) => {
        const container = sliderRef.current;

        if (!container) return;

        const scrollAmount = 300;

        container.scrollBy({
            left: direction === "left"
                ? -scrollAmount
                : scrollAmount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const checkOverflow = () => {
            const slider = sliderRef.current;

            if (slider) {
                setShowArrows(
                    slider.scrollWidth > slider.clientWidth
                );
            }
        };

        checkOverflow();

        window.addEventListener("resize", checkOverflow);

        return () => {
            window.removeEventListener("resize", checkOverflow);
        };
    }, [companies]);

    const categories = [
        {text: 'All', val: 'all'},
        {text: 'Flooring', val: 'flooring'},
        {text: 'Furniture', val: 'furniture'},
        // {text: 'Tiles', val: 'tiles'}
    ]

    const selectCompany = (company) => {
        setSelectedCompany(company);
        setIsAll(false);

        // GET ITEM LENGTH BASED ON COMPANY ID
        const len = items.filter(f => f.companyID == company.id);
    }

    const filteredItems = items.filter((item) => {
        const searchValue = search.toLowerCase();

        return (
            item.name.toLowerCase().includes(searchValue) ||
            item.category.toLowerCase().includes(searchValue) ||
            item.company.toLowerCase().includes(searchValue)
        );
    });

    return (
        <>
            <ButtonFloater />
            <Breadcrumb items={[{ label: 'Shop'}]}/>
            {/* <div className="flex">
                <Link to="/">
                    <TiHome className="cursor-pointer text-lg font-medium text-blue-600 transition mr-2"/>
                </Link>
                <MdKeyboardArrowRight className="text-sm mt-1 font-medium mr-2"/>
                <span className="text-xs mt-0.5">SHOP</span>
            </div> */}
            
            <h1 className="text-3xl font-semibold pt-10">Company</h1>
          
            <div className="flex items-center gap-4">
                {showArrows && (
                    <button
                        onClick={() => scroll("left")}
                        className={`shrink-0 ${!isMobile ? 'p-3' : 'p-1'}`}>
                        <IoChevronBack className="text-2xl cursor-pointer" />
                    </button>
                )}
                <div
                    ref={sliderRef}
                    className="
                    py-6
                    px-2
                    flex
                    gap-6
                    overflow-x-hidden
                    scroll-smooth
                    flex-1">
                    {companies.map((company, ccindx) => (
                        <Link
                            key={`bbb-${ccindx}`}
                            to={`/shop/${company.val}`}
                            state={{ company }}
                            className="shrink-0">
                            <div
                                onClick={() => selectCompany(company)}
                                className={`
                                    ${!isMobile ? 'p-6 w-52' : ''}
                                    shadow-lg
                                    cursor-pointer
                                    mt-6
                                    bg-white
                                    rounded-xl
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:shadow-xl`}>
                                <img
                                    src={company.src}
                                    alt={company.name}
                                    className="w-full h-25 object-contain"
                                />
                                {
                                    !isMobile && (
                                        <h2 className="text-xl text-center font-bold mt-2">
                                            {company.name}
                                        </h2>
                                    )
                                }
                            </div>
                        </Link>
                    ))}
                </div>

                {showArrows && (
                    <button
                        onClick={() => scroll("right")}
                        className={`
                            shrink-0
                            cursor-pointer
                            ${!isMobile ? 'p-3' : 'p-1'}`}>
                        <IoChevronForward className="text-2xl" />
                    </button>
                )}
            </div>

            {/* <div className={`flex flex-wrap ${isMobile ? "justify-center" : ""} gap-6`}>
                {companies.map((company, ccindx) => (
                    <Link to={`/shop/${company.val}`} state={{ company }} key={`bbb-${ccindx}`}>
                        <div className="p-6 
                                        shadow-lg 
                                        cursor-pointer 
                                        mt-6 w-50 
                                        bg-white 
                                        rounded-xl 
                                        transition-all 
                                        duration-300 
                                        hover:-translate-y-2 
                                        hover:shadow-2xl"
                            onClick={() => selectCompany(company)}>
                            <img
                                src={company.src}
                                alt={company.name}
                                className="w-full h-25 object-contain"
                            />
                            <h2 className="text-xl text-center font-bold mt-2">
                                {company.name}
                            </h2>
                        </div>
                    </Link>
                ))}
            </div> */}

            

            <div className="mt-8">
                <h1 className="text-2xl font-base pt-6">Popular Products</h1>
            </div>
            <div className="flex flex-wrap-reverse mt-10 justify-between items-center">
                <span className={`text-xs font-light ${isMobile && showSearch ? 'mt-6' : ''}`}>SHOWING {`(${filteredItems.length}) `} PRODUCT</span>
                <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-2'}`}>
                    <div
                        className={`
                            overflow-hidden
                            transition-all
                            duration-300
                            ease-in-out
                            ${showSearch
                                ? "w-80 opacity-100"
                                : "w-0 opacity-0"}`}>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            ref={inputRef}
                            type="text"
                            placeholder="Search..."
                            className="
                                text-gray-400
                                w-full
                                text-sm px-4 py-2
                                border
                                rounded-full
                                outline-none"
                            />
                    </div>

                    <IoSearch
                        onClick={handleSearchClick}
                        className="
                            text-gray-600
                            cursor-pointer
                            text-2xl
                            hover:scale-130
                            transition-all
                            hover:text-[#265bbd] 
                            duration-300
                            ease-in-out
                        "/>
                </div>
            </div>
            
            <Items filteredItems={filteredItems}/>  
        </>
    )
}