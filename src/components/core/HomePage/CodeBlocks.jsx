import React from "react"
import CTAButton from "../HomePage/CTAButton"
import HighlightText from "./HighlightText"
import { FaArrowRight } from "react-icons/fa"
import { TypeAnimation } from "react-type-animation"

const CodeBlocks = ({
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codeColor,
}) => {
  return (
    <div
      className={`flex flex-col ${
        position === "lg:flex-row" ? "lg:flex-row" : "lg:flex-row-reverse"
      } items-center justify-between gap-10 my-16`}
    >
      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left">
        {heading}
        <p className="text-richblack-300 text-sm sm:text-base font-medium max-w-[90%] mx-auto lg:mx-0">
          {subheading}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-6">
          <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
            <div className="flex items-center gap-2">
              {ctabtn1.btnText}
              <FaArrowRight />
            </div>
          </CTAButton>

          <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
            {ctabtn2.btnText}
          </CTAButton>
        </div>
      </div>

      {/* Right Section (Code Block) */}
      <div className="w-full lg:w-[470px] relative h-fit code-border flex flex-row py-3 px-2 text-xs sm:text-sm leading-5 sm:leading-6 overflow-hidden">
        {backgroundGradient}

        {/* Line numbers */}
        <div className="text-center flex flex-col w-[10%] select-none text-richblack-400 font-inter font-bold text-[10px] sm:text-xs">
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>{i + 1}</p>
          ))}
        </div>

        {/* Code text */}
        <div
          className={`w-[90%] flex flex-col gap-1 font-mono font-semibold ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codeblock, 1500, ""]}
            cursor={true}
            repeat={Infinity}
            style={{
              whiteSpace: "pre-line",
              display: "block",
            }}
            omitDeletionAnimation={true}
          />
        </div>
      </div>
    </div>
  )
}

export default CodeBlocks
