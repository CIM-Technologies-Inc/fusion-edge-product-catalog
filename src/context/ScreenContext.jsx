import { createContext, useContext, useEffect, useState } from "react";

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () =>
            window.removeEventListener("resize", handleResize);

    }, []);

    return (
        <ScreenContext.Provider value={{ isMobile }}>
            {children}
        </ScreenContext.Provider>
    );
};

export const useScreen = () => useContext(ScreenContext);