import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import CourseCard from "./CourseCard";
import HighlightText from "./HighlightText";

const tabsName = [
  "Free",
  "New to coding",
  "Most popular",
  "Skills paths",
  "Career paths",
];

const ExploreMore = () => {
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className="relative w-full">
      {/* Heading */}
      <div className="text-3xl sm:text-4xl font-semibold text-center my-10 px-4">
        Unlock the <HighlightText text={"Power of Code"} />
        <p className="text-center text-richblack-300 text-base sm:text-lg font-semibold mt-2">
          Learn to Build Anything You Can Imagine
        </p>
      </div>

      {/* Tabs Section */}
      <div className="flex gap-3 sm:gap-5 -mt-3 mx-auto w-full sm:w-max bg-richblack-800 text-richblack-200 p-2 sm:p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] overflow-x-auto no-scrollbar">
        {tabsName.map((ele, index) => (
          <div
            key={index}
            onClick={() => setMyCards(ele)}
            className={`whitespace-nowrap text-sm sm:text-[16px] flex items-center gap-2 ${
              currentTab === ele
                ? "bg-richblack-900 text-richblack-5 font-medium"
                : "text-richblack-200"
            } px-4 sm:px-7 py-2 sm:py-[7px] rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5`}
          >
            {ele}
          </div>
        ))}
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block lg:h-[200px]"></div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6 lg:gap-0 w-full lg:absolute lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 text-black px-4 sm:px-6 lg:px-0 mb-10 lg:mb-0">
        {courses.map((ele, index) => (
          <div
            key={index}
            className="w-full sm:w-[48%] lg:w-auto flex justify-center"
          >
            <CourseCard
              cardData={ele}
              currentCard={currentCard}
              setCurrentCard={setCurrentCard}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreMore;
