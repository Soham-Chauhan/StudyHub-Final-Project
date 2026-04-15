import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { addCategory, fetchCourseCategories } from "../../../services/operations/courseDetailsAPI"
import { getAdminDashboardData, approveInstructorData } from "../../../services/operations/profileAPI"
import IconBtn from "../../common/IconBtn"
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaCheckCircle, FaTimesCircle } from "react-icons/fa"

export default function AdminPanel() {
  const { token } = useSelector((state) => state.auth)
  const [categories, setCategories] = useState([])
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  
  // Category form state
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")

  useEffect(() => {
    const getFullData = async () => {
      setLoading(true)
      const categoryRes = await fetchCourseCategories()
      if (categoryRes) setCategories(categoryRes)

      const adminData = await getAdminDashboardData(token)
      if (adminData) setDashboardData(adminData)
      setLoading(false)
    }

    getFullData()
  }, [token])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    if (!categoryName || !categoryDescription) return

    const res = await addCategory(
      { name: categoryName, description: categoryDescription },
      token
    )
    if (res) {
      setCategoryName("")
      setCategoryDescription("")
      const categoryRes = await fetchCourseCategories()
      if (categoryRes) setCategories(categoryRes)
    }
  }

  const handleApproveInstructor = async (instructorId) => {
    const success = await approveInstructorData(instructorId, token)
    if (success) {
      const adminData = await getAdminDashboardData(token)
      if (adminData) setDashboardData(adminData)
    }
  }

  return (
    <div className="text-white pb-10">
      <h1 className="mb-8 text-3xl font-medium text-richblack-5 font-boogaloo tracking-wider">Admin Control Center</h1>
      
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-richblack-800 border border-richblack-700 p-6 rounded-xl flex items-center gap-5 shadow-lg transition-all hover:scale-105">
           <div className="p-4 bg-yellow-100/10 rounded-full text-yellow-50 text-3xl">
              <FaChalkboardTeacher />
           </div>
           <div>
              <p className="text-richblack-300 text-sm font-medium">Total Instructors</p>
              <h3 className="text-2xl font-bold">{dashboardData?.totalInstructors || 0}</h3>
           </div>
        </div>
        <div className="bg-richblack-800 border border-richblack-700 p-6 rounded-xl flex items-center gap-5 shadow-lg transition-all hover:scale-105">
           <div className="p-4 bg-caribbeangreen-100/10 rounded-full text-caribbeangreen-50 text-3xl">
              <FaUserGraduate />
           </div>
           <div>
              <p className="text-richblack-300 text-sm font-medium">Total Students</p>
              <h3 className="text-2xl font-bold">{dashboardData?.totalStudents || 0}</h3>
           </div>
        </div>
        <div className="bg-richblack-800 border border-richblack-700 p-6 rounded-xl flex items-center gap-5 shadow-lg transition-all hover:scale-105">
           <div className="p-4 bg-brown-100/20 rounded-full text-brown-50 text-3xl">
              <FaBook />
           </div>
           <div>
              <p className="text-richblack-300 text-sm font-medium">Total Courses</p>
              <h3 className="text-2xl font-bold">{dashboardData?.totalCourses || 0}</h3>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-richblack-800 p-1 rounded-lg border border-richblack-700 w-fit mb-8">
        {["dashboard", "instructors", "students", "categories"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-md transition-all capitalize ${
              activeTab === tab 
                ? "bg-yellow-50 text-richblack-900 font-semibold" 
                : "text-richblack-300 hover:text-richblack-5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[300px]">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* Dashboard Tab Content (Merged with overall visual detail) */}
          {activeTab === "dashboard" && (
             <div className="flex flex-col gap-6">
                <div className="bg-richblack-800 border border-richblack-700 p-8 rounded-xl shadow-xl">
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-6 bg-yellow-50 rounded-full"></span>
                      Quick Insights
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-richblack-700/50 p-6 rounded-lg border border-richblack-600">
                         <h4 className="text-richblack-100 font-semibold mb-2">Pending Approvals</h4>
                         <p className="text-4xl font-bold text-yellow-50">
                            {dashboardData?.instructors.filter(i => !i.approved).length || 0}
                         </p>
                         <p className="text-sm text-richblack-400 mt-2">Instructors waiting for verification</p>
                      </div>
                      <div className="bg-richblack-700/50 p-6 rounded-lg border border-richblack-600">
                         <h4 className="text-richblack-100 font-semibold mb-2">Active Students</h4>
                         <p className="text-4xl font-bold text-caribbeangreen-50">
                            {dashboardData?.students.length || 0}
                         </p>
                         <p className="text-sm text-richblack-400 mt-2">Currently registered students</p>
                      </div>
                   </div>
                </div>
                
                {/* Recent Categories Preview */}
                <div className="bg-richblack-800 border border-richblack-700 p-8 rounded-xl shadow-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <span className="w-2 h-6 bg-pink-50 rounded-full"></span>
                       Recently Added Categories
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {categories.slice(0, 5).map(cat => (
                            <span key={cat._id} className="bg-richblack-700 px-4 py-2 rounded-full border border-richblack-600 text-sm font-medium">
                                {cat.name}
                            </span>
                        ))}
                        {categories.length > 5 && <span className="text-richblack-400 self-center">+{categories.length - 5} more</span>}
                    </div>
                </div>
             </div>
          )}

          {/* Instructors Tab */}
          {activeTab === "instructors" && (
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl shadow-xl overflow-hidden text-richblack-50">
               <div className="p-6 bg-richblack-700 font-bold text-lg border-b border-richblack-600">
                  Manage Instructors
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-richblack-800">
                           <th className="px-6 py-4">Instructor</th>
                           <th className="px-6 py-4">Email</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-richblack-700">
                        {dashboardData?.instructors.map((instructor) => (
                           <tr key={instructor._id} className="hover:bg-richblack-700/50 transition-all">
                              <td className="px-6 py-4 flex items-center gap-3">
                                 <img src={instructor.image} className="w-10 h-10 rounded-full object-cover shadow-sm bg-richblack-600" alt="" />
                                 <span className="font-semibold">{instructor.firstName} {instructor.lastName}</span>
                              </td>
                              <td className="px-6 py-4 text-richblack-300">{instructor.email}</td>
                              <td className="px-6 py-4">
                                 {instructor.approved ? (
                                    <span className="flex items-center gap-1 text-caribbeangreen-100 bg-caribbeangreen-100/10 w-fit px-3 py-1 rounded-full text-xs font-bold ring-1 ring-caribbeangreen-100/30">
                                       <FaCheckCircle className="text-[10px]" /> Approved
                                    </span>
                                 ) : (
                                    <span className="flex items-center gap-1 text-pink-100 bg-pink-100/10 w-fit px-3 py-1 rounded-full text-xs font-bold ring-1 ring-pink-100/30">
                                       <FaTimesCircle className="text-[10px]" /> Pending
                                    </span>
                                 )}
                              </td>
                              <td className="px-6 py-4">
                                 <button 
                                    onClick={() => handleApproveInstructor(instructor._id)}
                                    className={`px-4 py-2 rounded-md font-bold text-xs shadow-md transition-all ${
                                       instructor.approved 
                                       ? "bg-pink-500 hover:bg-pink-600 text-white" 
                                       : "bg-caribbeangreen-300 hover:bg-caribbeangreen-400 text-richblack-900"
                                    }`}
                                 >
                                    {instructor.approved ? "Revoke Access" : "Approve"}
                                 </button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-richblack-800 border border-richblack-700 rounded-xl shadow-xl overflow-hidden text-richblack-50">
               <div className="p-6 bg-richblack-700 font-bold text-lg border-b border-richblack-600">
                  Registered Students
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-richblack-800">
                           <th className="px-6 py-4">Student</th>
                           <th className="px-6 py-4">Email</th>
                           <th className="px-6 py-4">Joined Date</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-richblack-700">
                        {dashboardData?.students.map((student) => (
                           <tr key={student._id} className="hover:bg-richblack-700/50 transition-all">
                              <td className="px-6 py-4 flex items-center gap-3">
                                 <img src={student.image} className="w-10 h-10 rounded-full object-cover shadow-sm bg-richblack-600" alt="" />
                                 <span className="font-semibold">{student.firstName} {student.lastName}</span>
                              </td>
                              <td className="px-6 py-4 text-richblack-300">{student.email}</td>
                              <td className="px-6 py-4 text-richblack-300 italic text-sm">Member</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* Categories Tab */}
          {activeTab === "categories" && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Create Form */}
                <div className="flex flex-col gap-y-10 rounded-xl border border-richblack-700 bg-richblack-800 p-8 shadow-xl">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                     <span className="w-2 h-6 bg-yellow-50 rounded-full"></span>
                     Create New Category
                  </h2>
                  <form onSubmit={handleCreateCategory} className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                      <label className="text-sm font-medium text-richblack-200">Category Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. Web Development"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="form-style w-full bg-richblack-700 border-richblack-600 focus:border-yellow-50"
                      />
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <label className="text-sm font-medium text-richblack-200">Category Description</label>
                      <textarea
                        name="description"
                        placeholder="What's this category about?"
                        value={categoryDescription}
                        onChange={(e) => setCategoryDescription(e.target.value)}
                        className="form-style w-full min-h-[130px] bg-richblack-700 border-richblack-600 focus:border-yellow-50"
                      />
                    </div>
                    <IconBtn text="Add Category" />
                  </form>
                </div>

                {/* Categories List */}
                <div className="flex flex-col gap-y-6 rounded-xl border border-richblack-700 bg-richblack-800 p-8 shadow-xl">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                     <span className="w-2 h-6 bg-pink-50 rounded-full"></span>
                     Existing Categories
                  </h2>
                  <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {categories.length > 0 ? (
                        categories.map((category) => (
                           <div
                             key={category._id}
                             className="rounded-lg bg-richblack-700/50 p-4 border border-richblack-600 transition-all hover:bg-richblack-700"
                           >
                             <p className="text-lg font-bold text-yellow-50">{category.name}</p>
                             <p className="text-sm text-richblack-300 mt-1 truncate">{category.description}</p>
                           </div>
                         ))
                    ) : (
                      <p className="text-richblack-400">No categories found</p>
                    )}
                  </div>
                </div>
             </div>
          )}
        </>
      )}
    </div>
  )
}
