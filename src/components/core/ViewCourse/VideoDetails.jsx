import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { markLectureAsComplete } from '../../../services/operations/courseDetailsAPI';
import { updateCompletedLectures } from '../../../slices/viewCourseSlice';
import { BigPlayButton, Player } from "video-react"
import 'video-react/dist/video-react.css';
import IconBtn from '../../common/IconBtn';
import { formatDate } from '../../../services/formatDate';

const VideoDetails = () => {
    const {courseId, sectionId, subSectionId} = useParams();
    const navigate = useNavigate(); 
    const dispatch = useDispatch();
    const playerRef = useRef();
    const {token} = useSelector((state)=>state.auth);
    const {courseSectionData, courseEntireData, completedLectures} = useSelector((state)=>state.viewCourse);
    const [previewSource, setPreviewSource] = useState("")
    const [videoData, setVideoData] = useState(null);
    const [videoEnded, setVideoEnded] = useState(false);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        const setVideoSpecificDetails = () => {
            if(!courseSectionData.length) return;
            if(!courseId && !sectionId && !subSectionId) {
                navigate("/dashboard/enrolled-courses");
            }
            else {
                const filteredData = courseSectionData.filter((course) => course._id === sectionId)
                const filteredVideoData = filteredData?.[0]?.subSection.filter((data) => data._id === subSectionId)
                setVideoData(filteredVideoData?.[0]);
                setPreviewSource(courseEntireData.thumbnail)
                setVideoEnded(false);
            }
        }
        setVideoSpecificDetails();
    }, [courseId, courseSectionData, courseEntireData, navigate, sectionId, subSectionId])
    
    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)
        return currentSectionIndex === 0 && currentSubSectionIndex === 0;
    } 

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)
        return currentSectionIndex === courseSectionData.length - 1 && currentSubSectionIndex === noOfSubSections - 1;
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const noOfSubSections = courseSectionData[currentSectionIndex].subSection.length;
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)

        if(currentSubSectionIndex !== noOfSubSections - 1) {
            const nextSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex + 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        } else {
            const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
            const nextSubSectionId = courseSectionData[currentSectionIndex + 1].subSection[0]._id;
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData.findIndex((data) => data._id === sectionId)
        const currentSubSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex((data) => data._id === subSectionId)

        if(currentSubSectionIndex !== 0 ) {
            const prevSubSectionId = courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex - 1]._id;
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        } else {
            const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
            const prevSubSectionLength = courseSectionData[currentSectionIndex - 1].subSection.length;
            const prevSubSectionId = courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion = async() => {
        setLoading(true);
        const res = await markLectureAsComplete({courseId: courseId, subSectionId: subSectionId}, token);
        if(res) {
            dispatch(updateCompletedLectures(subSectionId)); 
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col gap-5 text-white pr-4">
            {!videoData ? (
                <div className='relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl'>
                    <img
                        src={previewSource}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                    <div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
                        <div className='spinner'></div>
                    </div>
                </div>
            ) : (
                <div className='overflow-hidden rounded-2xl shadow-2xl border border-richblack-700 bg-richblack-900'>
                    <Player
                        ref={playerRef}
                        aspectRatio="16:9"
                        playsInline
                        onEnded={() => setVideoEnded(true)}
                        src={videoData?.videoUrl}
                    >
                        <BigPlayButton position="center" />     
                        {videoEnded && (
                            <div className="absolute inset-0 z-[100] grid h-full place-content-center bg-black/70 backdrop-blur-sm font-inter">
                                {!completedLectures.includes(subSectionId) && (
                                    <IconBtn 
                                        disabled={loading}
                                        onclick={() => handleLectureCompletion()}
                                        text={!loading ? "Mark As Completed" : "Loading..."}
                                        customClasses="text-xl max-w-max px-6 mx-auto !bg-yellow-50 !text-richblack-900"
                                    />
                                )}
                                <IconBtn 
                                    disabled={loading}
                                    onclick={() => {
                                        if(playerRef?.current) {
                                            playerRef.current?.seek(0);
                                            playerRef.current?.play();
                                            setVideoEnded(false);
                                        }
                                    }}
                                    text="Rewatch"
                                    customClasses="text-xl max-w-max px-6 mx-auto mt-4 !bg-richblack-800"
                                />
                                <div className="mt-12 flex min-w-[250px] justify-center gap-x-6 text-xl">
                                    {!isFirstVideo() && (
                                        <button disabled={loading} onClick={goToPrevVideo} className='blackButton !py-2 !px-6'>Prev</button>
                                    )}
                                    {!isLastVideo() && (
                                        <button disabled={loading} onClick={goToNextVideo} className='yellowButton !py-2 !px-6'>Next</button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Player>
                </div>
            )}
            
            <div className='mt-4 flex flex-col gap-4'>
                <h1 className="text-3xl font-extrabold text-richblack-5 tracking-tight">
                    {videoData?.title}
                </h1>
                <div className='flex flex-col gap-2'>
                    <p className="text-richblack-200 text-lg font-medium leading-relaxed max-w-[80%]">
                        {videoData?.description}
                    </p>
                    {courseEntireData?.createdAt && (
                         <p className='text-richblack-400 text-sm font-semibold'>
                            {formatDate(courseEntireData?.createdAt)}
                         </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoDetails
