import {User} from "../models/user.model.js"

const createProtolab = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
      
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      const result = await uploadOnCloudinary(req.file.path);
 
      const { heading } = req.body;
    
      if (!heading) {
        return res.status(400).json({ error: 'Heading is required' });
      }
  
      user.protolab.push({ images: result.secure_url, heading });
 
      await user.save();

      res.status(200).json({ message: 'Protolab data added successfully', user });
    } 
    catch (error) {
      console.error('Error uploading protolab data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  
const getProtolab = async (req, res) => {
    try {
        // Retrieve user ID from request (assuming it's available in req.user)
        const userId = req.user._id;

        // Fetch user from the database
        const user = await User.findById(userId).select('protolab');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.status(200).json({ protolab: user.protolab });
    } 
    catch (error) {
        console.error('Error fetching protolab data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {createProtolab,getProtolab }