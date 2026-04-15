import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import CourseCard from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
// import { useSelector } from 'react-redux';

const Catalog = () => {

    const {catalogName} = useParams();
    
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");
    const [active, setActive] = useState(1)
    const [loading, setLoading] = useState(false)
    const [sortedCourses, setSortedCourses] = useState([]);
    
    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
            setLoading(true)
            const res = await apiConnector("GET", categories.CATEGORIES_API);
            
            const category_id = 
            res?.data?.data?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName.split(" ").join("-").toLowerCase())[0]?._id;
            
            if (category_id) {
                setCategoryId(category_id);
            }
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            setLoading(true)
            try{
                const res = await getCatalogaPageData(categoryId);
                // console.log("PRinting res: ", res);
                if (res.success) {
                    setCatalogPageData(res);
                }
                else{
                    setCatalogPageData(null)
                }
                setLoading(false)
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);

    // Update sorted courses based on active tab
    useEffect(() => {
        if (!catalogPageData) return;
        
        let courses = [...(catalogPageData?.selectedCourses?.course || [])];
        if (active === 1) {
            // Most Popular - Sort by students enrolled
            courses.sort((a, b) => (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0));
        } else if (active === 2) {
            // New - Sort by creation date
            courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (active === 3) {
            // Trending - Sort by rating count or something else (simplified to most selling for now)
            courses.sort((a, b) => (b.ratingAndReviews?.length || 0) - (a.ratingAndReviews?.length || 0));
        }
        setSortedCourses(courses);
    }, [active, catalogPageData]);

    if(loading){
        return (
        <div className=' h-screen flex justify-center items-center text-richblack-100 mx-auto  text-3xl'>
        <p>
                Loading...
        </p>
        </div>
    )}
    
    if(!catalogPageData) {
        return <div className=' text-center text-xl text-richblack-300 my-8'> No Courses for the category </div>
    }

    return (
        <>
            {/* Header Section */}
            <div className=" box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className="text-sm text-richblack-300">{`Home / Catalog / `}
                        <span className="text-yellow-25">
                            {catalogPageData?.name}
                        </span>
                    </p>
                    <div className='flex flex-row justify-between items-start'>
                        <div className='flex flex-col gap-4'>
                            <p className="text-3xl text-richblack-5"> {catalogPageData?.name} </p>
                            <p className="max-w-[870px] text-richblack-200"> {catalogPageData?.description}</p>
                        </div>
                        {/* Related Resources - If any */}
                        <div className='hidden lg:flex flex-col gap-2'>
                            <p className='text-richblack-5 font-bold mb-2'>Related resources</p>
                            <ul className='text-richblack-300 text-sm list-disc flex flex-col gap-2 ml-4'>
                                <li className='cursor-pointer hover:text-yellow-25 transition-all duration-200'>Doc {catalogPageData?.name}</li>
                                <li className='cursor-pointer hover:text-yellow-25 transition-all duration-200'>Cheatsheets</li>
                                <li className='cursor-pointer hover:text-yellow-25 transition-all duration-200'>Articles</li>
                                <li className='cursor-pointer hover:text-yellow-25 transition-all duration-200'>Community Forums</li>
                                <li className='cursor-pointer hover:text-yellow-25 transition-all duration-200'>Projects</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
                {/* section1: Courses to get you started */}
                <div className="section_heading text-richblack-5 text-4xl font-bold">Courses to get you started</div>
                <div className="my-4 flex border-b border-b-richblack-600 text-sm">
                    <p
                        className={`px-4 py-2 ${
                            active === 1
                                ? "border-b border-b-yellow-25 text-yellow-25"
                                : "text-richblack-50"
                        } cursor-pointer transition-all duration-200`}
                        onClick={() => setActive(1)}
                    >
                        Most Popular
                    </p>
                    <p
                        className={`px-4 py-2 ${
                            active === 2
                                ? "border-b border-b-yellow-25 text-yellow-25"
                                : "text-richblack-50"
                        } cursor-pointer transition-all duration-200`}
                        onClick={() => setActive(2)}
                    >
                        New
                    </p>
                    <p
                        className={`px-4 py-2 ${
                            active === 3
                                ? "border-b border-b-yellow-25 text-yellow-25"
                                : "text-richblack-50"
                        } cursor-pointer transition-all duration-200`}
                        onClick={() => setActive(3)}
                    >
                        Trending
                    </p>
                </div>
                <div className='py-8'>
                    <CourseSlider Courses={sortedCourses} />
                </div>

                {/* section2: Top courses in [Category] and [Different Category] */}
                <div className="py-12">
                    <div className="section_heading text-richblack-5 text-4xl font-bold mb-8">
                        Top courses in {catalogPageData?.name} and {catalogPageData?.differentCourses?.name}
                    </div>
                    <div className="py-4">
                        <CourseSlider Courses={catalogPageData?.differentCourses?.course}/>
                    </div>
                </div>

                {/* section3: Frequently Bought Together */}
                <div className="py-12">
                    <div className="section_heading text-richblack-5 text-4xl font-bold mb-8">Frequently Bought Together</div>
                    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                        {
                            catalogPageData?.mostSellingCourses && catalogPageData.mostSellingCourses.length > 0 ? (
                                catalogPageData.mostSellingCourses.slice(0, 4).map((course, index) => (
                                    <CourseCard course={course} key={index} Height={"h-[400px]"}/>
                                ))
                            ) : (
                                <p className='text-richblack-50 text-xl'>No most selling courses available</p>
                            )
                        }
                    </div>
                </div>
            </div>
            
            <Footer />
        </>
    )
}

export default Catalog
