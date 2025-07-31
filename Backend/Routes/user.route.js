import express from 'express';
import Protect, { admin } from '../Middleware/auth.middleware';
import {deleteOwnProfile, getAllProfiles, getUserProfile, updateMyProfile, updateUserById} from '../Controller/user.controller';

const router = express.Router();

router.get("/profile",Protect,getUserProfile);
//here what is does is first it goes to teh protect method where it find the user as per the token and id
//generated and later it sends what is remaining or like result fo teh search
//if the user foudn it just send like ok send response from proect fnction what it got
//remaining part its just a fucniton page in teh controller file 

router.get("/allProfiles",Protect,admin,getAllProfiles);

router.put("/profile",Protect,updateMyProfile);
router.delete("/profile",Protect,deleteOwnProfile);

router.get("/all",Protect,admin,getAllProfiles)
router.put("/:id",Protect,admin,updateUserById)
router.delete("/:id",Protect,admin,deleteUserById);
//here we are using the protect method to check if the user is logged in or not


export default router;