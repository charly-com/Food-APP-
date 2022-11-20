import express from 'express';
import { adminRegister, SuperAdmin } from '../controller/adminController';
import { createFood, vendorLogin } from '../controller/vendorController';
import { authVendor } from '../middleware/auth';

const router = express.Router();


router.post('/login', vendorLogin)

router.post('/create-food', authVendor, createFood)


export default router;