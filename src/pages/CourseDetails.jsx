import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { buyCourse } from '../services/operations/studentFeaturesAPI';
import { fetchCourseDetails } from '../services/operations/courseDetailsAPI';
import GetAvgRating from '../utils/avgRating';
import Error from "./Error"
import ConfirmationModal from "../components/common/ConfirmationModal"
import RatingStars from "../components/common/RatingStars"
import { formatDate } from '../services/formatDate';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import { BsGlobe } from 'react-icons/bs';
import { BiVideo } from 'react-icons/bi';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import CourseDetailsCard from '../components/core/Course/CourseDetailsCard';
import { toast } from 'react-hot-toast';
import Footer from '../components/common/Footer'
import { addToCart } from '../slices/cartSlice';
import ReviewSlider from '../components/common/ReviewSlider';

const CourseDetails = () => {
    const {token} = useSelector((state)=> state.auth)
    const {user} = useSelector((state) => state.profile )
    const {loading} = useSelector((state) => state.profile);
    const {courseId} = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null)
    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(() => {
      const getCourseFullDetails = async() => {
        try {
            const result = await fetchCourseDetails(courseId);
            // console.log("Printing CourseData-> " , result);
                setCourseData(result);
        } catch (error) {
            toast.error("Could not get course")
            console.log("Could not fetch coursse details");
        }
      }

      getCourseFullDetails();
    }, [courseId])
    
    useEffect(() => {
      const count = GetAvgRating(courseData?.data?.courseDetails.ratingAndReviews);
      setAvgReviewCount(count);
    }, [courseData])
    
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
      let lectures = 0;
      courseData?.data?.courseDetails?.courseContent?.forEach((sec) => {
        lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
    }, [courseData])
    
    //Will store sectionIds for enabling the dropdown
    const [isActive, setIsActive] = useState([]);
    const handleActive = (id)=> {
        setIsActive(
            !isActive.includes(id) ? isActive.concat(id) : isActive.filter((e)=> e !== id)
        )
    }

    const handleBuyCourse = () => {
        if (token) {
            buyCourse(token, [courseId], user, navigate,dispatch);
            return;
        }
        setConfirmationModal({
            text1:"you are not Logged in",
            text2:"Please login to purchase the course",
            btn1Text:"Login",
            btn2Text:"Cancel",
            btn1Handler:() => navigate("/login"),
            btn2Handler:()=>setConfirmationModal(null),
        })
    }

    if(loading || !courseData) {
        return (
            <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
                <div className='spinner'></div>
            </div>
        )
    }

    if(!courseData.success) {
        return (
            <div>
                <Error />
            </div>
        )
    }

    const {
        courseName,
        description,
        thumbnail,
        price, 
        whatWillYouLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
        category
    } = courseData.data?.courseDetails;

  return (
    <>
        {/* Details and Course Buy Card */}
        <div className='relative w-full bg-richblack-800'>
            <div className='mx-auto box-content px-4 lg:w-[1260px] 2xl:relative '>
                <div className='mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]'>
                   
                   <div className='relative block max-h-[30rem] lg:hidden'>
                        <div className='absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]'>
                        </div>
                        <img src={thumbnail} alt={courseName} className='aspect-auto w-full'/>
                   </div>

                   <div className='z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5'>
                        <div className='flex gap-2 text-[15px] text-richblack-300 font-medium'>
                            <p className='cursor-pointer hover:text-richblack-5 transition-all duration-200' onClick={() => navigate("/")}>Home</p>
                            <span>/</span>
                            <p className='cursor-pointer hover:text-richblack-5 transition-all duration-200'>Learning</p>
                            <span>/</span>
                            <p className='text-yellow-25 font-bold'>{category?.name}</p>
                        </div>
                        <p className='text-4xl font-bold text-richblack-5 sm:text-[42px]'>{courseName}</p>
                        <p className='text-richblack-200'>{description}</p>
                        
                        <div className='text-md flex flex-wrap items-center gap-2'>
                            <span className='text-yellow-25'>{avgReviewCount || 0}</span>
                            <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                            <span className='text-richblack-300'>{`(${ratingAndReviews.length} reviews) `}</span>
                            <span className='text-richblack-300'>{`(${studentsEnrolled.length} students enrolled)`}</span>
                        </div>

                        <div>
                            <p className='text-richblack-5'>Created By <span className='text-yellow-25 font-semibold'>{`${instructor.firstName} ${instructor.lastName}`}</span></p>
                        </div>

                        <div className='flex flex-wrap gap-5 text-lg'>
                            <p className='flex items-center gap-2 text-richblack-50'>
                                <IoIosInformationCircleOutline className='text-richblack-25'/>
                                Created At {formatDate(createdAt)}
                            </p>
                            <p className='flex items-center gap-2 text-richblack-50'>
                                <BsGlobe className='text-richblack-25'/>
                                English
                            </p>
                        </div>
                   </div>
                   
                   <div className='flex w-full flex-row gap-4 border-y border-y-richblack-500 py-4 lg:hidden'>
                        <p className='flex-1 text-3xl font-semibold text-richblack-5'>
                            Rs. {price}
                        </p>
                        <div className='flex gap-4'>
                            <button className='yellowButton' onClick={handleBuyCourse}>Buy Now</button>
                            <button className='blackButton' onClick={() => dispatch(addToCart(courseData.data.courseDetails))}>Add to Cart</button>
                        </div>
                   </div>
                </div>
                
                {/* Floating Card */}
                <div className='right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block'>
                    <CourseDetailsCard 
                        course = {courseData?.data?.courseDetails}
                        setConfirmationModal = {setConfirmationModal}
                        handleBuyCourse = {handleBuyCourse}
                    />
                </div>
            </div>
        </div>

        {/* What will you learn, Course Content, Sections dropdown, Author */}
        <div className='mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]'>
            <div className='mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]'>
                <div className='my-10 border border-richblack-700 bg-[#000814] p-10 rounded-2xl shadow-2xl shadow-richblack-900'>
                    <p className='text-3xl font-bold mb-8 tracking-tight'>What you'll learn</p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 text-richblack-100 text-[15px] font-medium leading-relaxed'>
                        {whatWillYouLearn?.split('\n').map((item, index) => (
                            <p key={index} className='flex items-start gap-4 transform transition-all duration-200 hover:translate-x-1 outline-none'>
                                <span className='text-caribbeangreen-100 mt-1 flex-shrink-0'><BiVideo size={18}/></span>
                                {item}
                            </p>
                        ))}
                    </div>
                </div>
            
                <div className='max-w-[830px]'>
                    <div className='flex flex-col gap-3'>
                        <p className='text-[28px] font-semibold'>Course Content</p>
                        <div className='flex flex-wrap justify-between items-center gap-4 mt-2'>
                            <div className='flex gap-4 text-sm text-richblack-300 font-bold'>
                                <span>{courseContent.length} sections</span>
                                <span className='text-richblack-600 font-normal'>•</span>
                                <span>{totalNoOfLectures} lectures</span>
                                <span className='text-richblack-600 font-normal'>•</span>
                                <span>{courseData.data?.totalDuration} total length</span>
                            </div>
                            <div>
                                <button
                                    className='text-yellow-25 text-sm font-semibold hover:underline'
                                    onClick={() => setIsActive([])}>
                                    Collapse all Sections
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='py-4'>
                        {courseContent.map((section) => (
                            <div key={section._id} className='overflow-hidden border border-solid border-richblack-600 bg-richblack-800 text-richblack-5 first:rounded-t-xl last:rounded-b-xl transition-all duration-200'>
                                {/* Section */}
                                <div onClick={() => handleActive(section._id)} className='flex cursor-pointer items-center justify-between bg-richblack-700 bg-opacity-40 px-8 py-6 transition-all duration-200 hover:bg-opacity-60'>
                                    <div className='flex items-center gap-3'>
                                        <MdOutlineArrowForwardIos 
                                            className={`transition-all duration-300 transform ${isActive.includes(section._id) ? '-rotate-90' : 'rotate-90'}`}
                                            size={16}
                                        />
                                        <p className='font-bold text-lg'>{section.sectionName}</p>
                                    </div>
                                    <div className='flex items-center gap-4 text-yellow-25 text-sm font-bold'>
                                        <span>
                                            {`${section.subSection.length} lecture(s)`}
                                        </span>
                                        <span className='w-1 h-1 bg-yellow-25 rounded-full'></span>
                                        <span>
                                            {(() => {
                                                let totalSec = 0;
                                                section.subSection.forEach(sub => {
                                                    totalSec += parseInt(sub.timeDuration) || 0;
                                                });
                                                const minutes = Math.floor(totalSec / 60);
                                                const seconds = totalSec % 60;
                                                return `${minutes}min ${seconds}s`;
                                            })()}
                                        </span>
                                    </div>
                                </div>

                                {/* SubSections */}
                                <div 
                                    className={`relative bg-richblack-900 transition-all duration-500 ease-in-out ${isActive.includes(section._id) ? 'max-h-[2000px] py-6' : 'max-h-0'}`}
                                    style={{ overflow: 'hidden' }}
                                >
                                    {section.subSection.map((subSection) => (
                                        <div key={subSection._id} className='flex items-center justify-between px-12 py-4 text-richblack-100 hover:text-richblack-5 transition-all duration-200 group border-b border-richblack-800 last:border-none'>
                                            <div className='flex items-center gap-4'>
                                                <BiVideo className='text-richblack-300 group-hover:text-yellow-25 transition-all duration-200' size={20}/>
                                                <p className='text-[15px] font-medium capitalize tracking-wide leading-relaxed'>{subSection.title}</p>
                                            </div>
                                            <div className='text-richblack-400 text-sm font-medium'>
                                                {(() => {
                                                    const totalSec = parseInt(subSection.timeDuration) || 0;
                                                    const minutes = Math.floor(totalSec / 60);
                                                    const seconds = totalSec % 60;
                                                    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                                                })()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='mb-12 py-4'>
                        <p className="text-[28px] font-semibold mb-6">Author</p>
                        <div className='flex items-center gap-4 py-4'>
                            <img className='h-14 w-14 rounded-full object-cover border-2 border-richblack-700' src={instructor.image} alt='Author'/>
                            <p className='text-xl font-semibold text-richblack-5'>{instructor.firstName} {instructor.lastName}</p>
                        </div>
                        <p className='text-richblack-100 leading-7'>
                            {instructor.additionalDetails.about || "Digital Educator and Technical Mentor."}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Reviews Section */}
        <div className='mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px] pb-24 pt-16 border-t border-richblack-700'>
            <p className='text-[32px] font-bold text-center mb-14 tracking-tight'>Reviews from other learners</p>
            <ReviewSlider />
        </div>
        
        <Footer/>
        {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </>
  )
}

export default CourseDetails
