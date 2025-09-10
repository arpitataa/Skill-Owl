import React from "react"

import Footer from "../components/common/Footer"
import ContactDetails from "../components/ContactPage/ContactDetails"
import ContactForm from "../components/ContactPage/ContactForm"
import ReviewSlider from "../components/common/ReviewSlider"

const Contact = () => {
  return (
    <div>
      {/* Contact section */}
      <div className="mx-auto mt-10 sm:mt-20 flex w-11/12 max-w-maxContent flex-col lg:flex-row justify-between gap-8 sm:gap-10 text-white px-3 sm:px-0">
        
        {/* Contact Details */}
        <div className="w-full lg:w-[40%]">
          <ContactDetails />
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-[60%]">
          <ContactForm />
        </div>
      </div>

      {/* Reviews Section */}
      <div className="relative mx-auto my-12 sm:my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-6 sm:gap-8 px-3 sm:px-0 bg-richblack-900 text-white rounded-lg py-6 sm:py-10">
        <h2 className="text-center text-2xl sm:text-4xl font-semibold">
          Reviews from other learners
        </h2>
        <ReviewSlider />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Contact
