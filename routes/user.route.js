import { Router } from "express";
import { 
    createUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    createEditorial,updateEditorial,getEditorial,
    createPersonal,getPersonal,
    createProject, updateProject, getProjects,
    createProtolab,getProtolab,
    uploadResume,

} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/createEdi").post(
    verifyJWT,
    upload.fields([
        {
            name: "images",
            maxCount: 10
        }, 
      
    ]),
    createEditorial
    )


router.route("/register").post(
    upload.fields([
        {
            name:"protolab",
            maxCount:5
        },
        {
            name:"resume",
            maxCount: 1
        },
        {
            name:"Editorial",
            maxCount: 5
        }
    ]),
    
    createUser)
router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
 router.route("/refresh-token").post(refreshAccessToken)
 router.route("/refresh-token").post(refreshAccessToken)
 router.route("/change-password").post(verifyJWT, changeCurrentPassword)
 router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)

//routes declaration
//Endpoint to get a user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

export default router