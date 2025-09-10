import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import ReactMarkdown from "react-markdown";
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/avgRating';
import Error from "./Error"

import ConfirmationModal from "../components/common/ConfirmationModal"
import RatingStars from "../components/common/RatingStars"
import { formatDate } from '../services/formatDate';

import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';
import CourseAccordionBar from '../components/core/Course/CourseAccordionBar';
import Footer from '../components/common/Footer';
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi2";

const CourseDetails = () => {

    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const {loading} = useSelector((state) => state.profile);
    const {paymentLoading} = useSelector((state)=> state.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {courseId}  = useParams();

    const [courseData , setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);

    useEffect(()=> {
        //calling getCourse Details
        const getCourseFullDetails = async() => {
            try{
                const result = await fetchCourseDetails(courseId);
                console.log("Printing CourseData-> " , result);
                setCourseData(result);
            }
            catch(error) {
                console.log("Could not fetch course details");
            }
        }
        getCourseFullDetails();
        
    }, [courseId]);

    const [avgReviewCount, setAverageReviewCount] = useState(0);

    //GET AVG RATING COUNT
    useEffect(()=> {
        const count = GetAvgRating(courseData?.data?.courseDetails?.ratingAndReviews || []);
        setAverageReviewCount(count);
    },[courseData])

    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(()=> {
        let lectures = 0;
        courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
            lectures += (sec?.SubSection?.length || 0)
        })
        setTotalNoOfLectures(lectures);

    },[courseData]);


    const [isActive, setIsActive] = useState(Array(0));
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
             ? isActive.concat(id)
             : isActive.filter((e)=> e !== id)

        )
    }

    const handleBuyCourse = () => {
        
        if(token) {
            buyCourse(token, [courseId], user, navigate, dispatch);
            return;
        }
        setConfirmationModal({
            text1:"You are not Logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:() => navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })

    }

    if(loading || !courseData) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
            </div>
        )
    }

    if(!courseData.success) {
        return (
            <Error />
        )
    }
    const {
        _id: course_id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        Instructor,
        studentsEnrolled,
        createdAt,
    } = courseData?.data?.courseDetails || {};

    if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
    <div className='flex flex-col text-white'>
      <div className="flex flex-col text-white">
  {/* Hero Section */}
  <div className="relative w-full bg-richblack-800">
    <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
      <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:grid-cols-2 lg:gap-10 lg:py-0 xl:max-w-[1100px]">
        
        {/* Thumbnail (mobile only) */}
        <div className="relative block max-h-[30rem] w-full lg:hidden">
          <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
          <img
            src={thumbnail}
            alt="course thumbnail"
            className="aspect-auto w-full rounded-md"
          />
        </div>

        {/* Course Info */}
        <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-richblack-5">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            {courseName}
          </h1>
          <p className="text-sm sm:text-base text-richblack-200">
            {courseDescription}
          </p>

          {/* Ratings + Enrollments */}
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
            <span className="text-yellow-25">{avgReviewCount}</span>
            <RatingStars Review_Count={avgReviewCount} Star_Size={20} />
            <span>{`(${ratingAndReviews?.length || 0} reviews)`}</span>
            <span>{`${studentsEnrolled?.length || 0} students enrolled`}</span>
          </div>

          <p className="text-sm sm:text-base">
            Created by{" "}
            <span className="font-medium">
              {`${Instructor?.firstName || ""} ${Instructor?.lastName || ""}`}
            </span>
          </p>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm md:text-base">
            <p className="flex items-center gap-2">
              <BiInfoCircle /> Created at {formatDate(createdAt)}
            </p>
            <p className="flex items-center gap-2">
              <HiOutlineGlobeAlt /> English
            </p>
          </div>
        </div>
      </div>

      {/* Price & CTA (mobile only) */}
      <div className="flex w-full flex-col gap-3 border-y border-richblack-500 py-4 px-4 lg:hidden">
        <p className="text-2xl font-semibold text-richblack-5">Rs. {price}</p>
        <button className="yellowButton w-full" onClick={handleBuyCourse}>
          Buy Now
        </button>
        <button className="blackButton w-full">Add to Cart</button>
      </div>

      {/* Sidebar Card (desktop only) */}
      <div className="right-[1rem] top-[80px] mx-auto hidden w-full max-w-[380px] lg:absolute lg:block">
        <CourseDetailsCard
          course={courseData?.data?.courseDetails}
          setConfirmationModal={setConfirmationModal}
          handleBuyCourse={handleBuyCourse}
        />
      </div>
    </div>
  </div>

  {/* Content Section */}
  <div className="mx-auto box-content w-full max-w-maxContent px-4 text-richblack-5">
    <div className="mx-auto w-full max-w-[850px]">
      
      {/* What you'll learn */}
      <div className="my-8 rounded-lg border border-richblack-600 p-5 sm:p-8">
        <p className="text-xl sm:text-2xl lg:text-3xl font-semibold">
          What you'll learn
        </p>
        <div className="mt-4 text-sm sm:text-base">
          <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
        </div>
      </div>

      {/* Course Content */}
      <div className="mb-8">
        <div className="flex flex-col gap-2">
          <p className="text-xl sm:text-2xl lg:text-[28px] font-semibold">
            Course Content
          </p>
          <div className="flex flex-wrap justify-between gap-3 text-xs sm:text-sm md:text-base">
            <span>{courseContent?.length || 0} section(s)</span>
            <span>{totalNoOfLectures} lecture(s)</span>
            <span>{courseData?.data?.totalDuration || 0} total length</span>
          </div>
          <button
            className="text-yellow-25 mt-2 text-sm"
            onClick={() => setIsActive([])}
          >
            Collapse all sections
          </button>
        </div>

        <div className="mt-4">
          {courseContent?.map((course, index) => (
            <CourseAccordionBar
              key={index}
              course={course}
              isActive={isActive}
              handleActive={handleActive}
            />
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="mb-12">
        <p className="text-xl sm:text-2xl lg:text-[28px] font-semibold">
          Author
        </p>
        <div className="flex items-center gap-4 py-4">
          <img
            src={
              Instructor?.image
                ? Instructor.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${encodeURIComponent(
                    `${Instructor?.firstName || ""} ${
                      Instructor?.lastName || ""
                    }`
                  )}`
            }
            alt="Author"
            className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover"
          />
          <p className="text-sm sm:text-lg">{`${Instructor?.firstName || ""} ${
            Instructor?.lastName || ""
          }`}</p>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-richblack-50">
          {Instructor?.additionalDetails?.about || ""}
        </p>
      </div>
    </div>
  </div>
</div>

    </div>
    
    <Footer />
    
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

export default CourseDetails
