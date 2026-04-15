import { FiChevronLeft } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import ChangeProfilePicture from "./ChangeProfilePicture"
import DeleteAccount from "./DeleteAccount"
import EditProfile from "./EditProfile"
import UpdatePassword from "./UpdatePassword"

export default function Settings() {
  const navigate = useNavigate()

  return (
    <>
      <button
        onClick={() => {
          navigate("/dashboard/my-profile")
        }}
        className="flex items-center gap-x-2 text-richblack-300 mb-5"
      >
        <FiChevronLeft />
        Back
      </button>
      
      <h1 className="mb-10 text-3xl font-medium text-richblack-5">
        Edit Profile
      </h1>

      <div className="flex flex-col gap-y-10">
        <ChangeProfilePicture />
        <EditProfile />
        <UpdatePassword />
        <DeleteAccount />
      </div>
    </>
  )
}