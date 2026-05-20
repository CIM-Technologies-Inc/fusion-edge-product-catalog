import { useState, useRef, useEffect } from "react"
import { IoArrowUp } from "react-icons/io5";

export default function ButtonFloater() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowButton(window.scrollY > 600);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    if (!showButton) return null;

    return (
        <>
             <button
                onClick={scrollToTop}
                className="
                    fixed
                    bottom-20
                    right-6
                    z-50
                    bg-[#2c539b]
                    hover:bg-[#073998]
                    text-white
                    p-4
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