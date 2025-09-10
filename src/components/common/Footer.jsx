import React from "react"
import { FooterLink2 } from "../../data/footer-links"
import { Link } from "react-router-dom"

// Images
import Logo from "../../assets/Logo/Logo-Small-Light.png"

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa"

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"]
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
]
const Plans = ["Paid memberships", "For students", "Business solutions"]
const Community = ["Forums", "Chapters", "Events"]

const Footer = () => {
  return (
    <div className="bg-richblack-800 text-richblack-400">
      {/* Top Section */}
      <div className="w-11/12 max-w-maxContent mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10 border-b border-richblack-700 pb-10">
          {/* Left Section */}
          <div className="flex flex-wrap w-full lg:w-1/2 gap-6">
            {/* Company */}
            <div className="w-1/2 sm:w-1/3 lg:w-[30%] flex flex-col gap-3">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <img src={Logo} alt="SkillOwl" className="h-10 w-10 object-contain" />
                <h2 className="text-white text-xl sm:text-2xl font-semibold tracking-tight">
                  SkillOwl
                </h2>
              </div>
              <h1 className="text-richblack-50 font-semibold text-sm sm:text-base">Company</h1>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                {["About", "Careers", "Affiliates"].map((ele, i) => (
                  <Link
                    key={i}
                    to={ele.toLowerCase()}
                    className="text-[14px] hover:text-richblack-50 transition-all"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
              <div className="flex gap-3 text-lg justify-center sm:justify-start">
                <FaFacebook />
                <FaGoogle />
                <FaTwitter />
                <FaYoutube />
              </div>
            </div>

            {/* Resources */}
            <div className="w-1/2 sm:w-1/3 lg:w-[30%]">
              <h1 className="text-richblack-50 font-semibold text-sm sm:text-base">Resources</h1>
              <div className="flex flex-col gap-2 mt-2 text-center sm:text-left">
                {Resources.map((ele, index) => (
                  <Link
                    key={index}
                    to={ele.split(" ").join("-").toLowerCase()}
                    className="text-[14px] hover:text-richblack-50 transition-all"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
              <h1 className="text-richblack-50 font-semibold text-sm sm:text-base mt-6">
                Support
              </h1>
              <Link
                to="/help-center"
                className="text-[14px] hover:text-richblack-50 transition-all"
              >
                Help Center
              </Link>
            </div>

            {/* Plans & Community */}
            <div className="w-1/2 sm:w-1/3 lg:w-[30%]">
              <h1 className="text-richblack-50 font-semibold text-sm sm:text-base">Plans</h1>
              <div className="flex flex-col gap-2 mt-2 text-center sm:text-left">
                {Plans.map((ele, index) => (
                  <Link
                    key={index}
                    to={ele.split(" ").join("-").toLowerCase()}
                    className="text-[14px] hover:text-richblack-50 transition-all"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
              <h1 className="text-richblack-50 font-semibold text-sm sm:text-base mt-6">
                Community
              </h1>
              <div className="flex flex-col gap-2 mt-2 text-center sm:text-left">
                {Community.map((ele, index) => (
                  <Link
                    key={index}
                    to={ele.split(" ").join("-").toLowerCase()}
                    className="text-[14px] hover:text-richblack-50 transition-all"
                  >
                    {ele}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-wrap w-full lg:w-1/2 gap-6">
            {FooterLink2.map((ele, i) => (
              <div key={i} className="w-1/2 sm:w-1/3 lg:w-[30%]">
                <h1 className="text-richblack-50 font-semibold text-sm sm:text-base">
                  {ele.title}
                </h1>
                <div className="flex flex-col gap-2 mt-2 text-center sm:text-left">
                  {ele.links.map((link, index) => (
                    <Link
                      key={index}
                      to={link.link}
                      className="text-[14px] hover:text-richblack-50 transition-all"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-11/12 max-w-maxContent mx-auto px-4 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          {/* Links */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            {BottomFooter.map((ele, i) => (
              <Link
                key={i}
                to={ele.split(" ").join("-").toLowerCase()}
                className={`px-2 hover:text-richblack-50 transition-all ${
                  BottomFooter.length - 1 !== i ? "border-r border-richblack-700" : ""
                }`}
              >
                {ele}
              </Link>
            ))}
          </div>
          {/* Copy */}
          <div className="text-center sm:text-right">
            arpitataa © 2025 SkillOwl
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
