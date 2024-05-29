import {User } from "../models/user.model.js"

const uploadResume = async (req, res) => {
    try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.resume) {

      // Extracting the public ID from Cloudinary URL
      const publicId = user.resume.split('/').pop().split('.')[0];
     
      await cloudinary.uploader.destroy(publicId);
    }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
  
      // Upload file to Cloudinary
      const result = await uploadOnCloudinary(req.file.path);
  
      // Update user's resumeLink in the database
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      user.resume = result.secure_url;
      await user.save();
      
      res.status(200).json({ resume: result.secure_url });

    } 
    catch (error) {
      console.error('Error while uploading resume:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  export {uploadResume}