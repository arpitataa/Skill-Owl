import React from "react"
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import timelineImage from "../../../assets/Images/TimelineImage.png"

const timeline = [
  {
    Logo: Logo1,
    heading: "Leadership",
    Description: "Fully committed to the success of company",
  },
  {
    Logo: Logo2,
    heading: "Responsibility",
    Description: "Delivering with accountability and ownership",
  },
  {
    Logo: Logo3,
    heading: "Flexibility",
    Description: "Adapting to changing needs of the business",
  },
  {
    Logo: Logo4,
    heading: "Innovation",
    Description: "Driving continuous improvement and creativity",
  },
]

const TimelineSection = () => {
  return (
    <div className="w-11/12 max-w-maxContent mx-auto my-12 px-4">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
        {/* Timeline items */}
        <div className="w-full lg:w-[45%] flex flex-col gap-6">
          {timeline.map((element, index) => (
            <div className="flex flex-row gap-4 items-start" key={index}>
              {/* Logo box */}
              <div className="w-[50px] h-[50px] bg-white flex items-center justify-center rounded-md shadow-md">
                <img src={element.Logo} alt="logo" className="w-6 h-6" />
              </div>

              {/* Text */}
              <div>
                <h2 className="font-semibold text-lg text-richblack-900">
                  {element.heading}
                </h2>
                <p className="text-sm sm:text-base text-richblack-600">
                  {element.Description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Image + Stats */}
        <div className="relative shadow-lg w-full lg:w-[55%]">
          <img
            src={timelineImage}
            alt="timeline"
            className="w-full object-cover rounded-lg shadow-md"
          />

          {/* Overlay stats */}
          <div className="absolute bg-caribbeangreen-700 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col sm:flex-row text-white uppercase py-6 rounded-lg shadow-lg">
            {/* Years */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center border-b sm:border-b-0 sm:border-r border-caribbeangreen-300 px-6 py-2">
              <p className="text-2xl sm:text-3xl font-bold">10</p>
              <p className="text-caribbeangreen-300 text-xs sm:text-sm text-center sm:text-left">
                Years of Experience
              </p>
            </div>

            {/* Courses */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center px-6 py-2">
              <p className="text-2xl sm:text-3xl font-bold">250</p>
              <p className="text-caribbeangreen-300 text-xs sm:text-sm text-center sm:text-left">
                Types of Courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimelineSection
