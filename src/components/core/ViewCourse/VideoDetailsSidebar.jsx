import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import IconBtn from '../../common/IconBtn';
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { VscNotebook } from "react-icons/vsc"

const VideoDetailsSidebar = ({setReviewModal}) => {

    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const navigate = useNavigate();
    const {sectionId, subSectionId} = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state)=>state.viewCourse);

    useEffect(() => {
      const setActiveFlags = () => {
        if(!courseSectionData.length) return;
        const currentSectionIndex = courseSectionData.findIndex(
            (sec) => sec._id === sectionId)

        const currentSubSectionIndex =  courseSectionData?.[currentSectionIndex]?.subSection.findIndex(
            (subSec)=> subSec._id === subSectionId
        )    

        setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
        setVideoBarActive(courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex]?._id )
      }
      
      setActiveFlags();
    }, [courseSectionData, sectionId, subSectionId])
    
    return (
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
            {/* Header Section */}
            <div className="mx-5 flex flex-col items-start justify-between gap-4 border-b border-richblack-600 py-6">
                <div className="flex w-full items-center justify-between">
                    <div 
                        onClick={()=> navigate("/dashboard/enrolled-courses")}
                        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-95 transition-all duration-200 cursor-pointer shadow-md"
                        title="Back to Courses"
                    >
                        <IoIosArrowBack size={24} />
                    </div>
                    <IconBtn 
                        text="Add Review"
                        customClasses="ml-auto !bg-yellow-50 !text-richblack-900 border-none font-bold py-2 px-5 hover:scale-105 transition-all duration-300 shadow-lg shadow-yellow-200/20"
                        onclick={() => setReviewModal(true)}
                    />
                </div>
                
                <div className='flex items-center gap-4 w-full'>
                    <img 
                        src={courseEntireData?.thumbnail} 
                        alt="Course Thumbnail" 
                        className="h-16 w-16 rounded-lg object-cover shadow-lg border border-richblack-700"
                    />
                    <div className="flex flex-col gap-1 flex-1">
                        <p className="text-xl font-bold text-richblack-25 tracking-tight line-clamp-1">{courseEntireData?.courseName}</p>
                        <p className="text-xs font-bold text-caribbeangreen-100 bg-caribbeangreen-900/30 px-2 py-0.5 rounded-md w-fit">
                            {completedLectures?.length} / {totalNoOfLectures} Lectures
                        </p>
                    </div>
                </div>
            </div>

            {/* Sections and SubSections List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {courseSectionData.map((section, index)=> (
                    <div
                        className="mt-2 cursor-pointer text-sm text-richblack-5"
                        key={index}
                    >
                        {/* Section Header */}
                        <div 
                            onClick={() => setActiveStatus(activeStatus === section._id ? "" : section._id)}
                            className={`flex flex-row justify-between items-center transition-all duration-300 px-5 py-4 ${activeStatus === section._id ? "bg-richblack-700" : "bg-richblack-800 hover:bg-richblack-700/50"}`}
                        >
                            <div className="w-[80%] font-bold text-[15px] tracking-wide">
                                {section?.sectionName}
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[12px] font-bold text-richblack-300">
                                    {(() => {
                                        let totalSec = 0;
                                        section.subSection.forEach(sub => totalSec += parseInt(sub.timeDuration) || 0);
                                        return `${Math.floor(totalSec / 60)}min`;
                                    })()}
                                </span>
                                <span
                                    className={`${
                                        activeStatus === section._id ? "rotate-0" : "-rotate-90"
                                    } transition-all duration-300 text-richblack-300`}
                                >
                                    <BsChevronDown />
                                </span>
                            </div>
                        </div>

                        {/* SubSections (Lectures) */}
                        <div className={`transition-all duration-500 overflow-hidden ${activeStatus === section._id ? "max-h-[1000px]" : "max-h-0"}`}>
                            {section.subSection.map((lecture, i) => (
                                <div
                                    className={`flex items-center gap-4 px-6 py-3 transition-all duration-200 relative group ${
                                        videoBarActive === lecture._id
                                            ? "bg-yellow-200 font-extrabold text-richblack-900"
                                            : "hover:bg-richblack-900 text-richblack-200"
                                    }`}
                                    key={i}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${lecture?._id}`);
                                        setVideoBarActive(lecture?._id);
                                    }}
                                >
                                    {/* Active Indicator Arrow */}
                                    {videoBarActive === lecture._id && (
                                        <div className="absolute left-0 h-full w-1 bg-yellow-50 shadow-[0_0_10px_rgba(255,214,10,0.5)]"></div>
                                    )}
                                    
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="relative">
                                            <input
                                                type='checkbox'
                                                checked={completedLectures.includes(lecture?._id)}
                                                onChange={() => {}}
                                                className="h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-richblack-600 bg-richblack-700 checked:bg-caribbeangreen-200 checked:border-caribbeangreen-200 transition-all duration-200"
                                            />
                                            {completedLectures.includes(lecture?._id) && (
                                                <svg className="absolute top-1 left-1 w-3 h-3 text-richblack-900 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[14px] leading-tight flex items-center gap-2">
                                                <VscNotebook className={videoBarActive === lecture._id ? "text-richblack-900" : "text-richblack-300"} />
                                                {lecture.title}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoDetailsSidebar
