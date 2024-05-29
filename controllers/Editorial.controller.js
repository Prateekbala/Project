import {User} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
// Upload Editorial
const createEditorial = async (req, res) => {
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
      
      const { heading, content } = req.body;
  
      // Validate input
      if (!heading || !content) {
        return res.status(400).json({ error: 'Heading and content are required' });
      }
  
      // Add editorial data to user's editorial array
      user.Editorial.push({ images: result.secure_url, heading, content });
     
      await user.save();
  
    
      res.status(200).json({ message: 'Editorial data added successfully', user });
    } 
    catch (error) {
      console.error('Error adding editorial data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

// Update Editorial
const updateEditorial = async (req, res) => {
    try {
        const { userId, editorialId } = req.params; // Assume user ID and editorial ID are passed as URL parameters
        const { heading, content } = req.body; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const editorial = user.editorial.id(editorialId);
        if (!editorial) {
            return res.status(404).json({ message: 'Editorial not found' });
        }

        if(req.file){
            const result = await uploadOnCloudinary(req.file.path);
        }

        // Update the editorial fields
        editorial.images = result.secure_url;
        editorial.heading = heading;
        editorial.content = content;

        await user.save();

        res.status(200).json({ message: 'Editorial updated successfully', editorial });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get Editorials
const getEditorial = asyncHandler(async (req, res) => {
  
  const userId = req.user._id;
  // Find the user by ID
  const user = await User.findById(userId).select('editorial'); // Select only the editorial field

  if (!user) {
      throw new ApiError(404, "User not found");
  }

  // Return the editorial data
  res.status(200).json(
      new ApiResponse(
          200,
          { editorial: user.editorial },
          "Editorial data fetched successfully"
      )
  );
});
   export  {createEditorial,updateEditorial,getEditorial};
