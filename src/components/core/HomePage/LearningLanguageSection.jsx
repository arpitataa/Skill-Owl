import React from "react"
import HighlightText from "./HighlightText"
import know_your_progress from "../../../assets/Images/Know_your_progress.png"
import compare_with_others from "../../../assets/Images/Compare_with_others.png"
import plan_your_lesson from "../../../assets/Images/Plan_your_lessons.png"
import CTAButton from "./CTAButton"

const LearningLanguageSection = () => {
  return (
    <div className="mt-20 lg:mt-[130px]">
      <div className="flex flex-col gap-6 items-center px-4">
        {/* Heading */}
        <div className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-center leading-snug">
          Your Swiss Knife for{" "}
          <HighlightText text={"learning any language"} />
        </div>

        {/* Subheading */}
        <div className="text-center text-richblack-600 mx-auto text-sm sm:text-base font-medium w-full sm:w-[80%] lg:w-[70%]">
          Making learning multiple languages easy. With 20+ languages, progress
          tracking, custom schedule and more.
        </div>

        {/* Images */}
        <div className="flex flex-col sm:flex-row items-center justify-center mt-6 gap-6 sm:gap-0">
          <img
            src={know_your_progress}
            alt="know your progress"
            className="object-contain w-[250px] sm:w-[300px] lg:w-[350px] sm:-mr-24 lg:-mr-32"
          />
          <img
            src={compare_with_others}
            alt="compare with others"
            className="object-contain w-[250px] sm:w-[300px] lg:w-[350px] z-10"
          />
          <img
            src={plan_your_lesson}
            alt="plan your lesson"
            className="object-contain w-[250px] sm:w-[300px] lg:w-[350px] sm:-ml-24 lg:-ml-36"
          />
        </div>

        {/* CTA */}
        <div className="mt-6">
          <CTAButton active={true} linkto={"/signup"}>
            <div>Learn More</div>
          </CTAButton>
        </div>
      </div>
    </div>
  )
}

export default LearningLanguageSection
