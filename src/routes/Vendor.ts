import express from 'express';
import { adminRegister, SuperAdmin } from '../controller/adminController';
import { createFood, deleteFood, updateVendor, vendorLogin, VendorProfile } from '../controller/vendorController';
import { authVendor } from '../middleware/auth';
import { upload } from '../utils/multer';

const router = express.Router();


router.post('/login', vendorLogin)

router.post('/create-food', authVendor, upload.single('image'), createFood)

router.get('/get-profile', authVendor, VendorProfile)

router.delete('/delete-food/:foodid', authVendor, deleteFood)

router.patch('/update-profile', authVendor, upload.single('coverImage'), updateVendor)


export default router;