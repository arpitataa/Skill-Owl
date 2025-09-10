import React from "react"
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from "./HighlightText"
import CTAButton from "./CTAButton"
import { FaArrowRight } from "react-icons/fa"

const InstructorSection = () => {
  return (
    <div className="mt-16 px-4">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
        {/* Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={Instructor}
            alt="instructor"
            className="w-[80%] max-w-[400px] lg:max-w-none"
          />
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug">
            Become an <HighlightText text={"Instructor"} />
          </div>

          <p className="font-medium text-sm sm:text-base text-richblack-300 w-full sm:w-[90%] lg:w-[80%]">
            Instructors from around the world teach millions of Students on
            SkillOwl. We provide the tools and skills to teach what you love.
          </p>

          <CTAButton active={true} linkto={"/signup"}>
            <div className="flex flex-row gap-2 items-center justify-center">
              Start Learning Today
              <FaArrowRight />
            </div>
          </CTAButton>
        </div>
      </div>
    </div>
  )
}

export default InstructorSection
