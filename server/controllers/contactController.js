import { sendContactEmail } from '../utils/email.js';

/**
 * @desc    Public contact details (project mailbox shown on the Contact page / footer)
 * @route   GET /api/contact/info
 * @access  Public
 */
export const getContactInfo = (req, res) => {
  const email = process.env.CONTACT_EMAIL || process.env.EMAIL_USER || '';
  return res.status(200).json({ status: 'success', email: email.trim() });
};

/**
 * @desc    Submit inquiry/support message — forwarded to the project mailbox
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields: name, email, and message.',
      });
    }

    if ([name, email, message].some((v) => typeof v !== 'string')) {
      return res.status(400).json({ status: 'error', message: 'Invalid input.' });
    }

    if (name.trim().length < 2 || name.trim().length > 80) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must be between 2 and 80 characters.',
      });
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim()) || email.length > 120) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address.',
      });
    }

    if (message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({
        status: 'error',
        message: 'Message must be between 10 and 2000 characters.',
      });
    }

    const result = await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    // With SMTP configured a delivery failure is a real error; in local dev
    // (no SMTP) the message is only logged so the flow can still be tested.
    if (result.configured && !result.success) {
      return res.status(502).json({
        status: 'error',
        message: 'We could not deliver your message right now. Please try again in a few minutes.',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Thank you for reaching out to Code-a-Nova. Your inquiry has been received by our organizing team.',
    });
  } catch (error) {
    next(error);
  }
};
