import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses, removeEnrolledCourse } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {

    const {token}  = useSelector((state) => state.auth);
    const navigate = useNavigate()
    const [enrolledCourses, setEnrolledCourses] = useState(null);


    const getEnrolledCourses = useCallback(async() => {
        try{
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        }
        catch(error) {
            console.log("Unable to Fetch Enrolled Courses");
        }
    }, [token])

    const [viewData, setViewData] = useState("all")

    useEffect(()=> {
        getEnrolledCourses();
    },[getEnrolledCourses]);

    const filteredCourses = enrolledCourses?.filter((course) => {
        if (viewData === "all") return true
        if (viewData === "pending") return (course.progressPercentage || 0) < 100
        if (viewData === "completed") return (course.progressPercentage || 0) === 100
        return true
    })

  return (
    <>
        <div className="text-3xl font-medium text-richblack-5">Enrolled Courses</div>
        {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
        </div>
        ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
            You have not enrolled in any course yet.
        </p>
        ) : (
        <div className="my-8 text-richblack-5">
            {/* Tabs */}
            <div className="flex bg-richblack-800 p-1 gap-x-1 rounded-full max-w-max mb-7 border-b border-richblack-600">
                <button
                    onClick={() => setViewData("all")}
                    className={`px-5 py-2 rounded-full transition-all duration-200 ${
                        viewData === "all" ? "bg-richblack-900 text-richblack-5" : "text-richblack-300"
                    }`}
                >
                    All
                </button>
                <button
                    onClick={() => setViewData("pending")}
                    className={`px-5 py-2 rounded-full transition-all duration-200 ${
                        viewData === "pending" ? "bg-richblack-900 text-richblack-5" : "text-richblack-300"
                    }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setViewData("completed")}
                    className={`px-5 py-2 rounded-full transition-all duration-200 ${
                        viewData === "completed" ? "bg-richblack-900 text-richblack-5" : "text-richblack-300"
                    }`}
                >
                    Completed
                </button>
            </div>

            {/* Table */}
            <div className="rounded-t-lg bg-richblack-700 text-richblack-50">
                <div className="flex border-b border-richblack-600">
                    <p className="w-[45%] px-5 py-3 text-richblack-100">Course Name</p>
                    <p className="w-1/4 px-2 py-3 text-richblack-100 text-center">Duration</p>
                    <p className="flex-1 px-2 py-3 text-richblack-100 text-center">Progress</p>
                    <p className="w-[10%] px-2 py-3 text-richblack-100 text-center">Actions</p>
                </div>
                {/* Courses */}
                {filteredCourses.map((course, i, arr) => (
                    <div
                        className={`flex items-center border-b border-richblack-600 last:border-b-0 ${
                            i === arr.length - 1 ? "rounded-b-lg" : ""
                        }`}
                        key={i}
                    >
                        <div
                            className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-4"
                            onClick={() => {
                                navigate(
                                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                )
                            }}
                        >
                            <img
                                src={course.thumbnail}
                                alt="course_img"
                                className="h-14 w-14 rounded-lg object-cover"
                            />
                            <div className="flex max-w-xs flex-col gap-2">
                                <p className="font-semibold">{course.courseName}</p>
                                <p className="text-xs text-richblack-300">
                                    {course.description.length > 50
                                        ? `${course.description.slice(0, 50)}...`
                                        : course.description}
                                </p>
                            </div>
                        </div>
                        <div className="w-1/4 px-2 py-3 text-center">{course?.totalDuration}</div>
                        <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                            <p className="text-sm font-medium">Progress: {course.progressPercentage || 0}%</p>
                            <ProgressBar
                                completed={course.progressPercentage || 0}
                                height="8px"
                                isLabelVisible={false}
                                bgColor={course.progressPercentage === 100 ? "#05A77B" : "#47A5C5"}
                            />
                        </div>
                        <div className="w-[10%] px-2 py-3 text-center relative group">
                            <button className="text-2xl text-richblack-300 hover:text-richblack-50 p-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            <div className="hidden group-hover:block absolute right-0 top-10 bg-richblack-800 border border-richblack-700 rounded-md py-2 w-48 z-10 shadow-2xl">
                                <button className="w-full text-left px-4 py-2 hover:bg-richblack-700 flex items-center gap-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                    Mark as Completed
                                </button>
                                <button
                                    onClick={async () => {
                                        const success = await removeEnrolledCourse(course._id, token);
                                        if (success) {
                                            getEnrolledCourses();
                                        }
                                    }}
                                    className="w-full text-left px-4 py-2 hover:bg-richblack-700 text-pink-200 flex items-center gap-2"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        )}
    </>
  )
}

export default EnrolledCourses
