/**
 * @desc    Fetch current authenticated user profile
 * @route   GET /api/user/me
 * @access  Private (JWT protected)
 */
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      status: 'success',
      user: req.user.toSafeObject ? req.user.toSafeObject() : req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update authenticated user's profile (full name)
 * @route   PUT /api/user/update
 * @access  Private (JWT protected)
 */
export const updateMe = async (req, res, next) => {
  try {
    const { fullName } = req.body;

    if (typeof fullName !== 'string' || fullName.trim().length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name must be at least 3 characters long.',
      });
    }

    if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name can only contain letters and spaces.',
      });
    }

    req.user.fullName = fullName.trim();
    await req.user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully.',
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    next(error);
  }
};
