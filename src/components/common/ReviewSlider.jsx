import React, { useEffect, useState } from "react"

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import "../../App.css"

// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules"

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

// use your custom RatingStars
import RatingStars from "../common/RatingStars"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  return (
    <div className="text-white">
      <div className="my-[50px] h-[220px] max-w-maxContentTab lg:max-w-maxContent">
        <Swiper
          slidesPerView={"auto"}   // let slides size themselves
          spaceBetween={30}
          loop={true}
          freeMode={true}
          autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      modules={[FreeMode, Pagination, Autoplay]}
      className="w-full px-4"  // full width swiper
    >
    {reviews.map((review, i) => (
    <SwiperSlide key={i} className="!w-[300px]">
      <div className="flex h-[220px] flex-col justify-between gap-3 rounded-md bg-richblack-800 p-4 text-[14px] text-richblack-25 shadow-md">
      {/* User Info */}
      <div className="flex items-center gap-4">
      <img
        src={
          review?.user?.image
            ? review?.user?.image
            : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
        }
        alt="profile"
        className="h-9 w-9 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
        <h2 className="text-[12px] font-medium text-richblack-500">
          {review?.course?.courseName}
        </h2>
      </div>
    </div>

    {/* Review Text */}
    <p className="line-clamp-3 flex-grow font-medium text-richblack-25">
      {review?.review}
    </p>

    {/* Rating */}
    <div className="mt-auto flex items-center gap-2">
      <h3 className="font-semibold text-yellow-100">
        {review.rating.toFixed(1)}
      </h3>
      <RatingStars Review_Count={review.rating} Star_Size={20} />
    </div>
  </div>
</SwiperSlide>

  ))}
</Swiper>

      </div>
    </div>
  )
}

export default ReviewSlider
