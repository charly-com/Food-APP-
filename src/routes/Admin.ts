import express from 'express';
import { adminRegister, SuperAdmin } from '../controller/adminController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/create-admin', auth, adminRegister)

router.post('/create-super-admin', SuperAdmin)




export default router;