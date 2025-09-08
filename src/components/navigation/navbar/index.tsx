import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Icon } from "@iconify/react/dist/iconify.js";
import { gemunuLibre } from "@/ui/fonts";
import { contactButtonStyles, donateButtonStyles, modernButtonBase } from "@/ui/buttons";

export interface NavLink {
    href: string;
    label: string;
  }
  
export const navLinks: NavLink[] = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT" },
    { href: "/resources", label: "RESOURCES" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/updates", label: "UPDATES" },
  ];


  const Navbar = ({ toggle, isOpen }: { toggle: () => void; isOpen: boolean }) => {
      
    return (
        <header
            className={`dark:bg-[#122112] flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 ${gemunuLibre.className} relative z-50`}
        >
           <Logo />
            <button
                type="button"
                className="inline-flex items-center md:hidden"
                onClick={toggle}
            >
{isOpen ? (
                <Icon icon="material-symbols:close-rounded" width="36" height="36" color="#209740" /> // Or your preferred X icon
             ) : (
                <Icon icon="heroicons:bars-3-bottom-right-16-solid" width="36" height="36" color="#209740" />
             )}
            </button>
            <nav className="hidden md:flex items-center justify-end gap-x-4 lg:gap-x-6">
                {navLinks.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        className="text-lg lg:text-xl font-semibold text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-150"
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href="/donate"
                    className={`${modernButtonBase.trim()} ${donateButtonStyles.trim()} text-sm lg:text-base px-4 py-2 sm:px-5 sm:py-2.5`}
                >
                    DONATE
                </Link>
                <Link
                    href="/contact"
                    className={`${modernButtonBase.trim()} ${contactButtonStyles.trim()} text-sm lg:text-base px-4 py-2 sm:px-5 sm:py-2.5`}
                >
                    CONTACT
                </Link>
            </nav>
        </header>
    )
}



// const Navbar = ({ toggle }: { toggle: () => void }) => {
//   return (
//       <>

          
          
//       <div className="w-full h-20 bg-emerald-800 sticky top-0">
//         <div className="container mx-auto px-4 h-full">
//           <div className="flex justify-between items-center h-full">
//             <Logo />
//             <button
//               type="button"
//               className="inline-flex items-center md:hidden"
//               onClick={toggle}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="40"
//                 height="40"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   fill="#fff"
//                   d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
//                 />
//               </svg>
//             </button>
//             <ul className="hidden md:flex gap-x-6 text-white ">
//               <li>
//                 <Link href="/about">
//                   <p>About Us</p>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/services">
//                   <p>Services</p>
//                 </Link>
//               </li>
//               <li>
//                 <Link href="/contacts">
//                   <p>Contacts</p>
//                 </Link>
//               </li>
//             </ul>
//             <div className="hidden md:block">
//               <Button />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

export default Navbar;