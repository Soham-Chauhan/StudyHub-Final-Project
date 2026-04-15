import React, { useEffect } from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.svg"
import { Link, matchPath } from 'react-router-dom'
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AiOutlineShoppingCart} from "react-icons/ai"
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { useState } from 'react'
import {IoIosArrowDown} from "react-icons/io"
import {RxHamburgerMenu} from "react-icons/rx"
import { RxCross2 } from "react-icons/rx"
import './loader.css'
// Ḍemo temporary data
// const subLinks = [
//     {
//         title: "Python",
//         link:"/catalog/python"
//     },
//     {
//         title: "Web Dev",
//         link:"/catalog/web-development"
//     },
// ];

const Navbar = () => {
    // console.log("Printing base url: ",process.env.REACT_APP_BASE_URL);
    
    const {token} = useSelector((state)=> state.auth);
    // console.log("token in Navbar is",token)
    const {user} = useSelector((state)=> state.profile);
    // console.log("User in Navbar is",user)
    const {totalItems} = useSelector((state)=> state.cart);
    const location = useLocation();

    const [subLinks, setSubLinks]  = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false)

    const fetchSublinks = async() => {
        try{
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            // console.log("Printing Sublinks result:" , result);
            setSubLinks(result.data.data);
        }
        catch(error) {
            console.log("Could not fetch the category list");
        }
    }

    
    useEffect( () => {
        fetchSublinks();
    },[] )

    useEffect(() => {
        setMobileMenuOpen(false)
        setMobileCatalogOpen(false)
    }, [location.pathname])

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }
    
  return (
    <div className='relative flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
      <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
      {/* Image */}
      <Link to="/">
        <img src={logo} alt="StudyHub logo" width={160} height={42} loading='lazy'/>
      </Link>

      {/* Nav Links */}
      <nav>
        <ul className=' hidden md:flex gap-x-6 text-richblack-25'>
        {
            NavbarLinks.map( (link, index) => (
                 <li key={index}>
                    {
                        link.title === "Catalog" ? (
                            <div className='relative flex items-center gap-2 group'>
                                <p>{link.title}</p>
                                <IoIosArrowDown/>

                                <div className={`invisible absolute left-[50%] 
                                    translate-x-[-49%] ${subLinks?.length ? "translate-y-[15%]" : "translate-y-[40%]"}
                                 top-[50%] z-50 
                                flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                opacity-0 transition-all duration-200 group-hover:visible
                                group-hover:opacity-100 lg:w-[300px]`}>

                                <div className='absolute left-[50%] top-0
                                translate-x-[80%]
                                translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5'>
                                </div>

                                {
                                    subLinks?.length ? (
                                            subLinks.map( (subLink, index) => (
                                                <Link className='rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50' to={`catalog/${subLink.name}`} key={index}>
                                                    <p>{subLink.name}</p>
                                                </Link>
                                            ) )
                                    ) : (<span className="loader"></span>)
                                }

                                </div>


                            </div>

                        ) : (
                            <Link to={link?.path}>
                                <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                    {link.title}
                                </p>
                                
                            </Link>
                        )
                    }
                </li>
             ) )
        }

        </ul>
      </nav>

        {/* Login/SignUp/Dashboard */}
        <div className='hidden md:flex gap-x-4 items-center'>
            {   
                user && user?.accountType !== "Instructor" && (
                    <Link to="/dashboard/cart" className='relative pr-2'>
                        <AiOutlineShoppingCart className='text-2xl text-richblack-100 ' />
                        {
                            totalItems > 0 && (
                                <span className=' absolute -bottom-2 -right-0 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100'>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login">
                        <button className='border  border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Log in
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup">
                        <button  className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md'>
                            Sign Up
                        </button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropDown />
            }
            
        </div>

         <button
            className='mr-2 flex items-center justify-center text-[#AFB2BF] md:hidden'
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <RxCross2 size={26} /> : <RxHamburgerMenu size={24} />}
         </button>
              
      </div>

      {mobileMenuOpen && (
        <div className="absolute left-0 top-14 z-[1000] w-full border-b border-richblack-700 bg-richblack-900 px-4 py-4 md:hidden">
          <nav className="mb-4">
            <ul className="flex flex-col gap-2 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div className="rounded-md border border-richblack-700">
                      <button
                        className="flex w-full items-center justify-between px-3 py-2 text-left"
                        onClick={() => setMobileCatalogOpen((prev) => !prev)}
                      >
                        <span>Catalog</span>
                        <IoIosArrowDown
                          className={`transition-transform duration-200 ${mobileCatalogOpen ? "rotate-180" : "rotate-0"}`}
                        />
                      </button>
                      {mobileCatalogOpen && (
                        <div className="border-t border-richblack-700 bg-richblack-800 p-2">
                          {subLinks?.length ? (
                            subLinks.map((subLink, i) => (
                              <Link
                                key={i}
                                to={`catalog/${subLink.name}`}
                                className="block rounded px-2 py-2 text-sm text-richblack-100 hover:bg-richblack-700"
                              >
                                {subLink.name}
                              </Link>
                            ))
                          ) : (
                            <span className="loader"></span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link?.path}
                      className={`block rounded px-3 py-2 ${
                        matchRoute(link?.path) ? "bg-richblack-700 text-yellow-25" : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-3 border-t border-richblack-700 pt-3">
            {user && user?.accountType !== "Instructor" && (
              <Link to="/dashboard/cart" className="relative w-fit pr-2">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-1 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token === null && (
              <div className="flex gap-2">
                <Link to="/login">
                  <button className="rounded-md border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100">
                    Log in
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="rounded-md border border-richblack-700 bg-richblack-800 px-4 py-2 text-richblack-100">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {token !== null && (
              <div className="flex items-center justify-between">
                <Link to="/dashboard/my-profile" className="text-sm text-yellow-25">
                  Go to Dashboard
                </Link>
                <ProfileDropDown />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar
