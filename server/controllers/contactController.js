/**
 * @desc    Submit inquiry/support message
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

    if (name.trim().length < 2) {
      return res.status(400).json({
        status: 'error',
        message: 'Name must be at least 2 characters long.',
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address.',
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Message must be at least 10 characters long.',
      });
    }

    console.log(`📩 [Contact Form Submission]: Received inquiry from ${name.trim()} (${email.trim()})`);

    return res.status(200).json({
      status: 'success',
      message: 'Thank you for reaching out to Code-a-Nova. Your inquiry has been received by our organizing team.',
    });
  } catch (error) {
    next(error);
  }
};

