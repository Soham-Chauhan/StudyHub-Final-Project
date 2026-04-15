import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import { useNavigate } from 'react-router-dom';

const PurchaseHistory = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState(null);

    const getEnrolledCourses = useCallback(async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            setEnrolledCourses(response);
        } catch (error) {
            console.log("Unable to Fetch Enrolled Courses");
        }
    }, [token])

    useEffect(() => {
        getEnrolledCourses();
    }, [getEnrolledCourses]);

    return (
        <div className="text-white">
            <h1 className="text-3xl font-medium text-richblack-5 mb-14">Purchase History</h1>
            
            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="spinner"></div>
                </div>
            ) : !enrolledCourses.length ? (
                <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
                    You have not purchased any courses yet.
                </p>
            ) : (
                <div className="rounded-t-lg bg-richblack-700 text-richblack-50">
                    <div className="flex border-b border-richblack-600">
                        <p className="w-[45%] px-5 py-3 text-richblack-100">Course Name</p>
                        <p className="w-1/4 px-2 py-3 text-richblack-100 text-center">Price</p>
                        <p className="flex-1 px-2 py-3 text-richblack-100 text-center">Status</p>
                    </div>
                    {enrolledCourses.map((course, i, arr) => (
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
                                        `/courses/${course?._id}`
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
                            <div className="w-1/4 px-2 py-3 text-center text-richblack-50">
                                ₹{course.price || 0}
                            </div>
                            <div className="flex w-1/5 flex-col gap-2 px-2 py-3 items-center">
                                <span className="bg-caribbeangreen-100 text-caribbeangreen-600 px-3 py-1 rounded-full text-xs font-bold">
                                    Purchased
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PurchaseHistory;
