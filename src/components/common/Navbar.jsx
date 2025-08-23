import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"
import logo from "../../assets/Logo/Logo-Small-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation,matchPath } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import {apiConnector} from "../../services/apiConnector"
import {categories} from "../../services/apis"
import {IoIosArrowDropdownCircle} from "react-icons/io"

const subLinks = [
    {
        title: "python",
        link:"/catalog/python"
    },
    {
        title: "web dev",
        link:"/catalog/web-dev"
    }
]

const Navbar = () => {

    const {token} = useSelector( (state)=> state.auth);
    const {user} = useSelector( (state) => state.profile);
    const {totalItems} = useSelector( (state)=> state.cart);
    const location = useLocation();

    // const [subLinks, setSubLinks] = useState([]);

    // const fetchSublinks = async() => {
    //     try{
    //         const result = await apiConnector("GET",
    //             categories.CATEGORIES_API);
    //             console.log("Printing sublinks result:",result)
    //             setSubLinks(result.data.data);
    //         }
    //     catch(error){
    //         console.log("could not fetch catalogue list");
    //     }
    // }
    // useEffect( () => {
    //     // fetchSublinks();
    // },[])


    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname)
    }
  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700' >
        <div className='flex w-11/12 max-w-maxContent items-center justify-between' >
        {/* image is added */}
            <Link to="/">
            <div className='flex flex-row items-center gap-1 '>
                <img src={logo} alt='logo' loading='lazy' />
                <h2 className='text-white text-2xl font-semibold tracking-tight' >SkillOwl </h2>
            </div>
            </Link>
        {/* adding navlinks */}
        <nav>
            <ul className='flex gap-x-6 text-richblack-25' >
            {
                NavbarLinks.map( (link,index)=>(
                    <li key={index} >
                        {
                            link.title === "Catalog" ? 
                            (
                                <div className='relative flex group items-center gap-2'>
                                    <p>{link.title}</p>
                                    <IoIosArrowDropdownCircle />

                                    <div className='invisible absolute left-[50%] top-[50%]
                                    translate-x-[-50%]
                                    translate-y-[80%]
                                    flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900
                                    opacity-0 transition-all duration-200 group-hover:visible
                                    group-hover:opacity-100 w-[300px]'> 

                                    <div className='absolute left-[50%] top-0 h-6 w-6 rotate-45 rounded
                                     bg-richblack-5 translate-y-[-45%]
                                     translate-x-[80%]'>
                                    </div>

                                    {
                                        subLinks.length ?
                                        (
                                           
                                            subLinks.map( (subLink,index) => (
                                                <Link to={`${subLink.link}`} key={index} >
                                                    <p>{subLink.title}</p>
                                                </Link>
                                            ) )
                             
                                        ):
                                        (<div></div>)
                                    }
                                    </div>
                                </div>
                            ) : 
                            (
                                <Link to={link?.path}>
                                    <p className={`${ matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}` }>
                                        {link.title}
                                    </p>
                                </Link>
                            )
                        }
                    </li>
                ))
            }
            </ul>
        </nav>
        {/* login/signup/dashboard */}
        <div className='flex gap-x-4 items-center' >
            {
                user && user?.accountType !== "Instructor" && (
                    <Link to="/dashboard/cart" className='relative' >
                        <AiOutlineShoppingCart />
                        {
                            totalItems > 0 && (
                                <span>
                                    {totalItems}
                                </span>
                            )
                        }
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/login" >
                        <button className='border border-richblack-700
                        bg-richblack-800 px-[12px] py-[12px]
                        text-richblack-100 rounded-md' >
                            Login
                        </button>
                    </Link>
                )
            }
            {
                token === null && (
                    <Link to="/signup" >
                        <button className='border border-richblack-700
                        bg-richblack-800 px-[12px] py-[12px]
                        text-richblack-100 rounded-md' >
                            Signup
                        </button>
                    </Link>
                )
            }
            {
                token !== null && <ProfileDropDown />
            }
        </div>

        </div>
    </div>
  )
}

export default Navbar