import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';
import { setCompletedLectures, setCourseSectionData, setEntireCourseData, setTotalNoOfLectures } from '../slices/viewCourseSlice';
import VideoDetailsSidebar from '../components/core/ViewCourse/VideoDetailsSidebar';
import CourseReviewModal from '../components/core/ViewCourse/CourseReviewModal';
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx"

const ViewCourse = () => {
    const [reviewModal, setReviewModal] = useState(false)
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
    const {courseId} = useParams();
    const {token} = useSelector((state)=> state.auth);
    const dispatch = useDispatch();

    // useEffect(() => {
    //     dispatch(setCourseSectionData([]));
        
    //     dispatch(setEntireCourseData([]));
        
    //     dispatch(setCompletedLectures(0))
        
    // }, [])
    

    useEffect(() => {
    const setCourseSpecificDetails = async () => {
        // console.log("In video details page", courseId)
        const courseData = await getFullDetailsOfCourse(courseId, token);
        dispatch(setCourseSectionData(courseData.courseDetails.courseContent));
        
        dispatch(setEntireCourseData(courseData.courseDetails));
        
        dispatch(setCompletedLectures(courseData.completedVideos));
        
        let lectures = 0;
        courseData.courseDetails.courseContent.forEach((sec) => {
            lectures += sec.subSection.length
        } )
        dispatch(setTotalNoOfLectures(lectures))
    }
    
    setCourseSpecificDetails()
    },[courseId, dispatch, token])
    
  return (
    <>
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
            <div className="hidden md:block">
              <VideoDetailsSidebar setReviewModal={setReviewModal} />
            </div>
            {mobileSidebarOpen && (
              <div
                className="fixed inset-0 z-[950] bg-black/40 md:hidden"
                onClick={() => setMobileSidebarOpen(false)}
              />
            )}
            <div
              className={`fixed left-0 top-14 z-[1000] h-[calc(100vh-3.5rem)] transition-transform duration-200 md:hidden ${
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <VideoDetailsSidebar setReviewModal={setReviewModal} />
            </div>
            <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                <div className="mx-3 py-4 sm:mx-6">
                  <button
                    className="mb-4 inline-flex items-center gap-2 rounded-md border border-richblack-700 bg-richblack-800 px-3 py-2 text-richblack-50 md:hidden"
                    onClick={() => setMobileSidebarOpen((prev) => !prev)}
                  >
                    {mobileSidebarOpen ? <RxCross2 size={18} /> : <RxHamburgerMenu size={18} />}
                    Course Menu
                  </button>
                <Outlet />
                </div>
            </div>
            {reviewModal && (<CourseReviewModal setReviewModal={setReviewModal} />)}
        </div>
        
    </>
  )
}

export default ViewCourse
