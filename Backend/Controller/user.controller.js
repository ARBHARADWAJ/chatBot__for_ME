import User from "../Models/User.js";

export const getUserProfile = async (req, res) => {
  res.status(200).json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
};

export const getAllProfiles = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user profiles",
      error: error.message,
    });
  }
};

export const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const update = user.save();
    res.status(200).json({ message: update });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.remove();
    res.status(200).json({ message: "User is removed" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateMyProfile=async(req,res)=>{
  try{
const user= await User.findById(req.user._id);
    if(!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  }
  catch(error)
  {
    res.status(500).json({ message: error.message });
  }
}

export const deleteOwnProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.remove();
    res.status(200).json({ message: "Your profile is removed" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}
