const User = require('../Model/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUser = async (req, res) => {
  const {name, email, password, role} = req.body;
  if(name == "" || email == "" || password == ""){
    return res.status(400).json({message: "All field is required"});
  }
  try {
    const user = new User({name, email, password, role});
    await user.save();
    res.status(201).json({message: "User created successfully", user: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
};

exports.getUser = async (req, res) => {
  try {
    const {id} = req.params;
    if(id) {
      // Get single user by ID
      const user = await User.findById(id);
      if(!user){
        return res.status(404).json({message: "User not found"});
      }
      res.status(200).json({message: "User fetched successfully", user: user});
    } else {
      // Get all users
      const users = await User.find();
      res.status(200).json({message: "Users fetched successfully", users: users});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
};

exports.putUser = async (req, res) => {
  try {
    const {id} = req.params;
    const {name, email, password, role} = req.body;
    
    const user = await User.findByIdAndUpdate(
      id, 
      {name, email, password, role}, 
      {new: true, runValidators: true}
    );
    
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    
    res.status(200).json({message: "User updated successfully", user: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    
    res.status(200).json({message: "User deleted successfully", user: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
};

exports.loginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    if(email == "" || password == ""){
      return res.status(400).json({message: "All field is required"});
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(401).json({message: "Invalid password"});
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.status(200).json({message: "User logged in successfully", user: user, token: token});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
}

exports.logoutUser = async (req, res) => {
  try {
    res.status(200).json({message: "User logged out successfully"});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Internal server error"});
  }
}