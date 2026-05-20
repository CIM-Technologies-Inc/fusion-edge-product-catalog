import { useState } from 'react';
import { useScreen } from '../context/ScreenContext';
import { IoCloseSharp } from "react-icons/io5";
import { Md3dRotation } from "react-icons/md";
import revit from '../assets/img/icons/revit.svg';
import sketch from '../assets/img/icons/sketch.svg';
import autocad from '../assets/img/icons/autocad.svg';
import Viewer from './Viewer.jsx';

export default function Drawer({
        showDrawer,
        setShowDrawer,
        showViewer,
        setShowViewer,
        selectedProduct,
        selectedDetails
    }) {

    const { isMobile } = useScreen();
    const [checkedFiles, setCheckedFiles] = useState([]);

    return (
        <>
           <div
                className={`
                    fixed inset-0 bg-[#506da3]/70 z-40 transition-opacity duration-300
                    ${showDrawer ? "opacity-100 visible" : "opacity-0 invisible"}
                `}
                onClick={() => setShowDrawer(false)}/>

            <div
                className={`
                    fixed top-0 right-0 h-full ${isMobile ? 'w-[320px]' : 'w-[720px]'} bg-white z-50 shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    ${showDrawer ? "translate-x-0" : "translate-x-full"}
                `}>
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-sm font-semibold capitalize">
                        {!isMobile ? selectedProduct?.name : selectedProduct?.category}
                    </h2>

                    <div className='flex'>
                        {!showViewer ? (
                            <button onClick={() => setShowViewer(true)} className='cursor-pointer hover:text-blue-400 flex items-center'>
                                <Md3dRotation className='text-2xl mr-2'/>
                                {!isMobile && <small className='text-xs'>View 3D Preview</small>}
                            </button>
                            ) : (
                                <small onClick={() => setShowViewer(false)} className='text-sm font-semibold cursor-pointer hover:text-blue-400'>Cancel</small>
                            )}
                            
                            <button
                                onClick={() => {
                                    setShowDrawer(false);
                                    setShowViewer(false);
                                }}
                                className="text-2xl ml-4 cursor-pointer">
                            <IoCloseSharp className='text-xl'/>
                        </button>
                    </div>
                </div>

                <div
                    className={`
                        overflow-hidden transition-all duration-500 ease-in-out
                        ${showViewer
                            ? "max-h-[600px] opacity-100 scale-100 mt-4"
                            : "max-h-0 opacity-0 scale-95 mt-0"
                            }
                        `}>
                    <div className="transition-all duration-500">
                        <Viewer selectedProduct={selectedProduct}/>
                    </div>
                </div>

                <div className="px-6">
                    {
                        isMobile ? (
                            <>
                                <h2 className="text-base font-semibold capitalize mb-3">
                                    {selectedProduct?.name}
                                </h2>
                                <h1 className='mt-6'>Select files and download</h1>
                            </>
                        ) : (   
                            <p className="text-2xl font-semibold mb-6">
                                Select files and download
                            </p> 
                        )
                    }
                    <div className='mt-4 mb-4 flex'>
                        <button className='py-3 px-6 mt-2 mr-3 rounded-full border border-gray-400 flex items-center gap-2 cursor-pointer hover:border-gray-500'>
                            <div className='flex items-center'>
                                <img
                                    src={revit}
                                    alt="revit"
                                    className="w-7 h-7 pl-0.5"
                                />
                                {
                                    !isMobile && (
                                        <div className='ml-2'>
                                            <p className='text-sm font-semibold'>Revit</p>
                                            <p className='text-sm font-light text-gray-400'>3 files</p>
                                        </div>
                                    )
                                }
                                
                            </div>
                        </button>
                        <button className='py-3 px-6 mt-2 mr-3 rounded-full border border-gray-400 flex items-center gap-2 cursor-pointer hover:border-gray-500'>
                            <div className='flex items-center'>
                                <img
                                    src={sketch}
                                    alt="revit"
                                    className="w-7 h-7 pl-0.5"
                                />
                                {
                                    !isMobile && (
                                            <div className='ml-2'>
                                            <p className='text-sm font-semibold'>SketchUp</p>
                                            <p className='text-sm font-light text-gray-400'>2 files</p>
                                        </div>
                                    )
                                }
                            </div>
                        </button>
                        <button className='py-3 px-6 mt-2 mr-3 rounded-full border border-gray-400 flex items-center gap-2 cursor-pointer hover:border-gray-500'>
                            <div className='flex items-center'>
                                <img
                                    src={autocad}
                                    alt="revit"
                                    className="w-7 h-7 pl-0.5"
                                />
                                {
                                    !isMobile && (
                                            <div className='ml-2'>
                                            <p className='text-sm font-semibold'>AutoCAD</p>
                                            <p className='text-sm font-light text-gray-400'>1 file</p>
                                        </div>
                                    )
                                }
                            </div>
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto pr-2">
                        {
                            selectedDetails.length > 0 && (
                                selectedDetails.map((file, findx) => (
                                    <div className='border border-gray-100 hover:border-gray-200 rounded-xl shadow-lg hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] mt-4 p-2 duration-300 ' key={`fff-${findx}`}>
                                        <div className='flex items-center'>
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-blue-500 mr-6 ml-4 cursor-pointer"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setCheckedFiles([
                                                            ...checkedFiles,
                                                            file
                                                        ]);
                                                    } else {
                                                        setCheckedFiles(
                                                            checkedFiles.filter(
                                                                (f) => f !== file
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                            <div>
                                                <p className='text-sm font-semibold leading-5 text-[#5b87d7]'>{file.title}</p>
                                                <p className='text-sm font-semibold leading-5'>{file.desc}</p>
                                                <div className="inline-flex bg-[#5b87d7] items-center border border-[#5b87d7] rounded-full px-3 py-1 mt-1">
                                                    <p className="text-xs font-medium text-gray-600 text-white">
                                                        {file.type}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>

                    <div className='flex justify-end mt-6'>
                        <button className={` ${isMobile ? 'w-full' : 'w-50'} bg-[#2c539b] hover:bg-[#073998] text-white py-2 rounded mb-4`}
                        onClick={() => {
                            console.log(checkedFiles);
                        }}>
                            Download selection
                        </button>
                    </div>  
                </div>
            </div>
        </>
    );
}