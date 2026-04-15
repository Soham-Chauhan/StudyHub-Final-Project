import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])

  return (
    <div className='group transition-all duration-300'>
        <Link to={`/courses/${course._id}`}>
            <div className='flex flex-col gap-3 rounded-2xl bg-richblack-800 p-4 border border-richblack-700 transition-all duration-300 group-hover:bg-richblack-700 group-hover:shadow-2xl group-hover:shadow-richblack-900 group-hover:-translate-y-2'>
                <div className="overflow-hidden rounded-xl">
                    <img 
                        src={course?.courseName.includes("Go Programming") ? "https://img.freepik.com/free-vector/video-game-developer-concept-illustration_114360-5926.jpg" : (course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800")}
                        alt={course?.courseName}
                        className={`${Height} w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-110 `}
                    />
                </div>
                <div className="flex flex-col gap-2 px-1 py-1">
                    <p className="text-xl font-bold text-richblack-5 tracking-tight line-clamp-2 min-h-[56px]">{course?.courseName}</p>
                    <p className="text-[15px] font-medium text-richblack-300">{course?.instructor?.firstName} {course?.instructor?.lastName} </p>
                    <div className="flex items-center gap-3">
                        <div className='flex items-center gap-1'>
                            <span className="text-yellow-50 font-bold">{avgReviewCount || 0}</span>
                            <RatingStars Review_Count={avgReviewCount} />
                        </div>
                        <span className="text-richblack-400 font-medium text-sm">{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className="text-2xl font-extrabold text-richblack-5 mt-2">₹ {course?.price}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default Course_Card
