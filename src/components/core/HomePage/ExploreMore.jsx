import React from 'react'
import { useState } from 'react';
import {HomePageExplore} from "../../../data/homepage-explore"
import HighlightText from './HighlightText';

const tabsName = [
    "Free",
    "New to coding",
    "Most popular",
    "Skill paths",
    "Career paths",
];

const ExploreMore = () => {
    const [currentTab,setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard,setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)

    const setMyCards = (value) => {
        setCurrentTab(value);
        const result = HomePageExplore.filter((course)=> course.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading)
    }
  return (
    <div>

        <div className='text-4xl font-semibold text-center' >
            Unlock the 
            <HighlightText text={"Power of Code"} />
        </div>

        <p className='text-center text-richblack-300 text-lg font-semibold mt-3' >
            Learn to build anything you can imagine
        </p>
    </div>
  )
}

export default ExploreMore