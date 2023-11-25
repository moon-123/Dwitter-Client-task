import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

// 검증
const validateCredential = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('username은 반드시 입력해야 함'),
    body('password')
        .trim()
        .isLength({ min: 4 })
        .withMessage('password는 반드시 4자 이상이여야 함'),
    validate
];

const validateSignup = [
    ...validateCredential,
    body('name').notEmpty().withMessage('name은 반드시 입력'),
    body('email').isEmail().withMessage('email 형식 확인'),
    body('url').isURL().withMessage('url 형식 확인')
        .optional({ nullable: true, checkFalsy: true }),
    validate
]

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateCredential, authController.login);
router.get('/me', isAuth, authController.me);


export default router;