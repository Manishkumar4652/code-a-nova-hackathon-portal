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

