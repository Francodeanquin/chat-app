import User from "../models/user.model.js"

export const getUserForSideBar = async(req,res)=>{
try {
    const loggedInUserID= req.user._id
    const filteredUsers = await User.find({_id:{$ne: loggedInUserID}}).select("-password")//find every user but the one loggedInUserId

    res.status(200).json(filteredUsers)
} catch (error) {
    console.log("Error in getUsersForSideBar:", error.message)
    res.status(500).json({error: "Internal server error"})
}
}