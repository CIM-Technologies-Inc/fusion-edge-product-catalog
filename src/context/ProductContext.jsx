import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback
} from "react";
import { supabase } from "./supabase";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {

    const [data, setData] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const fetchProducts = useCallback(async () => {

        setLoading(true);

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
            setLoading(false);
            return;
        }

        const attributeMap = Object.fromEntries(
            attributes
                .filter(a => a.name === "brand")
                .map(a => [a.product_id, a])
        );

        const finishMap = Object.fromEntries(
            attributes
                .filter(a => a.name === "finish")
                .map(a => [a.product_id, a])
        );

        const variationMap = Object.fromEntries(
            attributes
                .filter(a => a.name === "Color Variation")
                .map(a => [a.product_id, a])
        );

        const valueMap = Object.fromEntries(
            values.map(v => [v.attribute_id, v])
        );

        const filteredData = products.map(product => {

            const brand = attributeMap[product.id];
            const finish = finishMap[product.id];
            const variation = variationMap[product.id];

            return {
                ...product,
                brand: brand ? valueMap[brand.id]?.value : null,
                finish: finish ? valueMap[finish.id]?.value : null,
                attr_id: variation ? valueMap[variation.id]?.id : null,
                prod_attr_id: variation
                    ? valueMap[variation.id]?.attribute_id
                    : null
            };
        });

        const filteredStore = [
            ...new Map(
                filteredData
                    .filter(item =>
                        item.Store?.trim() &&
                        item.brand?.trim()
                    )
                    .map(item => [item.Store, item])
            ).values()
        ];

        const uniqueCategory = [
            ...new Set(
                filteredData
                    .map(item => item.category)
                    .filter(category => category?.trim())
            )
        ];

        // console.log(products);
        // console.log(attributes.filter(f => f.product_id == 140));
        // console.log(values);
        // console.log('----------');

        setCategories(uniqueCategory);
        setData(filteredData);
        setBrands(filteredStore);
        setLoading(false);

    }, []);

    useEffect(() => {

        fetchProducts();

        const channel = supabase
            .channel("product-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "product"
                },
                () => {
                    fetchProducts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [fetchProducts]);

    return (
        <ProductContext.Provider
            value={{
                data,
                brands,
                loading,
                categories,
                refreshProducts: fetchProducts
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);