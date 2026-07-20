import { useState, useRef, useEffect } from "react"
import { IoArrowUp } from "react-icons/io5";
import { TiThList } from "react-icons/ti";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom"
import { MdOutlineShoppingCart, MdOutlineCategory } from "react-icons/md";
import { FcEngineering } from "react-icons/fc";
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
            setMenuItems(page.stores);
        } else {
            // const category = page.state.item.category;
            // setMenuItems(category);
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
                {
                    page.showCategoryButton && (
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
                                                to="/shop/category"
                                                state={{ cat }}>
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
                    )
                }
                {
                    page.showCompanyButton && (
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
                                    {menuItems.map((store) => (
                                        <Link
                                            key={store.id}
                                            to={`/shop/${store.Store}`}
                                            state={{dt: store}}
                                        >
                                            <div className="flex items-center py-2 hover:text-blue-600 cursor-pointer">
                                                <img
                                                    src={new URL(`../assets/img/store.png`,import.meta.url).href}
                                                    alt={store.Store}
                                                    className="w-8 h-8 object-contain mr-4 rounded-md"
                                                />
                                                {store.Store}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className="w-full flex px-4 py-3 hover:bg-gray-100 cursor-pointer">
                    <Link
                        to="https://fusionedge.instawp.site/shop/"
                        className="flex w-full items-center justify-between">
                        <span className="font-semibold">FusionEdge V1</span>
                        <FcEngineering className="text-xl" />
                    </Link>
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
            </div>
        </>
    )
}