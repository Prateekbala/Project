
import {ApiError} from "../utils/ApiError.js"
import { User} from "../models/user.model.js"

const createPersonal = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure req.user is set by authentication middleware
        const { personalEntry } = req.body;

        // Validate input
        if (!personalEntry) {
            throw new ApiError(400, 'Personal entry is required');
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Add personal entry to user's personal array
        user.personal.push(personalEntry);
        await user.save();

        res.status(200).json(
            new ApiResponse(
                200,
                { personal: user.personal },
                'Personal entry added successfully'
            )
        );
    } catch (error) {
        // Check if the error is an instance of ApiError
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            // For unexpected errors
            res.status(500).json({ error: 'An unexpected error in personal Entry occurred' });
            console.error(error); // Log the error for debugging
        }
    }
};


const getPersonal = async (req, res) => {
    try {
        const userId = req.user._id; // Ensure req.user is set by authentication middleware

        // Find user by ID and select only the personal field
        const user = await User.findById(userId).select('personal');
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        res.status(200).json(
            new ApiResponse(
                200,
                { personal: user.personal },
                'Personal entries fetched successfully'
            )
        );
    } catch (error) {
        // Check if the error is an instance of ApiError
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
        } else {
            // For unexpected errors
            res.status(500).json({ error: 'An unexpected error occurred' });
            console.error(error); // Log the error for debugging
        }
    }
};

export {createPersonal,getPersonal}