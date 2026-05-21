import { useState, useRef, useEffect } from "react"
import { IoArrowUp } from "react-icons/io5";
import { TiThList } from "react-icons/ti";
import { Link } from "react-router-dom"
import { MdOutlineShoppingCart, MdOutlineCategory } from "react-icons/md";
import { PiBuildings } from "react-icons/pi";

export default function ButtonFloater({ page }) {
    const [showButton, setShowButton] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const menuRef = useRef(null);
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
           
            if(window.scrollY < 600) {
                setOpenMenu(false);
            }
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

    if (!showButton) return null;

    return (
        <>  
            {
                page != undefined && (
                    <div ref={menuRef} className="fixed bottom-18 right-23 z-50">
                         <div
                            className={`
                                absolute
                                bottom-16
                                right-0
                                w-48
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
                            <Link to="/shop">
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
                            </Link>

                            {menuItems.length > 0 && (
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
                            )}
                        
                        </div>
                        {page.showCompanyButton ? (
                            <>
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
                                    <TiThList className="text-lg" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        setOpenMenu(!openMenu);
                                    }}
                                    className="
                                        mb-1
                                        text-sm
                                        z-50 
                                        bottom-18
                                        right-23
                                        bg-[#2c539b] 
                                        hover:bg-[#073998]
                                        text-white
                                        rounded-full 
                                        fixed p-4
                                        cursor-pointer
                                        transition-all
                                        duration-300
                                        hover:scale-110">
                                        <MdOutlineCategory className="text-lg" />
                                </button>
                            </>
                        )}
                    </div>
                )
            }
            
            <button
                onClick={scrollToTop}
                className="
                    cursor-pointer
                    fixed
                    bottom-18
                    right-6
                    z-50
                    bg-[#2c539b]
                    hover:bg-[#073998]
                    text-white
                    p-5
                    rounded-full
                    shadow-2xl
                    transition-all
                    duration-300
                    hover:scale-110
                "
            >
                <IoArrowUp className="text-xl" />
            </button>
        </>
    )
}