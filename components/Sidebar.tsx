'use client';

import React, { Fragment, useContext, useState } from 'react';
import { useRouter } from "next/router";
// import { Link } from "react-router-dom";
import Image from "next/image";
import { SidebarContext } from '@/context/sidebar-context';
import Link from 'next/link';

export interface SidebarItem {
    id: string;
    label: string;
    url: string;
    target?: string;
}

interface Props {
    items: SidebarItem[];
    onShowPopup: () => void;

}

const Sidebar: React.FC<Props> = ({ items, onShowPopup }) => {
    const sidebarSectionContext = useContext(SidebarContext);

    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        router.push('/dashboard');
    };
    const isActive = (url: string): boolean => {
        return router.pathname === url;
    };
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleClickSidebarItem = (item: any) => {
        // console.log(item);
        // console.log(sidebarSectionContext?.selectedSidebarItem);
        sidebarSectionContext?.changeSidebarItem(item);
        // console.log(sidebarSectionContext?.selectedSidebarItem, "omo");
        router.push(item.url)
    }

    return (
        <>
            <button
                className="
                z-50
                w-10 h-10 fixed top-4 left-4 z-10 md:hidden bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={toggleSidebar}
            >
                <i className={`fas fa-${isOpen ? 'times' : 'bars'} text-primary`} />
            </button>
            <aside
                className={`h-screen sticky top-0 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 justify-between`}
            >

                <div className="w-60 flex flex-col items-center justify-center p-4 hover:cursor-pointer"
                    onClick={handleClick}>
                    <div className="flex flex-row text-black font-bold">
                        <svg width="200" height="62" viewBox="0 0 540 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M78.8874 46.2328C80.1398 46.2328 81.3641 46.6039 82.4054 47.2991C83.4468 47.9944 84.2584 48.9826 84.7377 50.1387C85.217 51.2949 85.3424 52.5671 85.0981 53.7945C84.8537 55.0218 84.2506 56.1492 83.365 57.0341C82.4794 57.919 81.3511 58.5216 80.1228 58.7658C78.8944 59.0099 77.6212 58.8846 76.4641 58.4057C75.307 57.9268 74.318 57.1158 73.6222 56.0753C72.9264 55.0348 72.555 53.8115 72.555 52.5601C72.5462 51.7267 72.7039 50.8999 73.019 50.1283C73.3341 49.3566 73.8002 48.6556 74.39 48.0663C74.9798 47.477 75.6814 47.0113 76.4537 46.6964C77.2259 46.3816 78.0534 46.2239 78.8874 46.2328Z" fill="#005A9B" />
                            <path d="M221.796 46.2327C223.048 46.2327 224.272 46.6038 225.314 47.299C226.355 47.9943 227.167 48.9825 227.646 50.1386C228.125 51.2948 228.251 52.567 228.006 53.7944C227.762 55.0218 227.159 56.1492 226.273 57.0341C225.388 57.9189 224.259 58.5216 223.031 58.7657C221.803 59.0098 220.529 58.8845 219.372 58.4056C218.215 57.9267 217.226 57.1158 216.53 56.0752C215.835 55.0347 215.463 53.8114 215.463 52.56C215.455 51.7269 215.614 50.9005 215.929 50.1293C216.244 49.358 216.711 48.6574 217.3 48.0682C217.89 47.4791 218.591 47.0133 219.363 46.6982C220.135 46.383 220.962 46.2248 221.796 46.2327Z" fill="#005A9B" />
                            <path d="M61.6699 39.1525C57.6511 35.1897 50.1289 27.4028 49.2035 26.4649C48.7924 25.8865 48.5749 25.1929 48.5822 24.4835V4.40527C58.0146 10.0721 62.1525 21.2934 62.5755 28.0764C63.0448 35.5463 61.6699 39.1525 61.6699 39.1525Z" fill="#8CC4E8" />
                            <path d="M109.902 20.4745V57.7909H99.1942V20.4745H89.1074V11.4194H119.963V20.4745H109.902Z" fill="#005A9B" />
                            <path d="M141.895 11.4194C147.804 11.4194 151.492 13.3678 153.713 15.4483C155.663 17.3306 157.746 20.6594 157.746 25.8044C157.746 28.7237 157.124 32.3365 154.136 35.2557C152.316 36.9684 150.089 38.189 147.665 38.8024L161.923 57.7711H148.849L136.336 39.4893V57.7711H125.621V11.4194H141.895ZM136.336 32.4752H138.762C140.712 32.4752 143.356 32.2638 145.16 30.4607C145.736 29.8613 146.187 29.1529 146.485 28.3772C146.784 27.6014 146.924 26.7739 146.899 25.9431C146.946 25.0409 146.774 24.1406 146.399 23.3186C146.024 22.4965 145.456 21.7769 144.744 21.2208C143.005 19.8998 140.229 19.7545 138.834 19.7545H136.336V32.4752Z" fill="#005A9B" />
                            <path d="M195.857 49.0133H178.334L174.785 57.7711H163.66L182.366 11.4194H192.169L210.465 57.7711H199.334L195.857 49.0133ZM192.936 40.8103L187.238 25.2496L181.434 40.8103H192.936Z" fill="#005A9B" />
                            <path d="M270.054 56.3049C266.906 57.9631 263.394 58.8142 259.835 58.7817C251.282 58.7817 245.512 55.8624 241.612 52.0449C239.288 49.7543 237.45 47.0192 236.207 44.003C234.965 40.9867 234.343 37.7512 234.38 34.4897C234.351 31.2482 234.974 28.0339 236.211 25.0376C237.449 22.0412 239.276 19.3238 241.585 17.0467C245.69 13.0839 251.672 10.3826 258.903 10.3826C261.964 10.3826 265.513 11.0034 270.028 12.9518V25.3158C268.664 23.7835 266.995 22.5535 265.127 21.7049C263.258 20.8563 261.233 20.4079 259.181 20.3887C257.444 20.3288 255.713 20.617 254.09 21.2364C252.466 21.8557 250.984 22.7937 249.729 23.9948C248.319 25.3956 247.204 27.0649 246.451 28.9039C245.698 30.743 245.323 32.7142 245.346 34.701C245.297 36.5888 245.631 38.467 246.328 40.2221C247.026 41.9771 248.073 43.5726 249.405 44.9118C252.099 47.4859 255.705 48.8873 259.432 48.8086C262.215 48.8086 265.969 48.0425 270.068 44.0136L270.054 56.3049Z" fill="#005A9B" />
                            <path d="M305.875 49.0133H288.352L284.802 57.7711H273.678L292.384 11.4194H302.187L320.483 57.7711H309.352L305.875 49.0133ZM302.953 40.8103L297.255 25.2496L291.478 40.8103H302.953Z" fill="#005A9B" />
                            <path d="M356.084 11.4194C358.582 11.4194 364.287 11.5581 367.909 14.9661C370.896 17.8128 371.214 21.7029 371.214 23.724C371.275 25.7958 370.743 27.8421 369.68 29.6219C368.79 31.1259 367.452 32.3149 365.853 33.0233C368.252 33.4022 370.481 34.493 372.252 36.154C373.778 37.6796 375.239 40.3215 375.239 44.423C375.239 49.0463 373.435 51.992 371.624 53.8017C367.803 57.4871 362.237 57.7645 359.382 57.7645H341.932V11.4194H356.084ZM352.468 30.256H354.206C355.667 30.256 358.1 30.0446 359.633 28.935C360.249 28.4494 360.741 27.824 361.067 27.1108C361.394 26.3976 361.546 25.617 361.51 24.8335C361.539 24.0881 361.39 23.3465 361.075 22.67C360.76 21.9936 360.288 21.4018 359.699 20.9434C358.166 19.7545 356.084 19.7545 354.134 19.7545H352.468V30.256ZM352.468 49.4096H355.039C357.749 49.4096 361.021 49.3435 362.971 47.5338C363.49 47.0351 363.897 46.4324 364.165 45.7654C364.434 45.0984 364.559 44.382 364.531 43.6635C364.562 42.9711 364.447 42.28 364.196 41.6341C363.944 40.9883 363.561 40.4018 363.07 39.912C361.193 38.175 357.577 38.175 355.423 38.175H352.501L352.468 49.4096Z" fill="#8CC4E8" />
                            <path d="M409.427 20.4745H393.92V29.4172H408.66V38.4524H393.92V48.7359H409.427V57.7711H383.205V11.4194H409.427V20.4745Z" fill="#8CC4E8" />
                            <path d="M418.111 57.7711V11.4194H427.431L452.609 41.299V11.4194H463.317V57.7711H454.003L428.826 27.7396V57.7711H418.111Z" fill="#8CC4E8" />
                            <path d="M484.396 11.4194V57.7711H473.682V11.4194H484.396Z" fill="#8CC4E8" />
                            <path d="M494.748 57.7711V11.4194H504.068L529.239 41.299V11.4194H539.96V57.7711H530.64L505.469 27.7396V57.7711H494.748Z" fill="#8CC4E8" />
                            <path d="M0.851102 60.195V50.7041C0.847589 50.5743 0.869813 50.4451 0.916495 50.3239C0.963177 50.2028 1.03339 50.092 1.1231 49.9981C1.21281 49.9042 1.32023 49.8289 1.43917 49.7766C1.55812 49.7244 1.68624 49.6961 1.81616 49.6936H21.6923C21.8861 49.6855 22.0736 49.6222 22.2326 49.5112C22.3916 49.4001 22.5156 49.246 22.5899 49.067C22.6642 48.888 22.6858 48.6914 22.6521 48.5005C22.6184 48.3097 22.5308 48.1324 22.3996 47.9896L0.751953 23.5522C1.08906 21.1151 4.52624 13.7839 5.64994 12.7008C6.31093 12.0403 39.678 50.6513 47.7356 59.8252C47.8643 59.9693 47.9496 60.147 47.9815 60.3375C48.0135 60.5281 47.9908 60.7238 47.9162 60.902C47.8415 61.0802 47.7179 61.2337 47.5596 61.3447C47.4013 61.4557 47.2148 61.5196 47.0217 61.5292C38.356 61.4829 12.1343 61.2452 1.80955 61.2253C1.67818 61.2229 1.54866 61.194 1.42871 61.1404C1.30876 61.0868 1.20084 61.0097 1.11139 60.9135C1.02194 60.8174 0.952793 60.7042 0.908073 60.5807C0.863353 60.4573 0.843977 60.3261 0.851102 60.195Z" fill="#245B99" />
                            <path d="M50.9208 54.1583C53.0095 53.0157 57.881 46.5431 58.1124 45.3344L29.1806 12.8724C36.3392 12.9649 43.4317 13.0508 44.1389 13.0508L44.1059 2.64178C32.241 -1.80318 23.4101 0.508463 20.7397 1.36047C20.0174 1.61508 19.311 1.91283 18.6245 2.2521C15.3385 3.67819 12.3275 5.66755 9.72746 8.13027L9.66797 8.1831L13.6934 12.6743" fill="#245B99" />
                        </svg>
                        {/* <div className="ml-2 [font-family:'MADE_TOMMY-Medium',Helvetica] font-medium text-[#04009a] text-[22px] tracking-[-0.96px] leading-[normal]">
                            Ascoline
                        </div> */}
                        {/* <h1 className="text-lg font-normal text-gray-700 text-center">Open Source </h1> */}
                        {/* <h1 className="text-lg font-semibold text-gray-700  text-center">Jasper <i
                            className="fas fa-arrow-right text-primary"/> alternative</h1> */}


                    </div>
                </div>

                <nav className="flex-1 h-[90%]">
                    <div className='flex flex-col h-full justify-between'>
                        <ul className="py-4">
                            {items.map((item, index) => (
                                <Fragment key={index}>
                                    <li className={`mb-6 ml-8 text-gray-500 hover:text-gray-700 transition duration-300 ${isActive(item.url) ? 'blue-gray' : 'blue-gray'
                                        } ${item === item ? 'font-semibold' : ''} hover:cursor-pointer`} onClick={() => { handleClickSidebarItem(item) }}>
                                        <Link href={item.url} className='flex flex-row'>
                                            <Image className='mr-3' src={`/sidebar_icons/${item.id}.svg`} alt="Jema.ai" width="25" height="100" /> {item.label}
                                        </Link>
                                    </li>
                                </Fragment>
                            ))}
                        </ul>
                        <div className='flex flex-row px-5 py-2 mb-6 gap-3 items-center bg-red-600 text-white cursor-pointer'>
                            <i className="fa fa-sign-out" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}></i>

                            <p >Déconnexion</p>
                        </div>
                    </div>


                    {/* <div className="flex flex-col pl-8 h-full w-full align-bottom justify-center pt-20">
                        <Fragment >
                            <p className="mt-60 pl-8 text-gray-500 hover:text-gray-700 transition duration-300 blue-gray font-semibold hover:cursor-pointer" onClick={onShowPopup}>
                                Help
                            </p>
                        </Fragment>
                    </div> */}

                </nav>

                {/* <footer> */}
                {/* </footer> */}

            </aside>

        </>
    );
};

export default Sidebar;
