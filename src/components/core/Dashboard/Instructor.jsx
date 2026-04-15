import React from 'react'
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"

const Instructor = () => {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])

  useEffect(() => {
    (async ()=> {
      setLoading(true);

      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      
      if (instructorApiData.length) {
        setInstructorData(instructorApiData)
      }
      if (result) {
        setCourses(result)
      }
      setLoading(false)
    })()
  }, [token])

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  )

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  )
  
  return (
    <div>
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-richblack-5">
        Hi {user?.firstName} 👋
      </h1>
      <p className="font-medium text-richblack-200">
        Let's start something new
      </p>
    </div>
    {
      loading ? (
      <div className="spinner"></div>
    ) : courses.length > 0 ? (
      <div>
        <div className="my-4 flex h-[450px] space-x-4">
          {/* Render chart / graph */}
          {totalAmount > 0 || totalStudents > 0 ? (
            <InstructorChart courses={instructorData} />
          ) : (
            <div className="flex-1 rounded-md bg-richblack-800 p-6 shadow-[0px_0px_20px_rgba(0,0,0,0.5)] border border-richblack-700">
                <p className="text-xl font-bold text-richblack-5">Visual Insights</p>
                <div className="flex h-full items-center justify-center">
                    <p className="text-2xl font-medium text-richblack-300 italic">
                        Not enough data to generate insights yet
                    </p>
                </div>
            </div>
          )}
          {/* Total Statistics */}
          <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6 shadow-[0px_0px_20px_rgba(0,0,0,0.5)] border border-richblack-700">
            <p className="text-xl font-bold text-richblack-5">Statistics</p>
            <div className="mt-4 space-y-6">
              <div className="group relative cursor-help">
                <p className="text-lg text-richblack-300 group-hover:text-yellow-50 transition-colors">Total Courses</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-50 to-yellow-200">
                  {courses.length}
                </p>
                <div className="absolute -top-10 left-0 hidden group-hover:flex w-max bg-richblack-900 text-richblack-5 text-xs px-3 py-2 rounded-md border border-richblack-700 z-[100] shadow-xl">
                    Total courses you have created so far.
                </div>
              </div>
              <div className="group relative cursor-help">
                <p className="text-lg text-richblack-300 group-hover:text-[#05A77B] transition-colors">Total Students</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#05A77B] to-caribbeangreen-100">
                  {totalStudents}
                </p>
                <div className="absolute -top-10 left-0 hidden group-hover:flex w-max bg-richblack-900 text-richblack-5 text-xs px-3 py-2 rounded-md border border-richblack-700 z-[100] shadow-xl">
                    Total students enrolled across all your courses.
                </div>
              </div>
              <div className="group relative cursor-help">
                <p className="text-lg text-richblack-300 group-hover:text-[#47A5C5] transition-colors">Total Income</p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#47A5C5] to-blue-100">
                  ₹{totalAmount.toLocaleString()}
                </p>
                <div className="absolute -top-10 left-0 hidden group-hover:flex w-max bg-richblack-900 text-richblack-5 text-xs px-3 py-2 rounded-md border border-richblack-700 z-[100] shadow-xl">
                    Total revenue earned from your courses.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-md bg-richblack-800 p-6">
          {/* Render 3 courses */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-richblack-5">Your Courses</p>
            <Link to="/dashboard/my-courses">
              <p className="text-xs font-semibold text-yellow-50">View All</p>
            </Link>
          </div>
          <div className="my-4 flex items-start space-x-6">
            {courses.slice(0, 3).map((course) => (
              <div key={course._id} className="w-1/3">
                <img
                  src={course.thumbnail}
                  alt={course.courseName}
                  className="h-[201px] w-full rounded-md object-cover"
                />
                <div className="mt-3 w-full">
                  <p className="text-sm font-medium text-richblack-50">
                    {course.courseName}
                  </p>
                  <div className="mt-1 flex items-center space-x-2">
                    <p className="text-xs font-medium text-richblack-300">
                      {course.studentsEnrolled.length} students
                    </p>
                    <p className="text-xs font-medium text-richblack-300">
                      |
                    </p>
                    <p className="text-xs font-medium text-richblack-300">
                      Rs. {course.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ) : (
      <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
        <p className="text-center text-2xl font-bold text-richblack-5">
          You have not created any courses yet
        </p>
        <Link to="/dashboard/add-course">
          <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
            Create a course
          </p>
        </Link>
      </div>
    )}
  </div>
  )
}

export default Instructor
