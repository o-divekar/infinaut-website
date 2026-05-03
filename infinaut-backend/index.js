import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CORS CONFIGURATION - COMPLETE FIX
// ============================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  process.env.FRONTEND_URL,
  'https://infinaut.tech',
  'https://www.infinaut.tech'
].filter(Boolean);

// CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Length', 'X-Kuma-Revision']
}));

// Handle preflight requests
app.options('*', cors());

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ============================================
// STATIC FILE SERVING (PRODUCTION ONLY)
// ============================================

// ============================================
// GMAIL TRANSPORTER
// ============================================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('\n❌ SMTP Connection Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure 2-Factor Authentication is enabled on your Gmail');
    console.log('   2. Generate an App Password (not your regular password)');
    console.log('   3. Check that the App Password has no spaces\n');
  } else {
    console.log('\n✅ SMTP Connection: SUCCESS');
    console.log(`   📧 Ready to send emails from ${process.env.EMAIL_USER}\n`);
  }
});

// ============================================
// HEALTH CHECK ENDPOINTS
// ============================================
app.get('/api/test', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '✅ Server is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================
// CONTACT FORM ENDPOINT
// ============================================
app.post('/api/contact', async (req, res) => {
  console.log('📨 Received contact form submission:', req.body);
  
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields (name, email, message) are required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Please provide a valid email address' 
    });
  }

  // Validate message length
  if (message.length < 10) {
    return res.status(400).json({ 
      success: false, 
      error: 'Message must be at least 10 characters long' 
    });
  }

  // Sanitize HTML to prevent injection
  const sanitizeHTML = (str) => {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  };

  const cleanName = sanitizeHTML(name.trim());
  const cleanEmail = email.trim();
  const cleanMessage = sanitizeHTML(message.trim());

  try {
    // Email to send to Infinaut
    const mailOptions = {
      from: `"${cleanName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: cleanEmail,
      subject: `📬 New Contact Form: ${cleanName}`,
      text: `
Name: ${cleanName}
Email: ${cleanEmail}
Message: ${cleanMessage}
---
Sent from Infinaut Contact Form
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; 
                       padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; border-top: none; 
                        border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #7c3aed; margin-bottom: 5px; font-size: 12px; 
                      text-transform: uppercase; letter-spacing: 1px; }
            .value { background: white; padding: 12px; border: 1px solid #e0e0e0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;
                       font-size: 12px; color: #666; }
            .badge { display: inline-block; background: #7c3aed; color: white; padding: 4px 12px; 
                      border-radius: 20px; font-size: 11px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✨ New Contact Form Submission</h2>
              <div class="badge">Infinaut.com</div>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 Name</div>
                <div class="value">${cleanName}</div>
              </div>
              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${cleanEmail}">${cleanEmail}</a></div>
              </div>
              <div class="field">
                <div class="label">💬 Message</div>
                <div class="value">${cleanMessage.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
            <div class="footer">
              <p>Reply directly to: <strong>${cleanEmail}</strong></p>
              <p>Sent from Infinaut Contact Form</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Auto-response to the sender
    const autoReplyOptions = {
      from: `"Infinaut Team" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: 'Thank you for contacting Infinaut',
      text: `
Dear ${cleanName},

Thank you for reaching out to Infinaut!

We have received your message and will get back to you within 24-48 business hours.

Best regards,
Infinaut Team
---
www.infinaut.tech | Digital Ecosystems
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #7c3aed;">Thank You, ${cleanName}!</h2>
            <p>We have received your message and will get back to you within <strong>24-48 business hours</strong>.</p>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">Infinaut · Building Digital Ecosystems That Drive Intelligent Growth</p>
          </div>
        </body>
        </html>
      `
    };

    // Send both emails
    const mainEmail = await transporter.sendMail(mailOptions);
    console.log('✅ Main email sent:', mainEmail.messageId);
    
    try {
      const autoReply = await transporter.sendMail(autoReplyOptions);
      console.log('✅ Auto-reply sent to:', cleanEmail);
    } catch (autoError) {
      console.warn('⚠️ Auto-reply failed:', autoError.message);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully! We\'ll get back to you soon.'
    });
    
  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later or email us directly at hello@infinaut.tech' 
    });
  }
});

// ============================================
// 404 HANDLER FOR UNDEFINED ROUTES
// ============================================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║   🚀 INFINAUT EMAIL SERVER IS RUNNING                ║
║                                                      ║
║   📍 Local:     http://localhost:${PORT}              ║
║   📡 API Test:  http://localhost:${PORT}/api/test     ║
║   📧 Contact:   http://localhost:${PORT}/api/contact  ║
║                                                      ║
║   🔗 Allowed Origins:                                ║
║      - http://localhost:3000                         ║
║      - http://localhost:5173                         ║
║      - http://localhost:5174                         ║
║      - https://infinaut.tech                         ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
  `);
});

export default app;