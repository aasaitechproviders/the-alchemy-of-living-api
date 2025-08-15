// ============================================
// BACKEND IMPLEMENTATION - THE ALCHEMY OF Your LIVING
// ============================================

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();

// =======================
//  MIDDLEWARE
// =======================
app.use(helmet());
app.use(cors({
    origin: '*', // Allow all for now, adjust for your domain
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limit: Prevent spamming
const emailLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    }
});

// =======================
//  EMAIL TRANSPORTER
// =======================
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // TLS port
    secure: false, // STARTTLS upgrade
    auth: {
        user: 'lifenavigatorpratima@gmail.com',
        pass: 'uhog uwyy wfzy bwyw'
    }
});

// Verify transporter config
transporter.verify((error) => {
    if (error) {
        console.error('❌ Email config error:', error);
    } else {
        console.log('✅ Email server ready to send messages');
    }
});

// =======================
//  EMAIL TEMPLATES
// =======================
const getEnquiryEmailTemplate = (data) => {
    return {
        admin: {
            subject: `New Product Enquiry - ${data.productName} - The Alchemy of Your Living`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #ff7e5f, #feb47b); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">The Alchemy of Your Living</h1>
                        <p style="color: #fff8f0; margin: 5px 0 0; font-size: 14px; font-style: italic; font-family: 'Georgia', serif;">
                            Life Coaching with Pratima
                        </p>
                    </div>
                    <div style="padding: 20px; background: #f8fafc;">
                        <h3 style="margin-top:0; color: #333; font-size: 20px;">📩 New Product Enquiry</h3>
                        <table style="width:100%; border-collapse: collapse; font-size: 15px;">
                            <tr style="background: #fff;">
                                <td style="padding: 10px; font-weight: bold; color: #444;">👤 Name:</td>
                                <td style="padding: 10px; color: #555;">${data.name}</td>
                            </tr>
                            <tr style="background: #f9f9f9;">
                                <td style="padding: 10px; font-weight: bold; color: #444;">📧 Email:</td>
                                <td style="padding: 10px;">
                                    <a href="mailto:${data.email}" style="color: #ff7e5f; text-decoration: none;">${data.email}</a>
                                </td>
                            </tr>
                            <tr style="background: #fff;">
                                <td style="padding: 10px; font-weight: bold; color: #444;">📱 Phone:</td>
                                <td style="padding: 10px;">
                                    <a href="tel:${data.phone}" style="color: #ff7e5f; text-decoration: none;">${data.phone}</a>
                                </td>
                            </tr>
                            <tr style="background: #f9f9f9;">
                                <td style="padding: 10px; font-weight: bold; color: #444;">📦 Product:</td>
                                <td style="padding: 10px; color: #555;">${data.productName}</td>
                            </tr>
                            <tr style="background: #fff;">
                                <td style="padding: 10px; font-weight: bold; color: #444;">📝 Message:</td>
                                <td style="padding: 10px; color: #555;">${data.message.replace(/\n/g, '<br>')}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="background: #1e293b; padding: 15px; text-align: center;">
                        <p style="color: white; margin: 0; font-size: 14px;">&copy; 2025 The Alchemy of Your Living. All rights reserved.</p>
                        <p style="color: #94a3b8; margin: 5px 0 0; font-size: 12px;">Life Coaching with Pratima</p>
                    </div>
                </div>
            `
        },
        user: {
            subject: `Thank You for Your Enquiry - The Alchemy of Your Living`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #ff7e5f, #feb47b); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 26px; font-weight: bold;">The Alchemy of Your Living</h1>
                        <p style="color: #fff8f0; margin: 5px 0 0; font-size: 14px; font-style: italic; font-family: 'Georgia', serif;">
                            Life Coaching with Pratima
                        </p>
                    </div>
                    <div style="padding: 25px; background: #f8fafc; line-height: 1.6; color: #333;">
                        <h2 style="color: #ff7e5f; margin-top: 0;">🙏 Thank You for Reaching Out!</h2>
                        <p>Dear ${data.name},</p>
                        <p>Thank you for showing interest in <strong style="color: #ff7e5f;">${data.productName}</strong> at <strong>The Alchemy of Your Living</strong>.</p>
                        <p>We have received your enquiry and our team will get back to you within <strong>1-2 business days</strong>.</p>
                        <div style="margin: 20px 0; padding: 15px; background: #fff; border-left: 4px solid #ff7e5f; border-radius: 5px;">
                            <p style="margin: 0;"><strong>Need help sooner?</strong><br>
                            📧 <a href="mailto:lifenavigatorpratima@gmail.com" style="color: #ff7e5f; text-decoration: none;">lifenavigatorpratima@gmail.com</a></p>
                        </div>
                        <p>Warm regards,<br>
                        <strong style="color: #ff7e5f;">The Alchemy of Your Living Team</strong></p>
                    </div>
                    <div style="background: #1e293b; padding: 15px; text-align: center;">
                        <p style="color: white; margin: 0; font-size: 14px;">&copy; 2025 The Alchemy of Your Living. All rights reserved.</p>
                        <p style="color: #94a3b8; margin: 5px 0 0; font-size: 12px;">Life Coaching with Pratima</p>
                    </div>
                </div>
            `
        }
    };
};

// =======================
//  VALIDATION
// =======================
const validateEnquiryForm = (req, res, next) => {
    const { name, email, phone, productName, message } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
    if (!phone || !/^[+]?[\d\s\-\(\)]{10,}$/.test(phone)) errors.push('Valid phone number is required.');
    if (!productName) errors.push('Product name is required.');
    if (!message || message.trim().length < 5) errors.push('Message must be at least 5 characters.');

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    next();
};

// =======================
//  ENQUIRY ENDPOINT
// =======================
app.post('/api/enquiry', emailLimiter, validateEnquiryForm, async (req, res) => {
    try {
        const { name, email, phone, productName, message } = req.body;
        const templates = getEnquiryEmailTemplate({ name, email, phone, productName, message });

        const adminMailOptions = {
            from: `"The Alchemy of Your Living Website" <lifenavigatorpratima@gmail.com>`,
            to: 'lifenavigatorpratima@gmail.com',
            subject: templates.admin.subject,
            html: templates.admin.html
        };

        const userMailOptions = {
            from: `"The Alchemy of Your Living Team" <lifenavigatorpratima@gmail.com>`,
            to: email,
            subject: templates.user.subject,
            html: templates.user.html
        };

        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        console.log(`✅ Enquiry email sent for ${name} (${productName})`);
        res.json({ success: true, message: 'Your enquiry has been sent successfully!' });

    } catch (error) {
        console.error('❌ Enquiry sending error:', error);
        res.status(500).json({ success: false, message: 'Error sending enquiry. Please try again later.' });
    }
});

// =======================
//  HEALTH CHECK
// =======================
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Service running', timestamp: new Date() });
});

// =======================
//  START SERVER
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
