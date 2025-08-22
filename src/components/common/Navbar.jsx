import React from 'react'
import {Link} from "react-router-dom"
import logo from "../../assets/Logo/Logo-Small-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation,matchPath } from 'react-router-dom'

const Navbar = () => {
    const location = useLocation();
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
                            (<div></div>) : 
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

        </div>

        </div>
    </div>
  )
}

export default Navbar