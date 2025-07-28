import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, updatePassword } from '../models/User';
import { pool } from '../database';
import { AuthRequest } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// @route   POST /api/auth/signup
// @desc    Register a new user (client or provider)
// @access  Public
router.post('/signup', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('phone').isMobilePhone('any').withMessage('Please provide a valid phone number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('userType').isIn(['client', 'provider']).withMessage('User type must be either client or provider'),
    body('fullName').notEmpty().trim().withMessage('Full name is required')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password, userType, fullName } = req.body;

    try {
        let user = await findUserByEmail(email);
        if (user) {
            return res.status(409).json({ error: 'User with this email already exists.' });
        }

        user = await createUser({ email, phone, password, userType, fullName });

        const payload = {
            user: {
                id: user.id,
                email: user.email,
                userType: user.user_type
            }
        };
        
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any },
            (err: any, token: any) => {
                if (err) {
                    console.error('🔐 Error signing JWT token:', err);
                    return res.status(500).json({ error: 'Server error during signup.' });
                }
                res.status(201).json({
                    message: 'User registered successfully.',
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        userType: user.user_type,
                        fullName: user.full_name
                    }
                });
            }
        );
    } catch (err) {
        console.error('🔐 Signup error:', err);
        res.status(500).json({ error: 'Server error during signup. Please try again later.' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
    body('emailOrPhone').notEmpty().withMessage('Email or phone is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

     const { emailOrPhone, password } = req.body;

     try {
         // Try finding by email first
         let user = await findUserByEmail(emailOrPhone);
         // If not found by email, try finding by phone
         if (!user) {
             const query = 'SELECT * FROM users WHERE phone = $1';
             const result = await pool.query(query, [emailOrPhone]);
             user = result.rows[0];
         }

         if (!user) {
             return res.status(401).json({ error: 'Invalid credentials.' });
         }

         const isMatch = await bcrypt.compare(password, user.password_hash);
         if (!isMatch) {
             return res.status(401).json({ error: 'Invalid credentials.' });
         }

         const payload = {
             user: {
                 id: user.id,
                 email: user.email,
                 userType: user.user_type
             }
         };
         
         jwt.sign(
             payload,
             JWT_SECRET,
             { expiresIn: JWT_EXPIRES_IN as any },
             (err: any, token: any) => {
                 if (err) {
                     console.error('🔐 Error signing JWT token:', err);
                     return res.status(500).json({ error: 'Server error during login.' });
                 }
                 res.json({
                     message: 'Login successful!',
                     token,
                     user: {
                         id: user.id,
                         email: user.email,
                         userType: user.user_type,
                         fullName: user.full_name
                     }
                 });
             }
         );
     } catch (err) {
         console.error('🔐 Login error:', err);
         res.status(500).json({ error: 'Server error during login. Please try again later.' });
     }
});

// @route   POST /api/auth/send-phone-otp
// @desc    Send phone OTP (for new registration or existing users)
// @access  Public
router.post('/send-phone-otp', [
    body('phoneNumber').isMobilePhone('any').withMessage('Please provide a valid phone number'),
    body('fullName').notEmpty().trim().withMessage('Full name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('userType').isIn(['client', 'provider']).withMessage('User type must be either client or provider')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, fullName, email, password, userType } = req.body;

    try {
        // Check if user already exists
        const existingUserQuery = 'SELECT id FROM users WHERE phone = $1 OR email = $2';
        const existingUserResult = await pool.query(existingUserQuery, [phoneNumber, email]);
        
        if (existingUserResult.rows.length > 0) {
            return res.status(409).json({ error: 'User with this phone or email already exists.' });
        }

        // Generate a simple OTP (6 digits)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in database (simple approach)
        const tempUserId = `temp_${Date.now()}`;
        await pool.query(
            'INSERT INTO otps (user_id, phone, otp_code, type, expires_at) VALUES ($1, $2, $3, $4, $5)',
            [tempUserId, phoneNumber, otpCode, 'phone', new Date(Date.now() + 10 * 60 * 1000)] // 10 minutes
        );
        
        // In a real app, you'd send SMS here
        console.log(`OTP for ${phoneNumber}: ${otpCode}`);
        
        res.json({ 
            message: 'OTP sent successfully',
            tempUserId: tempUserId
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

// @route   POST /api/auth/verify-phone-otp
// @desc    Verify phone OTP
// @access  Public
router.post('/verify-phone-otp', [
    body('phoneNumber').isMobilePhone('any').withMessage('Please provide a valid phone number'),
    body('otp').isLength({ min: 4, max: 6 }).withMessage('OTP must be 4-6 digits'),
    body('registrationData').optional().isObject().withMessage('Registration data must be an object')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { phoneNumber, otp, registrationData } = req.body;

    try {
        // For new registration, verify the temporary OTP
        if (registrationData) {
            // This is a new user registration
            const tempUserId = `temp_${Date.now()}`; // You might want to store this in session/cache
            const otpQuery = 'SELECT * FROM otps WHERE user_id = $1 AND otp_code = $2 AND type = $3 AND expires_at > NOW()';
            const otpResult = await pool.query(otpQuery, [tempUserId, otp, 'phone']);
            
            if (otpResult.rows.length > 0) {
                // Create the actual user
                const user = await createUser(registrationData);
                
                const payload = {
                    user: {
                        id: user.id,
                        email: user.email,
                        userType: user.user_type
                    }
                };
                
                jwt.sign(
                    payload,
                    JWT_SECRET,
                    { expiresIn: JWT_EXPIRES_IN as any },
                    (err: any, token: any) => {
                        if (err) {
                            console.error('🔐 Error signing JWT token:', err);
                            return res.status(500).json({ error: 'Server error during registration.' });
                        }
                        res.json({
                            message: 'Phone verified and user registered successfully.',
                            token,
                            user: {
                                id: user.id,
                                email: user.email,
                                userType: user.user_type,
                                fullName: user.full_name
                            }
                        });
                    }
                );
            } else {
                res.status(400).json({ error: 'Invalid OTP' });
            }
        } else {
            // This is for existing users
            const userQuery = 'SELECT id FROM users WHERE phone = $1';
            const userResult = await pool.query(userQuery, [phoneNumber]);
            
            if (userResult.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            const userId = userResult.rows[0].id;
            const otpQuery = 'SELECT * FROM otps WHERE user_id = $1 AND otp_code = $2 AND type = $3 AND expires_at > NOW()';
            const otpResult = await pool.query(otpQuery, [userId, otp, 'phone']);
            
            if (otpResult.rows.length > 0) {
                await pool.query(
                    'UPDATE users SET phone_verified = true WHERE id = $1',
                    [userId]
                );
                res.json({ message: 'Phone verified successfully' });
            } else {
                res.status(400).json({ error: 'Invalid OTP' });
            }
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

// @route   POST /api/auth/resend-phone-otp
// @desc    Resend phone OTP
// @access  Public
router.post('/resend-phone-otp', [
    body('phone').isMobilePhone('any').withMessage('Please provide a valid phone number')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;

    try {
        const userQuery = 'SELECT id FROM users WHERE phone = $1';
        const userResult = await pool.query(userQuery, [phone]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userId = userResult.rows[0].id;
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        await pool.query(
            'INSERT INTO otps (user_id, phone, otp_code, type, expires_at) VALUES ($1, $2, $3, $4, $5)',
            [userId, phone, otpCode, 'phone', new Date(Date.now() + 10 * 60 * 1000)]
        );
        
        console.log(`Resent OTP for ${phone}: ${otpCode}`);
        
        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Error resending OTP:', error);
        res.status(500).json({ error: 'Failed to resend OTP' });
    }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email
// @access  Public
router.post('/verify-email', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('verificationCode').notEmpty().withMessage('Verification code is required')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, verificationCode } = req.body;

    try {
        const userQuery = 'SELECT id FROM users WHERE email = $1 AND email_verification_token = $2';
        const userResult = await pool.query(userQuery, [email, verificationCode]);
        
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        await pool.query(
            'UPDATE users SET email_verified = true, email_verification_token = NULL WHERE id = $1',
            [userResult.rows[0].id]
        );
        
        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ error: 'Failed to verify email' });
    }
});

// @route   POST /api/auth/resend-email-verification
// @desc    Resend email verification
// @access  Public
router.post('/resend-email-verification', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const userQuery = 'SELECT id FROM users WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const verificationToken = require('crypto').randomBytes(32).toString('hex');
        
        await pool.query(
            'UPDATE users SET email_verification_token = $1 WHERE id = $2',
            [verificationToken, userResult.rows[0].id]
        );

        // In a real app, you'd send email here
        console.log(`Email verification token for ${email}: ${verificationToken}`);
        
        res.json({ message: 'Email verification sent' });
    } catch (error) {
        console.error('Error sending email verification:', error);
        res.status(500).json({ error: 'Failed to send email verification' });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const resetToken = require('crypto').randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await pool.query(
            'UPDATE users SET password_reset_token = $1, password_reset_expires = $2 WHERE id = $3',
            [resetToken, resetExpires, user.id]
        );

        // In a real app, you'd send email here
        console.log(`Password reset token for ${email}: ${resetToken}`);
        
        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending password reset:', error);
        res.status(500).json({ error: 'Failed to send password reset' });
    }
});

// @route   POST /api/auth/forgot-username
// @desc    Send username reminder
// @access  Public
router.post('/forgot-username', [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // In a real app, you'd send email here
        console.log(`Username reminder for ${email}: ${user.email}`);
        
        res.json({ message: 'Username reminder sent' });
    } catch (error) {
        console.error('Error sending username reminder:', error);
        res.status(500).json({ error: 'Failed to send username reminder' });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { token, newPassword } = req.body;

    try {
        const userQuery = `
            SELECT id FROM users 
            WHERE password_reset_token = $1 
            AND password_reset_expires > CURRENT_TIMESTAMP
        `;
        
        const userResult = await pool.query(userQuery, [token]);
        
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const userId = userResult.rows[0].id;
        await updatePassword(userId, newPassword);
        
        // Clear reset token
        await pool.query(
            'UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = $1',
            [userId]
        );
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// @route   GET /api/auth/verify-token
// @desc    Verify JWT token
// @access  Private
router.get('/verify-token', (req: Request, res: Response) => {
    // This would be called with authenticateToken middleware
    res.json({ valid: true });
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req: Request, res: Response) => {
     try {
        // This would be called with authenticateToken middleware
        // req.user would contain the user info
        res.json({ user: (req as AuthRequest).user });
     } catch (err) {
        console.error('🔐 Error fetching user profile:', err);
        res.status(500).json({ error: 'Server error fetching profile.' });
     }
});

export default router; 