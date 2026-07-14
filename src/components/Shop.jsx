import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { TiHome } from "react-icons/ti";
import { MdKeyboardArrowRight } from "react-icons/md";
import Items from './Items'
import { items } from '../data/items';
import { companies } from '../data/companies';
import { category } from '../data/category';
import Products from "./Products";
import { useScreen } from '../context/ScreenContext';
import { IoSearch, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaAngleRight, FaAngleLeft} from "react-icons/fa";
import ButtonFloater from "./ButtonFloater";
import Breadcrumb from './BreadCrumb';
import { supabase } from "./supabase";

export default function Shop() {
    const { isMobile } = useScreen();
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [isAll, setIsAll] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [search, setSearch] = useState('');
    const inputRef = useRef(null);
    const sliderRef = useRef(null);
    const categorySliderRef = useRef(null);
    const timeoutRef = useRef(null);
    const [showArrows, setShowArrows] = useState(false);
    const [categoryArrow, setCategoryArrow] = useState(false);
    const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
    const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(false);
    const [canScrollCompanyLeft, setCanScrollCompanyLeft] = useState(false);
    const [canScrollCompanyRight, setCanScrollCompanyRight] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
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

    const updateCompanyArrows = () => {
        const slider = sliderRef.current;

        if (!slider) return;

        const hasOverflow = slider.scrollWidth > slider.clientWidth;

        if (!hasOverflow) {
            setCanScrollCompanyLeft(false);
            setCanScrollCompanyRight(false);
            return;
        }

        setCanScrollCompanyLeft(slider.scrollLeft > 0);

        setCanScrollCompanyRight(
            slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1
        );
    };

    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel("product-changes")
            .on(
            "postgres_changes",
            {
                event: "UPDATE",
                schema: "public",
                table: "product",
            },
            (payload) => {
                // console.log("Product updated:", payload);

                // Status changed to published
                if (payload.new.status === "published") {
                fetchData();
                }
            }
            )
            .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
    }, []);

    async function fetchData() {
        setIsLoading(true);

        const [
            { data: products, error: productError },
            { data: attributes, error: attributesError },
            { data: values, error: valuesError }
        ] = await Promise.all([
            supabase
                .from("product")
                .select("*")
                .eq("status", "published"),

            supabase
                .from("product_attribute")
                .select("*"),

            supabase
                .from("product_attribute_value")
                .select("*")
        ]);

        if (
            productError ||
            attributesError ||
            valuesError
        ) {
            console.error(
                productError ||
                attributesError ||
                valuesError
            );

            setIsLoading(false);
            return;
        }

        // Create attribute lookup
        const attributeMap = Object.fromEntries(
            attributes
                .filter(attr => attr.name == "brand")
                .map(attr => [
                    attr.product_id,
                    attr
                ])
        );

        const finishMap = Object.fromEntries(
            attributes
                .filter(attr => attr.name == "finish")
                .map(attr => [
                    attr.product_id,
                    attr
                ])
        );

        const attr_id = Object.fromEntries(
            attributes
                .filter(attr => attr.name == "Color Variation")
                .map(attr => [
                    attr.product_id,
                    attr
                ])
        );

        // Create value lookup
        const valueMap = Object.fromEntries(
            values.map(value => [
                value.attribute_id,
                value
            ])
        );


        const filteredData = products.map(product => {
            const brandAttribute = attributeMap[product.id];
            const finishAttribute = finishMap[product.id];
            const idAttribute = attr_id[product.id];

            const attr = brandAttribute
                ? valueMap[brandAttribute.id]
                : null;

            const vals = finishAttribute
                ? valueMap[finishAttribute.id]
                : null;

            const attrid = idAttribute
                ? valueMap[idAttribute.id]
                : null;   

            return {
                ...product,
                brand: attr?.value ?? null,
                finish: vals?.value ?? null,
                attr_id: attrid?.id ?? null,
                prod_attr_id: attrid?.attribute_id ?? null
            };
        });


        // console.log(filteredData);
        // console.log(products);
        // console.log(attributes);
        // console.log(values);
        // console.log('----------');

        setData(filteredData);
        setIsLoading(false);
    }

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

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        updateCompanyArrows();

        slider.addEventListener("scroll", updateCompanyArrows);
        window.addEventListener("resize", updateCompanyArrows);

        return () => {
            slider.removeEventListener("scroll", updateCompanyArrows);
            window.removeEventListener("resize", updateCompanyArrows);
        };
    }, []);

    const startHideTimer = () => {
        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setShowSearch(false);
        }, 5000);
    };

    const handleSearchClick = () => {
         setShowSearch(true);

        clearTimeout(timeoutRef.current);

        setTimeout(() => {
            inputRef.current?.focus();
        }, 200);

        startHideTimer();
    };

    const handleFocus = () => {
        clearTimeout(timeoutRef.current);
    };

    const handleBlur = () => {
        startHideTimer();
    };

    const handleChange = (e) => {
        setSearch(e.target.value);

        startHideTimer();
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    // const scroll = (direction) => {
    //     const container = sliderRef.current;

    //     if (!container) return;

    //     const scrollAmount = 300;

    //     container.scrollBy({
    //         left: direction === "left"
    //             ? -scrollAmount
    //             : scrollAmount,
    //         behavior: "smooth",
    //     });
    // };

    const scroll = (ref, direction) => {
        const container = ref.current;

        if (!container) return;

        container.scrollBy({
            left: direction === "left" ? -300 : 300,
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

    useEffect(() => {
        const checkOverflow = () => {
            const slider = categorySliderRef.current;

            if (slider) {
                setCategoryArrow(
                    slider.scrollWidth > slider.clientWidth
                );
            }
        };

        checkOverflow();

        window.addEventListener("resize", checkOverflow);

        return () => {
            window.removeEventListener("resize", checkOverflow);
        };
    }, [category]);

    const selectCompany = (company) => {
        setSelectedCompany(company);
        setIsAll(false);

        // GET ITEM LENGTH BASED ON COMPANY ID
        const len = items.filter(f => f.companyID == company.id);
    }

    const selectCategory = (category) => {
        setSelectedCategory(prev =>
            prev == category.val ? "all" : category.val
        );
    }

    const filteredItems = data.filter((item) => {
        const searchValue = search.toLowerCase().trim();

        const matchesSearch =
            !searchValue ||
            item.product_name?.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory == "all" ||
            item.category?.toLowerCase() == selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
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
            <h1 className={`${isMobile ? 'text-xl pt-4' : 'text-3xl pt-8'} font-bold`}>Category</h1>
                
            <div className="flex items-center">
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
                    {category.map((cat, ccindx) => {
                        const iconSrc = new URL(`../assets/img/icons/${cat.val}.png`,import.meta.url).href;
                        return(   
                                <Link
                                    key={`ddd-${ccindx}`}
                                    to={`/shop/category`}
                                    state={{ cat }}
                                    className="shrink-0">
                                     <div
                                        // onClick={() => {
                                        //     if (selectedCategory !== cat.val) {
                                        //         selectCategory(cat);
                                        //     }
                                        // }}
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
                                            selectedCategory === cat.val
                                                ? "bg-blue-400 text-white scale-95 cursor-default"
                                                : "bg-white shadow-lg hover:-translate-y-2 hover:shadow-xl cursor-pointer"
                                        }
                                    `}>
                                        <img
                                            src={iconSrc}
                                            alt={cat.text}
                                            className="w-12 h-12 object-contain"
                                        />

                                        <h2 className="mt-1 text-sm font-medium text-center">
                                            {cat.text}
                                        </h2>
                                    </div>
                                </Link> 
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

            <h1 className={`${isMobile ? 'text-xl pt-2' : 'text-3xl pt-4'} font-bold`}>Company</h1>
          
            <div className="flex items-center">
                {canScrollCompanyLeft && (
                    <button
                        onClick={() => scroll(sliderRef, "left")}
                        className={`shrink-0 ${!isMobile ? 'p-3' : 'p-1'}`}>
                        <FaAngleLeft className="text-2xl cursor-pointer" />
                    </button>
                )}
                <div
                    ref={sliderRef}
                    className={`
                    ${!isMobile ? 'py-6' : ''}
                    flex
                    gap-6
                    overflow-x-hidden
                    scroll-smooth
                    flex-1`}>
                    {companies.map((company, ccindx) => (
                        <Link
                            key={`bbb-${ccindx}`}
                            to={`/shop/${company.val}`}
                            state={{ company }}
                            className="shrink-0">
                            <div
                                onClick={() => selectCompany(company)}
                                className={`
                                    ${!isMobile ? 'p-6 w-52' : 'mt-6'}
                                    shadow-lg
                                    cursor-pointer
                                    
                                    bg-white
                                    rounded-xl
                                    transition-all
                                    duration-300
                                    hover:-translate-y-2
                                    hover:shadow-xl`}>
                                <img
                                    src={company.src}
                                    alt={company.name}
                                    className="w-full h-20 object-contain"
                                />
                                {
                                    !isMobile && (
                                        <h2 className="text-xl text-center font-bold mt-2">
                                            {company.name}
                                        </h2>
                                    )
                                }
                            </div>
                             {
                                isMobile && (
                                    <h2 className="text-sm text-center mt-1 font-semibold">
                                        {company.name}
                                    </h2>
                                )
                            }
                        </Link>
                    ))}
                </div>

                {canScrollCompanyRight && (
                    <button
                        onClick={() => scroll(sliderRef, "right")}
                        className={`
                            shrink-0
                            cursor-pointer
                            ${!isMobile ? 'p-3' : 'p-1'}`}>
                        <FaAngleRight className="text-2xl" />
                    </button>
                )}
            </div>

            {/* <div className={`${isMobile ? 'mt-4' : 'mt-8'}`}>
                <h1 className={`text-2xl font-base ${isMobile ? 'pt-2' : 'pt-6'}`}>Popular Products</h1>
            </div> */}
            <div className={`flex flex-wrap-reverse ${isMobile ? 'mt-8' : 'mt-12'} justify-between items-center`}>
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
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
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
        </>
    )
}