    import { useState, useEffect } from 'react';
    import { Link } from "react-router-dom";
    import { useParams, useLocation } from 'react-router-dom';
    import { MdKeyboardArrowRight } from "react-icons/md";
    import { IoIosArrowDown, IoIosArrowUp, IoMdArrowDropright } from "react-icons/io";
    import { IoCloseSharp } from "react-icons/io5";
    import { Md3dRotation } from "react-icons/md";
    import { FaMinus, FaPlus } from "react-icons/fa6";
    import { items } from '../data/items';
    import { FaStar, FaRegStar } from "react-icons/fa";
    import { RxDimensions } from "react-icons/rx";
    import { companies } from '../data/companies';
    import { useScreen } from '../context/ScreenContext';
    import { div } from 'three/tsl';
    import revit from '../assets/img/icons/revit.svg';
    import sketch from '../assets/img/icons/sketch.svg';
    import Viewer from './Viewer.jsx';
    import Drawer from './Drawer';
    import ButtonFloater from "./ButtonFloater";
    import Breadcrumb from './BreadCrumb';
    import Items from './Items'
    import Footer from './Footer.jsx';
    import Fusion from './Fusion.jsx';
    import { supabase } from "./supabase";

    export default function PerProduct() {
        const { isMobile } = useScreen();
        const [showDescription, setShowDescription] = useState(false);
        const [showAttribute, setShowAttribute] = useState(false);
        const [showClassification, setShowClassification] = useState(false);
        const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
        const [showSpecification, setShowSpecification] = useState(false);
        const [showReview, setShowReview] = useState(false);
        const [showDrawer, setShowDrawer] = useState(false);
        const [showViewer, setShowViewer] = useState(false);
        const [showZoom, setShowZoom] = useState(false);
        const [view, setViewer] = useState(false);
        const [animate, setAnimate] = useState(false);
        const [review, setReview] = useState(0);
        const [rating, setRating] = useState(0);
        const [hover, setHover] = useState(0);
        const [quantity, setQuantity] = useState(1);
        const [selectedProduct, setSelectedProduct] = useState(null);
        const [selectedDetails, setSelectedDetails] = useState([]);
        const [selectedTexture, setSelectedTexture] = useState([]);
        const [productList, setProductList] = useState([]);
        const [variantList, setVariantList] = useState([]);
        const [variant, setVariant] = useState("");
        const [forVariation, setForVariation] = useState(false);
        const [attributes, setAttributes] = useState({});
        const [passedItem, setPassedItem] = useState(null);
        const [tooltip, setTooltip] = useState({
            visible: false,
            x: 0,
            y: 0,
        });
        const [selected, setSelected] = useState({
            dimension: null,
            texture: null,
        });

        const { perproduct } = useParams();
        const location = useLocation();
        const passedProduct = location.state?.item;
        const brands = location.state?.brands;
        // const productDetails = items.filter(f => f.id == passedProduct.id);
        const relatedProduct = items.filter(f => f.company == passedProduct.company && f.id != passedProduct.id);
        const company = companies.filter(f => f.val == passedProduct.brand)[0];
        const [imgSource, setImgSource] = useState(passedProduct.image_url);
        const [productAttributes, setProductAttributes] = useState({});

        
        // console.log(brands);
        console.log(passedProduct);
        // console.log('------');

        const parsedSample = passedProduct?.sample_json
            ? JSON.parse(passedProduct.sample_json)
            : {};

        const changeImage = (src, obj) => {
            setAnimate(true);
  
            setTimeout(() => {
                setImgSource(src);

                if(obj?.list) {
                    setProductList(obj.list);
                } else {
                    setProductList([]);
                }

                setAnimate(false);
            }, 300);
        };

        const showDetails = (file) => {
            if(file.hasOwnProperty('files')) {
                setSelectedDetails(file.files);
            } else {
                setSelectedDetails([]);
            }
            setShowDrawer(true);
            setSelectedProduct(file);
        }

        const handleSelect = (type, value, obj) => {
            // if same card clicked again -> unselect
            if (selected[type] === value) {
                setSelected((prev) => ({
                    ...prev,
                    [type]: null,
                }));

                // clear texture list if dimension is unselected
                if (type === 'dimension') {
                setSelectedTexture([]);
                }

                return;
            }

            setSelected((prev) => ({
                ...prev,
                [type]: value,
                src: obj.src,
                dimensionID: obj.dimensionID,
                textureID: obj.textureID,
                product: passedProduct,
            }));
            
            if(type == 'dimension') {
                if(passedProduct.variation?.texture) {
                    const texture = passedProduct.variation.texture.filter(
                        (f) => f.dimensionID == obj.dimensionID
                    );

                    setSelectedTexture(texture);
                }
            }

            if(type == 'texture') {
                setImgSource(obj.src);
            }
        };

        useEffect(() => {
            setSelected((prev) => ({
                ...prev,
                quantity
            }))
          
        }, [quantity])
        

        const fetchAttribute = async () => {
            if (!passedProduct?.attr_id) return;
           
            const { data: attributes, error: attributesError } = await supabase
                .from("product_attribute")
                .select("*")
                .eq("id", passedProduct.prod_attr_id)
                .single();

            if (attributesError) {
                console.error(attributesError);
                return;
            }

            const { data, error } = await supabase
                .from("product_attribute_value")
                .select("*")
                .eq("id", passedProduct.attr_id)
                .single();

            if (error) {
                console.error(error);
                return;
            }
           
            if(attributes.used_for_variation) {
                setVariantList(JSON.parse(data.value));
                setForVariation(attributes.used_for_variation);
            } 
            const { data: productAttributes, error: productAttributeError } = await supabase
                .from("product_attribute")
                .select("id, name")
                .eq("product_id", passedProduct.id)
                .eq("used_for_variation", false);

            if (productAttributeError) {
                console.error(productAttributeError);
                return;
            }

            const attributeIds = productAttributes.map(item => item.id);

            const { data: attributeValues, error: attributeValueError } = await supabase
                .from("product_attribute_value")
                .select("attribute_id, value")
                .in("attribute_id", attributeIds);

            if (attributeValueError) {
                console.error(attributeValueError);
                return;
            }
            
            const result = productAttributes.reduce((obj, attribute) => {
                const value = attributeValues.find(
                    item => item.attribute_id === attribute.id
                );

                obj[attribute.name] = value?.value ?? "";

                return obj;
            }, {});

            setAttributes(result);
        };

        useEffect(() => {
            fetchAttribute();
            
            const channel = supabase
                .channel(`product_attribute_value_${passedProduct.attr_id}`)
                .on(
                    "postgres_changes",
                    {
                        event: "*", // Listen for INSERT, UPDATE, DELETE
                        schema: "public",
                        table: "product_attribute_value",
                        filter: `id=eq.${passedProduct.attr_id}`,
                    },
                    (payload) => {
                        console.log("Realtime change:", payload);

                        // Re-fetch latest data
                        fetchAttribute();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }, []);

        const loadProductAttributes = async () => {
            if (!passedProduct?.id) return;

            try {
                const { data: attributes, error: attrError } = await supabase
                    .from("product_attribute")
                    .select("id, name")
                    .eq("product_id", passedProduct.id);

                if (attrError) throw attrError;

                if (!attributes || attributes.length == 0) {
                    setProductAttributes({});
                    return;
                }

                const attributeIds = attributes.map(attr => attr.id);

                const { data: values, error: valueError } = await supabase
                    .from("product_attribute_value")
                    .select("attribute_id, value")
                    .in("attribute_id", attributeIds);

                if (valueError) throw valueError;

                const valueMap = {};

                values.forEach(item => {
                    valueMap[item.attribute_id] = item.value;
                });

                const result = {};
                console.log(attributes);
                attributes.forEach(attr => {
                    // result[attr.name] = valueMap[attr.id] ?? null;
                    result[`data-cim-${attr.name}`] = valueMap[attr.id] ?? null;
                    if(attr.name == 'url') {
                        result['data-src'] = valueMap[attr.id] ?? null;
                    }
                });

                setProductAttributes(result);
            } catch (err) {
                console.error(err);
            }
        };

        useEffect(() => {
            loadProductAttributes();
        }, [passedProduct]);

        const createColorImage = (hex, width = 400, height = 400) => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = hex;
            ctx.fillRect(0, 0, width, height);

            return canvas.toDataURL("image/png");
        }

        return (
            <>
                <ButtonFloater page={{
                    ...location,
                    showCompanyButton: false,
                    stores: []
                }}/>
                <div className={`${isMobile ? 'pt-2' : 'pt-6'} mb-14`}>
                    <div className={`${isMobile ? 'pl-8 pr-8': 'pl-40 pr-40'}`}>
                        <Fusion />
                    </div>

                    <div className={`${isMobile ? 'pl-8 pr-8' : 'pl-40 pr-40'}`}>
                        <div className='mt-20 flex flex-wrap items-center gap-y-2'>
                            <Breadcrumb items={[
                                {
                                    label: "Shop",
                                    to: "/shop",
                                },
                                {
                                    label: passedProduct.brand,
                                    to: `/shop/${passedProduct.brand}`,
                                    state: {
                                        dt: passedProduct,
                                    },
                                },
                                {
                                    label: passedProduct.category,
                                    to: `/shop/category`,
                                    state: { 
                                        cat: {
                                            id: passedProduct.id,
                                            text: passedProduct.category.charAt(0).toUpperCase() + passedProduct.category.slice(1).toLowerCase(),
                                            val: passedProduct.category,
                                        }
                                    },
                                },
                                // {
                                //     label: passedProduct.finish,
                                //     to: `/shop/${passedProduct.brand}`,
                                //     state: {
                                //         company: {
                                //         ...company,
                                //         filterBy: passedProduct.category,
                                //         },
                                //     },
                                // },
                                {
                                    label: perproduct,
                                },
                            ]}/>
                        </div>

                        <div className="grid sm:grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-8">
                            {/* {
                                variant ? (
                                    <figure
                                        class="ct-media-container"
                                        style={{ cursor: "grab" }}
                                        data-src={passedProduct.image_url}
                                        data-width="400"
                                        data-height="400"
                                        {...productAttributes}>
                                            <div className="flex items-center gap-3 mt-6 mb-4 p-2">
                                                <div
                                                    className="w-full aspect-square rounded-[72px] border "
                                                    style={{
                                                        backgroundColor: variant.hex,
                                                        borderColor: variant.hex,
                                                    }}
                                                />
                                            </div>
                                    </figure>
                                    
                                ) : (
                                    <figure
                                        className="ct-media-container"
                                        style={{ cursor: "grab" }}
                                        data-src={passedProduct.image_url}
                                        data-width="400"
                                        data-height="400"
                                        {...productAttributes}>
                                        <img
                                            src={imgSource}
                                            alt="Item-Image"
                                            className={`
                                                w-full
                                                h-auto
                                                max-h-225
                                                object-contain
                                                transition-all
                                                duration-300
                                                ease-in-out
                                                ${animate
                                                    ? 'opacity-0 -translate-x-10'
                                                    : 'opacity-100 translate-x-0'}
                                            `}/>
                                    </figure>
                                )
                            } */}
                            <figure
                                className="ct-media-container"
                                style={{ cursor: "grab" }}
                                // data-src={passedProduct.image_url}
                                data-width="400"
                                data-height="400"
                                {...productAttributes}>
                                <img
                                    src={imgSource}
                                    alt="Item-Image"
                                    className={`
                                        w-full
                                        h-auto
                                        max-h-225
                                        object-contain
                                        transition-all
                                        duration-300
                                        ease-in-out
                                        ${variant ? 'rounded-[114px] p-6' : ''}
                                        mt-4
                                        ${animate
                                            ? 'opacity-0 -translate-x-10'
                                            : 'opacity-100 translate-x-0'}
                                    `}/>
                            </figure>
                            {
                                productList.length > 0 && (
                                    <div
                                        className='flex flex-wrap gap-6 cursor-pointer mt-4'>
                                        {
                                            productList.map((prod, prodindx) => (
                                                <>
                                                    <img
                                                        onClick={() => setImgSource(prod.src)}
                                                        src={prod.src}
                                                        alt="Item-Image"
                                                        className={`
                                                            w-30
                                                            h-30
                                                            object-contain
                                                            transition-all
                                                            duration-300
                                                            ease-in-out
                                                            ${animate
                                                                ? 'opacity-0 -translate-x-10'
                                                                : 'opacity-100 translate-x-0'}
                                                        `}
                                                        
                                                    />
                                                </>
                                            ))
                                        }
                                    </div>
                                )
                            }
                            <div className="mt-6">
                                <h1 className='text-3xl font-bold'>{perproduct}</h1>
                                <span className='text-gray-600 font-bold block pt-4 text-lg uppercase'>₱  {passedProduct.price}</span>
                                {
                                    forVariation && (
                                        <span className='text-gray-600 font-medium block pt-4 text-md'>Variant</span>
                                    )
                                }
                                {/* <select className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 mt-4 mb-4"
                                    onChange={(e) => {
                                        const selected = variantList.find(
                                            (item) => item.code === e.target.value
                                        );

                                        setVariant(selected);
                                    }}
                                >
                                    <option value="">{perproduct}</option>

                                    {variantList.map((variant) => (
                                        <option key={variant.code} value={variant.code}>
                                        {variant.name}
                                        </option>
                                    ))}
                                </select> */}
                                {
                                    forVariation && (
                                         <div className="flex flex-wrap gap-3 mt-4 mb-4">
                                            {variantList.map((item) => (
                                                <button
                                                    key={item.code}
                                                    type="button"
                                                    onClick={() => {
                                                        setVariant(item);
                                                        // console.log(item);

                                                         setProductAttributes(prev => ({
                                                            ...prev,
                                                            "data-cim-color-code": item.hex,
                                                        }));

                                                        const image = createColorImage(item.hex);
                                                        setImgSource(image);
                                                    }}
                                                    title={`${item.name} (${item.code})`}
                                                    className={`
                                                        w-12
                                                        h-12
                                                        rounded-full
                                                        border-2
                                                        transition-all
                                                        duration-200
                                                        hover:scale-110
                                                        cursor-pointer
                                                        ${
                                                            variant?.code == item.code
                                                                ? "border-black ring-2 ring-blue-500"
                                                                : "border-gray-300"
                                                        }
                                                    `}
                                                    style={{
                                                        backgroundColor: item.hex,
                                                        borderColor: item.hex,
                                                    }}
                                                />
                                            ))}
                                            <button
                                                type="button"
                                                // onClick={() => setVariant(null)}
                                                onClick={() => {
                                                    setVariant(null)
                                                    setImgSource(passedProduct?.image_url)
                                                }}
                                                
                                                title="Show Product Image"
                                                className={`
                                                    w-12
                                                    h-12
                                                    rounded-full
                                                    bg-white
                                                    cursor-pointer
                                                    transition-all
                                                    duration-200
                                                    hover:scale-110
                                                    ${!variant ? "ring-2 ring-blue-500" : ""}
                                                `}>
                                                ✕
                                            </button>
                                        </div>
                                    )
                                }
                                {
                                    variant && (
                                        <>
                                            <span className='text-gray-600 font-medium block pt-4 text-md'>Variant Name - Code </span>
                                            <p className='text-gray-600 font-medium block pt-2 text-md'>{`${variant.name} ${variant.code}`}</p>
                                        </>
                                        
                                    )
                                }
                                {/* <div className={`flex items-center w-full ${isMobile ? 'flex-row-reverse gap-2 ml-auto' : ''}`}>
                                    <button onClick={() => showDetails(passedProduct)} 
                                        className="cursor-pointer 
                                        shadow 
                                        bg-[#2872fa] 
                                        hover:bg-[#1864f1] 
                                        flex 
                                        items-center 
                                        focus:shadow-outline 
                                        focus:outline-none 
                                        text-white 
                                        text-base 
                                        font-light 
                                        py-2 
                                        px-6 
                                        rounded 
                                        mt-8 
                                        hover:scale-110 
                                        transition-all 
                                        duration-300 
                                        ease-in-out" 
                                        type="button">
                                        Download
                                        <img
                                            src={revit}
                                            alt="revit"
                                            className="w-5.5 h-5.5 pl-0.5"
                                        />
                                        <img
                                            src={sketch}
                                            alt="revit"
                                            className="w-5.5 h-5.5"
                                        />
                                    </button>
                                    <div className='pl-3'>
                                        <button onClick={() => {
                                            setViewer(true);
                                            setPassedItem(passedProduct);
                                            }} className='text-white bg-black py-2 px-3 rounded font-semibold cursor-pointer mt-8 hover:scale-110 transition-all duration-300 ease-in-out'>
                                            3D
                                        </button>
                                    </div>
                                </div> */}
                                {/* <hr className="border-gray-300 my-3" /> */}

                                <div className='mt-6'>
                                    {
                                        passedProduct?.variation && passedProduct.variation != '' && (
                                            <>
                                                <p className='text-lg font-medium'>Variation</p>
                                                {
                                                    passedProduct.variation?.color && (
                                                        <>
                                                            <small className='block pl-6 mt-4 mb-4 font-medium'>Color</small>
                                                            <div className='pl-6 flex flex-wrap gap-6'>
                                                                {
                                                                    passedProduct.variation.color.map((clr, clrindx) => (
                                                                        <div className='p-1 cursor-pointer hover:scale-115 transition-all duration-300 ease-in-out' 
                                                                            onClick={() => changeImage(clr.src, clr)}
                                                                            key={`lll-${clrindx}`}>
                                                                            <img src={clr.src} alt="color" className={`${isMobile ? 'w-20 h-20 mx-auto' : 'w-30 h-30' }`} />
                                                                            <p className={`block text-xs text-center mt-1 font-medium`}>{clr.size}</p>
                                                                            <small className='block text-xs text-center mt-1 font-medium'>{clr.color}</small>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                {
                                                    passedProduct.variation?.dimension && passedProduct.dimension != '' && (
                                                        <>
                                                            <small className='block pl-6 mt-4 mb-4 font-medium'>Dimension/Size</small>
                                                            <div className='pl-6 flex flex-wrap gap-6'>
                                                                {
                                                                    passedProduct.variation.dimension.map((dim, dimindx) => (
                                                                        <div key={`ddd-${dimindx}`} onClick={() => handleSelect('dimension', dim.size, dim)}>
                                                                            <div className={`
                                                                                border 
                                                                                ${
                                                                                    selected.dimension == dim.size
                                                                                        ? 'border-2 border-[#2872fa] text-[#2872fa] shadow-3xl'
                                                                                        : 'border-gray-100 bg-white'
                                                                                }
                                                                                hover:shadow-2xl
                                                                                cursor-pointer 
                                                                                transition-all 
                                                                                duration-300 
                                                                                rounded-xl 
                                                                                p-5 
                                                                                flex 
                                                                                flex-col 
                                                                                items-center`}>
                                                                                <RxDimensions className='font-bold' size={30}/>
                                                                            </div>
                                                                            <span className={`block text-xs text-center mt-2 font-medium ${selected.dimension == dim.size ? 'text-[#2872fa] font-semibold': ''}`}>{dim.size}</span>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </>  
                                        )
                                    }
                                    <div
                                        className={`
                                            overflow-hidden transition-all duration-500 ease-in-out 
                                            ${
                                            selectedTexture.length > 0
                                                ? 'opacity-100 max-h-125 translate-y-0'
                                                : 'opacity-0 max-h-0 -translate-y-4'
                                            }`}>
                                        <small className='block pl-6 mt-6 mb-6 font-medium'>
                                            Texture
                                        </small>

                                        <div className='pl-6 flex flex-wrap gap-6 mb-2'>
                                            {selectedTexture.map((texture, txtindx) => (
                                                <div className='' key={`ttt-${txtindx}`}>
                                                    <div
                                                        className={`
                                                        border-2 cursor-pointer transition-all duration-300
                                                        ${
                                                            selected.texture == texture.name && selected.textureID == texture.textureID 
                                                            ? 'border-[#2872fa] text-[#2872fa] shadow-xl'
                                                            : 'border-gray-200 bg-white'
                                                        }
                                                        `}
                                                        onClick={() => handleSelect('texture', texture.name, texture)}>
                                                            <img
                                                                src={texture.src}
                                                                alt='No Image'
                                                                className='w-17 h-17'
                                                            />
                                                    </div>
                                                    <small className={`${selected.texture == texture.name && selected.textureID == texture.textureID ? 'text-[#2872fa] font-semibold' : ''} block text-xs text-center mt-2 font-medium capitalize`}>
                                                        {texture.name}
                                                    </small>
                                                    </div>
                                            ))}
                                        </div>
                                        </div>
                                
                                </div>

                                <div className=''>
                                    {/* <div className='flex flex-col sm:flex-row sm:items-center gap-3 mt-8 mb-8'>
                                        <div className='flex items-center border border-blue-500 rounded p-2 sm:p-3 w-fit self-end sm:self-auto mr-1'>
                                            <button className='cursor-pointer hover:bg-[#2872fa] hover:text-white p-2 rounded transition-colors duration-300 ease-in-out'
                                                onClick={() =>
                                                    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                                                }>
                                                <FaMinus className='text-xs'/>
                                            </button>
                                            <span className='cursor-pointer pl-4 pr-4 text-sm'>{ quantity }</span>
                                            <button className='cursor-pointer hover:bg-[#2872fa] hover:text-white p-2 rounded transition-colors duration-300 ease-in-out'
                                                onClick={() => setQuantity((prev) => prev + 1)}>
                                                <FaPlus className='text-xs'/>
                                            </button>
                                        </div>
                                        <button onClick={() => {
                                              
                                            }} 
                                            className='cursor-pointer bg-[#2872fa] hover:bg-[#1864f1] p-4 rounded text-white w-full text-sm hover:scale-103 transition-all duration-300 ease-in-out'>
                                            Add to cart
                                        </button>
                                    </div> */}
                                    <p className='text-sm font-semibold text-gray-700 leading-7'>SKU : <span className='text-gray-400 uppercase'>{passedProduct.sku}</span></p>
                                    
                                    <p className='text-sm font-semibold text-gray-700 leading-7'>BRAND : <span className='text-gray-400 uppercase'>{passedProduct.brand}</span></p>
                                </div>
                                
                                {
                                    passedProduct?.description && passedProduct.description != '' && (
                                        <>
                                            <hr className="border-gray-300 my-4" />
                                            <div className={`flex justify-between cursor-pointer ${ showDescription ? "text-blue-500 font-bold" : "hover:text-blue-500"}`} onClick={() => {setShowDescription(prev => !prev);}}>
                                                <span className='text-xs hover:text-blue-500 cursor-pointer'>DESCRIPTION</span>
                                                {
                                                    showDescription 
                                                    ? <IoIosArrowUp className='cursor-pointer'/>
                                                    : <IoIosArrowDown className='cursor-pointer'/>
                                                }
                                            </div>
                                            <div
                                                className={`
                                                    overflow-hidden
                                                    transition-all duration-300 ease-in-out
                                                    ${showDescription ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"}
                                                `}>
                                                <span className="text-sm font-light">
                                                    {passedProduct.description}
                                                </span>
                                            </div>
                                           
                                        </>
                                    )
                                }
                                {
                                    !forVariation && (
                                        <>
                                            <hr className="border-gray-300 my-4" />
                                            <div className={`flex justify-between cursor-pointer ${ showAttribute ? "text-blue-500 font-bold" : "hover:text-blue-500"}`} onClick={() => {setShowAttribute(prev => !prev);}}>
                                                <span className='text-xs hover:text-blue-500 cursor-pointer'>ATTRIBUTES</span>
                                                {
                                                    showAttribute 
                                                    ? <IoIosArrowUp className='cursor-pointer'/>
                                                    : <IoIosArrowDown className='cursor-pointer'/>
                                                }
                                            </div>
                                            <div
                                                className={`
                                                    overflow-hidden
                                                    transition-all duration-300 ease-in-out
                                                    ${showAttribute ? "max-h-40 opacity-100 mt-4" : "max-h-0 opacity-0"}
                                                `}>
                                                {Object.entries(attributes).map(([key, value]) => (
                                                    <div key={key} className="flex pb-2">
                                                        <span className="w-40 font-base capitalize">
                                                            {key}
                                                        </span>
                                                        <span>{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )
                                }
                                <hr className="border-gray-300 my-4" />
                                {
                                    passedProduct?.classification && passedProduct.classification != '' && (
                                        <>
                                            <div className={`flex justify-between cursor-pointer ${ showClassification ? "text-blue-500 font-bold" : "hover:text-blue-500"}`} onClick={() => {setShowClassification(prev => !prev);}}>
                                                <span className='text-xs hover:text-blue-500 cursor-pointer'>CLASSIFICATION</span>
                                                {
                                                    showClassification
                                                    ? <IoIosArrowUp className='cursor-pointer'/>
                                                    : <IoIosArrowDown className='cursor-pointer'/>
                                                }
                                            </div>
                                            <div
                                                className={`
                                                    overflow-hidden
                                                    transition-all duration-300 ease-in-out
                                                    ${showClassification ? "max-h-500 opacity-100 mt-4" : "max-h-0 opacity-0"}
                                                `}>
                                                {
                                                    passedProduct.classification.map((clss, clssindx) => (
                                                        <div className='ml-4 flex p-1' key={`ccc-${clssindx}`}>
                                                            <IoMdArrowDropright className='mr-2'/>
                                                            <p className="text-sm font-light">
                                                                {clss}
                                                            </p>
                                                        </div>
                                                        
                                                    ))
                                                }
                                            </div>
                                            <hr className="border-gray-300 my-4" />
                                        </>
                                    )
                                }
                                {
                                    passedProduct?.specification && passedProduct.specification != '' &&  (
                                        <>
                                            <div className={`flex justify-between cursor-pointer ${ showSpecification ? "text-blue-500 font-bold" : "hover:text-blue-500"}`} onClick={() => {setShowSpecification(prev => !prev);}}>
                                                <span className='text-xs hover:text-blue-500 cursor-pointer'>SPECIFICATION</span>
                                                {
                                                    showSpecification
                                                    ? <IoIosArrowUp className='cursor-pointer'/>
                                                    : <IoIosArrowDown className='cursor-pointer'/>
                                                }
                                            </div>
                                            <div
                                                className={`
                                                    overflow-hidden
                                                    transition-all duration-300 ease-in-out
                                                    ${showSpecification? "max-h-500 opacity-100 mt-4" : "max-h-0 opacity-0"}
                                                `}>
                                                {
                                                    passedProduct.specification.map((spec, specindx) => (
                                                        <div className='ml-4 flex p-1' key={`ddd-${specindx}`}>
                                                            <IoMdArrowDropright className='mr-2'/>
                                                            <p className="text-sm font-light">
                                                                {spec}
                                                            </p>
                                                        </div>
                                                        
                                                    ))
                                                }
                                            </div>
                                            <hr className="border-gray-300 my-4" />
                                        </>
                                    )
                                }
                                {
                                    passedProduct?.sample_json && passedProduct.sample_json != '' && (
                                        <>
                                            <div className={`flex justify-between cursor-pointer ${ showClassification ? "text-blue-500 font-bold" : "hover:text-blue-500"}`} onClick={() => {setShowAdditionalInfo(prev => !prev);}}>
                                                <span className='text-xs hover:text-blue-500 cursor-pointer'>ADDITIONAL INFORMATION</span>
                                                {
                                                    showAdditionalInfo
                                                    ? <IoIosArrowUp className='cursor-pointer'/>
                                                    : <IoIosArrowDown className='cursor-pointer'/>
                                                }
                                            </div>
                                            <div
                                                className={`
                                                    overflow-hidden
                                                    transition-all duration-300 ease-in-out
                                                    ${showAdditionalInfo ? "max-h-500 opacity-100 mt-4" : "max-h-0 opacity-0"}
                                                `}>
                                                {Object.entries(parsedSample)
                                                    .filter(([key]) => key != "description" && key != "image_url")
                                                    .map(([key, value]) => (
                                                        <div key={key} className="flex pb-2">
                                                            <span className="w-40 font-base capitalize">
                                                                {key}
                                                            </span>
                                                            <span>
                                                                {value ?? "-"}
                                                            </span>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                             <hr className="border-gray-300 my-4" />
                                        </>
                                    )
                                }
                                <div className={`flex justify-between cursor-pointer ${ showReview ? "text-blue-500 font-bold" : "hover:text-blue-500"}`} onClick={() => {setShowReview(prev => !prev);}}>
                                    <span className='text-xs font-base'>REVIEWS ({review})</span>
                                    {
                                        showReview
                                        ? <IoIosArrowUp className='cursor-pointer'/>
                                        : <IoIosArrowDown className='cursor-pointer'/>
                                    }
                                </div>
                                <div
                                    className={`
                                        overflow-hidden
                                        transition-all duration-300 ease-in-out
                                        ${showReview ? "max-h-500 opacity-100 mt-4" : "max-h-0 opacity-0"}
                                    `}>
                                    <span className='font-semibold text-base block mt-4'>Reviews</span>
                                    <span className='block mt-6 text-sm text-gray-400'>There are no reviews yet.</span>

                                    <div className='mt-16'>
                                        <span className='font-semibold text-base block mt-4'>Be the first to review "{perproduct}"</span>
                                        <p className='block mt-4 text-sm font-light text-gray-500'>Your email address will not be published. Required fields are marked <span className='text-red-400'>*</span></p>
                                        
                                        <div className="flex gap-2 mt-8">
                                            <p className='text-xs text-gray-600 block mr-2'>YOUR RATING <span className='text-red-400'>*</span></p>
                                            {[1, 2, 3, 4, 5].map((star, strindx) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHover(star)}
                                                onMouseLeave={() => setHover(0)}
                                                key={`sss-${strindx}`}>
                                                {star <= (hover || rating) ? (
                                                    <FaStar className="text-base text-orange-400 cursor-pointer transition" />
                                                ) : (
                                                    <FaRegStar className="text-base text-orange-400 cursor-pointer transition" />
                                                )}
                                            </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap mt-6">
                                        <div className="w-full md:w-1/2  mb-6 md:mb-0">
                                            <label className="block tracking-wide text-gray-700 text-sm font-base mb-2">
                                                Name<span className='text-red-400 pl-1'>*</span>
                                            </label>
                                            {/* appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" */}
                                            <input className="appearance-none block w-full text-gray-300 border rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white"></input>
                                        </div>
                                        <div className="w-full md:w-1/2 px-3">
                                            <label className="block tracking-wide text-gray-700 text-sm font-base mb-2">
                                                Email<span className='text-red-400 pl-1'>*</span>
                                            </label>
                                            <input type='email' className="appearance-none block w-full text-gray-300 border rounded py-2 px-4 mb-3 focus:outline-none focus:bg-white"></input>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap mt-4">
                                        <p className='text-sm text-gray-600 mr-2'>Your review<span className='text-red-400 pl-1'>*</span></p>
                                        <textarea
                                            className="
                                            mt-2
                                            pr-2
                                            w-full
                                            p-5
                                            h-50
                                            border
                                            border-gray-300
                                            rounded-sm"/>
                                    </div>
                                    <div className='mt-8 flex items-center'>
                                        <input type="checkbox" className="w-4 h-4 accent-blue-500 mr-4" />
                                        <p className='block text-sm font-light text-gray-500'>Save my name, email, and website in this browser for the next time I comment.<span className='text-red-400'>*</span></p>
                                    </div>
                                    <button className="hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer shadow bg-[#2872fa] hover:bg-[#1864f1] flex items-center focus:shadow-outline focus:outline-none text-white text-base font-light py-2 px-6 rounded mt-6" type="button">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className='mt-20'>
                            <h1 className='text-xl font-semibold'>Related Product</h1>
                            <Items filteredItems={relatedProduct}/> 
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

                {/* MODAL */}
                {showZoom && (
                    <div
                        className="
                            fixed
                            inset-0
                            bg-black/70
                            z-100
                            flex
                            items-center
                            justify-center
                            p-12
                        "
                        onClick={() => setShowZoom(false)}>

                        {/* Zoomed Image */}
                        <img
                            src={imgSource}
                            alt="Product Image"
                            className="
                                max-w-full
                                max-h-full
                                object-contain
                                shadow-xl
                                animate-fadeIn
                            "
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}

                {/* VIEWER MODAL */}
                {view && (
                    <>
                        <div
                            className="
                            fixed
                            inset-0
                            bg-white/99
                            z-100
                            flex
                            p-12">
                            <div className="absolute top-6 right-6 text-2xl flex">
                                <div className='flex items-center mr-4'>
                                    <Md3dRotation className='mr-2 text-2xl'/>
                                    <small className='text-xs font-semibold'>View 3D Preview</small>
                                </div>
                                
                                <button onClick={() => setViewer(false)} className='cursor-pointer'>
                                    <IoCloseSharp />
                                </button>
                            </div>
                            {/* Zoomed Image */}
                            <Viewer selectedProduct={passedItem}/>
                        </div>
                    </>
                )}
                <Footer />
            </>
        )
    }