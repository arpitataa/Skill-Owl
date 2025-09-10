import React from "react"
import * as Icon1 from "react-icons/bi"
import * as Icon3 from "react-icons/hi2"
import * as Icon2 from "react-icons/io5"

const contactDetails = [
  {
    icon: "HiChatBubbleLeftRight",
    heading: "Chat with us",
    description: "Our friendly team is here to help.",
    details: "arpitananda267@gmail.com",
  },
  {
    icon: "BiWorld",
    heading: "Visit us",
    description: "Come and say hello at our office HQ.",
    details: "Silicon University, Silicon Hills, Patia , Bhubaneswar 751024",
  },
  {
    icon: "IoCall",
    heading: "Call us",
    description: "Mon - Fri From 8am to 5pm",
    details: "+123 456 7869",
  },
]

const ContactDetails = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 rounded-xl bg-richblack-800 p-5 sm:p-7 lg:p-10">
      {contactDetails.map((ele, i) => {
        let Icon = Icon1[ele.icon] || Icon2[ele.icon] || Icon3[ele.icon]
        return (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-lg bg-richblack-900 p-4 sm:p-5 text-sm text-richblack-200 hover:shadow-lg transition-all duration-200"
          >
            {/* Icon + Heading */}
            <div className="flex flex-row items-center gap-3">
              <Icon size={28} className="text-yellow-50" />
              <h1 className="text-base sm:text-lg font-semibold text-richblack-5">
                {ele?.heading}
              </h1>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm font-medium">{ele?.description}</p>

            {/* Details */}
            <p className="text-sm sm:text-base font-semibold break-words">
              {ele?.details}
            </p>
          </div>
        )
      })}
    </div>
  )
}

export default ContactDetails
