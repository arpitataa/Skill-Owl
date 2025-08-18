import React from 'react'

const HighlightText = ({text}) => {
  return (
   <span className='font-bold text-richblue-200'>
   {/* bg-gradient-to-b from-[] to-[] */}
    {" "}
        {text}
   </span>
  )
}

export default HighlightText