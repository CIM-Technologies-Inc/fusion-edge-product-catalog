import { useState, useRef, useEffect } from "react"
import { IoArrowUp } from "react-icons/io5";
import { TiThList } from "react-icons/ti";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom"
import { MdOutlineShoppingCart, MdOutlineCategory } from "react-icons/md";
import { PiBuildings } from "react-icons/pi";
import { companies } from '../data/companies';
import { category} from '../data/category';

export default function ButtonFloater({ page }) {
    const [showButton, setShowButton] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const menuRef = useRef(null);

    const [openCategories, setOpenCategories] = useState(false);
    const [openCompanies, setOpenCompanies] = useState(false);

    // console.log(page);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpenMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 600);
           
            // if(window.scrollY < 600) {
            //     setOpenMenu(false);
            // }
        };
        
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if(!page) return;

        if(page.showCompanyButton) {
            setMenuItems(page.companies);
        } else {
            const category = page.state.currentCompany.category;
            setMenuItems(category);
        }
    }, [page])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // if (!showButton) return null;

    return (
        <>  
            {showButton && (
                <button
                    onClick={scrollToTop}
                    className="
                    cursor-pointer
                    fixed
                    bottom-14   
                    right-21
                    z-50
                    bg-[#2c539b]
                    hover:bg-[#073998]
                    text-white
                    p-3
                    rounded-full
                    shadow-2xl
                    transition-all
                    duration-300
                    hover:scale-110">
                    <IoArrowUp className="text-xl" />
                </button>
            )}
            {/* {
                page != undefined && (
                    
                )
            } */}
            <div ref={menuRef} className="fixed bottom-12 right-6 z-50">
                <div
                    className={`
                    absolute
                    bottom-16
                    right-0
                    w-64
                    bg-white
                    shadow-2xl
                    rounded-xl
                    overflow-hiddenxx
                    transition-all
                    duration-300
                    origin-bottom-right
                    ${
                        openMenu
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 translate-y-2 pointer-events-none"
                    }
                `}>
                {/* <Link to="/shop">
                    <button 
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth"
                            });
                        }}
                        className="flex items-center cursor-pointer w-full text-left px-4 py-3 hover:bg-gray-100 transition">
                        <MdOutlineShoppingCart className="mr-3"/>
                        <span>Shop</span>
                    </button>
                </Link> */}

                {/* {menuItems.length > 0 && (
                    menuItems.map((comp, compindx) => (
                        <Link key={`ccc-${compindx}`}  to={page.showCompanyButton ? `/shop/${comp.val}` : '/shop'} state={page.showCompanyButton ? { company: comp } : {}}>
                            <button
                                onClick={() => {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth"
                                    });
                                }}
                                className="cursor-pointer flex items-center w-full text-left px-4 py-3 hover:bg-gray-100 transition">
                                {   page.showCompanyButton
                                    ?
                                    <PiBuildings className="mr-3"/>
                                    :
                                    <MdOutlineCategory className="mr-3"/>
                                }
                                <span>{page.showCompanyButton ? comp.name : comp.text}</span>
                            </button>
                        </Link>
                    ))
                )} */}
                <div className="">
                    <button
                        onClick={() => {
                            setOpenCategories(prev => {
                                const next = !prev;

                                if (next) {
                                    setOpenCompanies(false);
                                }

                                return next;
                            });
                        }}
                        className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-100">
                        <div className="flex items-center">
                            <span className="font-semibold">Categories</span>
                        </div>

                        <FaChevronRight
                            className={`
                                text-sm
                                transition-transform
                                duration-300
                                ${openCategories ? "rotate-90" : ""}
                            `}
                        />
                    </button>

                    <div
                        className={`
                            overflow-hidden
                            transition-all
                            duration-300
                            ease-in-out
                            ${openCategories ? "max-h-100 opacity-100" : "max-h-0 opacity-0"}
                        `}>
                        <div className="pl-8 pb-2">
                            {category.map((cat) => {
                                const iconSrc = new URL(`../assets/img/icons/${cat.val}.png`,import.meta.url).href;
                                return (
                                    <Link
                                        key={cat.val}
                                        to="/shop"
                                        state={{ category: cat }}>
                                        {cat.text !== "All" && (
                                            <div className="flex items-center py-1 hover:text-blue-600 cursor-pointer">
                                                <img
                                                    src={iconSrc}
                                                    alt={cat.text}
                                                    className="w-8 h-8 object-contain mr-3"
                                                />
                                                {cat.text}
                                            </div>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div>
                    <button
                        onClick={() => {
                            setOpenCompanies(prev => {
                                const next = !prev;

                                if (next) {
                                    setOpenCategories(false);
                                }

                                return next;
                            });
                        }}
                        className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-100">
                        <div className="flex items-center">
                            <span className="font-semibold">Companies</span>
                        </div>

                        <FaChevronRight
                            className={`
                                text-sm
                                transition-transform
                                duration-300
                                ${openCompanies ? "rotate-90" : ""}
                            `}
                        />
                    </button>

                    <div
                        className={`
                            overflow-hidden
                            transition-all
                            duration-300
                            ease-in-out
                            ${openCompanies ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                        `}>
                        <div className="pl-8 pb-2">
                            {companies.map((company) => (
                                <Link
                                    key={company.id}
                                    to={`/shop/${company.val}`}
                                    state={{ company }}
                                >
                                    <div className="flex items-center py-2 hover:text-blue-600 cursor-pointer">
                                        <img
                                            src={company.src}
                                            alt={company.product_name}
                                            className="w-8 h-8 object-contain mr-4 rounded-md"
                                        />
                                        {company.product_name}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="
                        mb-1
                        bg-[#2c539b]
                        hover:bg-[#073998]
                        text-white
                        rounded-full
                        p-4
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:scale-110
                        shadow-xl">
                    <TiThList className="text-xl" />
                </button>
            {/* {page.showCompanyButton ? (
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="
                        mb-1
                        bg-[#2c539b]
                        hover:bg-[#073998]
                        text-white
                        rounded-full
                        p-5
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:scale-110
                        shadow-xl">
                    <TiThList className="text-xl" />
                </button>
            ) : (
                <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="
                        mb-1
                        bg-[#2c539b]
                        hover:bg-[#073998]
                        text-white
                        rounded-full
                        p-5
                        cursor-pointer
                        transition-all
                        duration-300
                        hover:scale-110
                        shadow-xl">
                    <MdOutlineCategory className="text-xl" />
                </button>
            )} */}
        </div>
        </>
    )
}