import { Link } from "react-router-dom";
import { TiHome } from "react-icons/ti";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function Breadcrumb({ items }) {
    return (
        <div className="mt-1 flex flex-wrap items-center gap-y-2">
            <div className="flex">
                <Link to="/">
                    <TiHome className="cursor-pointer text-lg font-medium text-blue-600 transition mr-1"/>
                </Link>
                <MdKeyboardArrowRight className="text-sm mt-1 font-medium"/>
            </div>
            {items.map((item, index) => (
                <div key={index} className="flex items-center">
                    {item.to ? (
                        <Link
                        to={item.to}
                        state={item.state}
                        className="pb-1">
                        <span className="block text-xs pl-1 uppercase text-blue-500 hover:text-blue-600 font-semibold mt-2">
                            {item.label}
                        </span>
                        </Link>
                    ) : (
                        <span className="text-xs pl-1 uppercase font-semibold mt-1">
                        {item.label}
                        </span>
                    )}

                    {index !== items.length - 1 && (
                        <MdKeyboardArrowRight className="text-sm font-medium ml-1 mt-1" />
                    )}
                    </div>
                ))
            }
        </div>
    );
}