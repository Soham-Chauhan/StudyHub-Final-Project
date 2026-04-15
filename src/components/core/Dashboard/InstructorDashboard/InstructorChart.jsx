import React from 'react'
import { useState } from "react"

import { Pie } from "react-chartjs-2"
import {ArcElement,Chart} from 'chart.js'

Chart.register(ArcElement)


const InstructorChart = ({courses}) => {
  // State to keep track of the currently selected chart
  const [currChart, setCurrChart] = useState("students")
  // State to keep track of the hovered course for extra visualization
  const [hoveredCourse, setHoveredCourse] = useState(null)

  // Curated color palette
  const chartColors = [
    "#FFD60A", "#05A77B", "#47A5C5", "#EF476F", "#FFD166",
    "#06D6A0", "#118AB2", "#073B4C", "#8338EC", "#3A86FF"
  ]

  const generateColors = (numColors) => {
    return chartColors.slice(0, numColors)
  }

  // Data for the chart displaying student information
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalStudentsEnrolled),
        backgroundColor: generateColors(courses.length),
        borderWidth: 1,
        borderColor: "#161D29",
        hoverOffset: 15,
      },
    ],
  }

  // Data for the chart displaying income information
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated),
        backgroundColor: generateColors(courses.length),
        borderWidth: 1,
        borderColor: "#161D29",
        hoverOffset: 15,
      },
    ],
  }

  // Options for the chart
  const options = {
    maintainAspectRatio: false,
    onHover: (event, chartElement) => {
        if (chartElement.length > 0) {
            const index = chartElement[0].index;
            setHoveredCourse(courses[index]);
        } else {
            setHoveredCourse(null);
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: "#161D29",
            titleColor: "#F1F2FF",
            bodyColor: "#FFD60A",
            borderColor: "#424854",
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
                label: (context) => {
                    const label = context.label || "";
                    const value = context.parsed || 0;
                    return ` ${label}: ${currChart === "income" ? "₹" : ""}${value} ${currChart === "students" ? "Learners" : ""}`;
                }
            }
        }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6 shadow-[0px_0px_20px_rgba(0,0,0,0.5)] border border-richblack-700 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
            <p className="text-xl font-bold text-richblack-5">Visual Insights</p>
            <p className="text-xs text-richblack-400 mt-1">Hover over segments for details</p>
        </div>
        <div className="flex bg-richblack-900 p-1 gap-x-1 rounded-md border border-richblack-700">
            {/* Button to switch to the "students" chart */}
            <button
            onClick={() => setCurrChart("students")}
            className={`rounded-md p-1 px-4 transition-all duration-200 text-sm font-medium ${
                currChart === "students"
                ? "bg-richblack-700 text-yellow-50 shadow-sm"
                : "text-richblack-300 hover:text-richblack-50"
            }`}
            >
            Students
            </button>
            {/* Button to switch to the "income" chart */}
            <button
            onClick={() => setCurrChart("income")}
            className={`rounded-md p-1 px-4 transition-all duration-200 text-sm font-medium ${
                currChart === "income"
                ? "bg-richblack-700 text-yellow-50 shadow-sm"
                : "text-richblack-300 hover:text-richblack-50"
            }`}
            >
            Income
            </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-x-6 mt-4">
        <div className="relative aspect-square h-[250px] w-full md:w-1/2">
            <Pie
            data={currChart === "students" ? chartDataStudents : chartIncomeData}
            options={options}
            />
        </div>

        {/* Dynamic Legend / Detail Box */}
        <div className="flex-1 w-full bg-richblack-900 p-4 rounded-lg border border-richblack-700 min-h-[150px] flex flex-col justify-center">
            {hoveredCourse ? (
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-yellow-50 uppercase tracking-widest mb-2">Detailed View</p>
                    <p className="text-lg font-semibold text-richblack-5 leading-tight">{hoveredCourse.courseName}</p>
                    <div className="mt-3 flex items-center justify-between border-t border-richblack-700 pt-3">
                        <div>
                            <p className="text-xs text-richblack-400">Enrollment</p>
                            <p className="text-lg font-bold text-caribbeangreen-100">{hoveredCourse.totalStudentsEnrolled} Students</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-richblack-400">Total Revenue</p>
                            <p className="text-lg font-bold text-blue-100">₹{hoveredCourse.totalAmountGenerated.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center opacity-70">
                    <p className="text-richblack-300 text-sm italic">Hover over the chart to see segment details</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default InstructorChart