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
import { category} from '../data/category';
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
    const [selectedBrand, setSelectedBrand] = useState(location.state?.dt);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDrawer, setShowDrawer] = useState(false);
    const [showViewer, setShowViewer] = useState(false);
    const [filteredStore, setFilteredStore] = useState([]);
    // const filteredCompany = companies.filter(f => f.id != selectedBrand.id);
    const [canScrollCategoryLeft, setCanScrollCategoryLeft] = useState(false);
    const [canScrollCategoryRight, setCanScrollCategoryRight] = useState(false);
    const categorySliderRef = useRef(null);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // CONTINUE TO DEVELOP
    // console.log(selectedBrand);
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

        const valueMap = Object.fromEntries(
            values.map(value => [
                value.attribute_id,
                value
            ])
        );

        const filteredData = products
            .filter(product => {
                const brandAttribute = attributeMap[product.id];

                if (!brandAttribute) return false;

                const attr = valueMap[brandAttribute.id];

                return attr?.value === selectedBrand.brand;
            })
            .map(product => {
                const brandAttribute = attributeMap[product.id];
                const attr = valueMap[brandAttribute.id];

                return {
                ...product,
                brand: attr?.value ?? null,
                };
        });
        // console.log(filteredData);
        setFilteredStore(filteredData);
        setFilteredItems(filteredData);
        setIsLoading(false);
    }

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
                if (payload.new.status == "published") {
                fetchData();
                }
            }
            )
            .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
    }, []);

    // useEffect(() => {
    //     async function fetchData() {
    //         setIsLoading(true);
    //         const result = await supabase
    //             .from("product")selectedBrand
    //             .select("*")
    //             .eq("status", "published");

    //         const dt = result.data.filter(f => f.brand == selectedBrand.val);
    //         console.log(dt);
    //         setFilteredItems(dt);
    //         setIsLoading(false);
    //     }

    //     fetchData();
    // }, []);

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
    
    // useEffect(() => {
    //     if (brand) {
    //         let filtered = [];
            
    //         if(selectedBrand?.filterBy != undefined) {
    //             filtered = items.filter((item) => item.brand == brand && item.category == selectedBrand.filterBy);
    //         } else {
    //             filtered = items.filter((item) => item.brand == brand);
    //         }
    //         console.log(items);
    //         setFilteredItems(filtered);
    //     }
    // }, [brand])

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
                stores: filteredStore
            }}/>
            <div className="min-h-screen flex flex-col">
                <div className="flex-1">
                    <div className={`${isMobile ? 'pt-2' : 'pt-6'} mb-14`}>
                        <div className={`${isMobile ? 'pl-8 pr-8': 'pl-40 pr-40'}`}>
                            <Fusion />
                        </div>
                        <div className={`${isMobile ? 'pl-8 pr-8' : 'pl-40 pr-40'}`}>
                            <div className='mt-12'>
                                <Breadcrumb items={[{ label: 'Shop', to: '/shop' },{ label: selectedBrand.Store},]}/>
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
                                            <h2 className="text-[#2c539b]">{selectedBrand.product_name}</h2>
                                        </div>
                                    </div>
                                ) : (
                                    <div className='mt-4 w-full'>
                                        <img
                                            src={new URL(`../assets/img/banner/${selectedBrand.val}.png`, import.meta.url).href}
                                            alt={selectedBrand.product_name}
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
                                        {category.map((category, cindx) => {
                                            const iconSrc = new URL(`../assets/img/icons/${category.val}.png`,import.meta.url).href;

                                            return(    
                                                <div
                                                    key={cindx}
                                                    onClick={() => {
                                                        const { filterBy, ...updatedCompany } = selectedBrand;
                                                        setSelectedBrand(updatedCompany);
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
                                    <div className='mt-12'>
                                        <Items filteredItems={filteredItems}/>  
                                    </div>
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