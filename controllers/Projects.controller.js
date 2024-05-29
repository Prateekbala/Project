import {User, Project} from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";


const createProject = asyncHandler(async (req, res) => {
        const { links, content } = req.body;
        const userId = req.user._id;
        // Validate input
        if (!links || !content) {
            return res.status(400).json({ error: 'Links and content are required' });
        }

        // Create new project
        const newProject = new Project({ links, content });
        await newProject.save();

        // Add project to user's projects array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.projects.push(newProject._id);
        await user.save();

        res.status(200).json({ message: 'Project added successfully', project: newProject });
    });

// Update an existing project
const updateProject = asyncHandler(async (req, res) => {
    
        const { projectId } = req.params;
        const { links, content } = req.body;

        // Validate input
        if (!links || !content) {
            return res.status(400).json({ error: 'Links and content are required' });
        }

        // Find project and update it
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        project.links = links;
        project.content = content;
        await project.save();

        res.status(200).json({ message: 'Project updated successfully', project });
    } );


// Get all projects for a user
const getProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find user and populate projects
        const user = await User.findById(userId).populate('projects');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ projects: user.projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { createProject, updateProject, getProjects };
