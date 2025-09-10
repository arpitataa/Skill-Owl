import React from "react";
import ContactUsForm from "./ContactUsForm";

const ContactForm = () => {
  return (
    <div className="border border-richblack-600 text-richblack-300 rounded-xl p-5 sm:p-7 lg:p-14 flex flex-col gap-4 sm:gap-5">
      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl leading-snug sm:leading-10 font-semibold text-richblack-5">
        Got an Idea? We&apos;ve got the skills. Let&apos;s team up
      </h1>

      {/* Subtext */}
      <p className="text-sm sm:text-base">
        Tell us more about yourself and what you&apos;ve got in mind.
      </p>

      {/* Form */}
      <div className="mt-5 sm:mt-7">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactForm;
