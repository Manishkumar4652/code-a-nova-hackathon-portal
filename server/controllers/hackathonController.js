import HackathonRegistration from '../models/HackathonRegistration.js';
import { sendRegistrationConfirmationEmail } from '../utils/email.js';

const urlPattern = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .~-]*)*\/?(\?.*)?$/i;
const namePattern = /^[a-zA-Z\s]+$/;
const mobilePattern = /^[6-9]\d{9}$/;
const emailPattern = /^\S+@\S+\.\S+$/;

/**
 * @desc    Submit a new Hackathon Registration
 * @route   POST /api/hackathon/register
 * @access  Private (JWT Protected & Verified Account Required)
 */
export const registerHackathon = async (req, res, next) => {
  try {
    const user = req.user;

    // Guard: Account verification check
    if (!user.isVerified) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account must be verified via OTP before registering for the hackathon.',
      });
    }

    // Guard: Duplicate registration check by user ID
    const existingRegistration = await HackathonRegistration.findOne({ user: user._id });
    if (existingRegistration) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already submitted a registration for this hackathon.',
      });
    }

    const {
      fullName,
      mobile,
      college,
      course,
      branch,
      year,
      domain,
      projectName,
      pptUrl,
      prototypeUrl,
      demoVideoUrl,
      teamSize,
      teamMembers,
    } = req.body;

    // Field presence validation
    if (
      !fullName ||
      !mobile ||
      !college ||
      !course ||
      !branch ||
      !year ||
      !domain ||
      !projectName ||
      !pptUrl ||
      !prototypeUrl ||
      teamSize === undefined
    ) {
      return res.status(400).json({
        status: 'error',
        message: 'Please fill in all mandatory fields.',
      });
    }

    // Name format validation
    if (fullName.trim().length < 3 || !namePattern.test(fullName.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Full name must be at least 3 characters long and contain only letters and spaces.',
      });
    }

    // Mobile number validation (10-digit Indian number)
    if (!mobilePattern.test(mobile.toString().trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Mobile number must be a valid 10-digit Indian mobile number.',
      });
    }

    // Project name validation
    if (projectName.trim().length < 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Project name must be at least 5 characters long.',
      });
    }

    // URL validations
    if (!urlPattern.test(pptUrl.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid shareable link for your PPT presentation.',
      });
    }

    if (!urlPattern.test(prototypeUrl.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid URL for your prototype (GitHub / Figma / Live demo).',
      });
    }

    if (demoVideoUrl && demoVideoUrl.trim() !== '' && !urlPattern.test(demoVideoUrl.trim())) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid URL for your demo video (YouTube / Drive).',
      });
    }

    // Team size validation (1 to 5)
    const parsedTeamSize = parseInt(teamSize, 10);
    if (isNaN(parsedTeamSize) || parsedTeamSize < 1 || parsedTeamSize > 5) {
      return res.status(400).json({
        status: 'error',
        message: 'Team size must be an integer between 1 and 5.',
      });
    }

    // Dynamic team members validation
    const cleanMembers = [];

    if (parsedTeamSize === 1) {
      if (Array.isArray(teamMembers) && teamMembers.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Solo registration (team size 1) cannot include additional team members.',
        });
      }
    } else {
      const requiredAdditionalMembers = parsedTeamSize - 1;
      const providedMembers = Array.isArray(teamMembers) ? teamMembers : [];

      if (providedMembers.length !== requiredAdditionalMembers) {
        return res.status(400).json({
          status: 'error',
          message: `Team size ${parsedTeamSize} requires exactly ${requiredAdditionalMembers} additional team member(s).`,
        });
      }

      for (let i = 0; i < providedMembers.length; i++) {
        const m = providedMembers[i];
        if (!m || !m.name || !m.email) {
          return res.status(400).json({
            status: 'error',
            message: `Team member #${i + 1} must include both a name and a valid email address.`,
          });
        }

        if (m.name.trim().length < 2) {
          return res.status(400).json({
            status: 'error',
            message: `Team member #${i + 1} name must be at least 2 characters long.`,
          });
        }

        if (!emailPattern.test(m.email.trim())) {
          return res.status(400).json({
            status: 'error',
            message: `Team member #${i + 1} has an invalid email address format.`,
          });
        }

        cleanMembers.push({
          name: m.name.trim(),
          email: m.email.toLowerCase().trim(),
        });
      }
    }

    // Create and save hackathon registration using authenticated user credentials
    const registration = new HackathonRegistration({
      user: user._id, // Enforce authenticated user ID
      fullName: fullName.trim(),
      email: user.email, // Enforce verified user email from account
      mobile: mobile.toString().trim(),
      college: college.trim(),
      course: course.trim(),
      branch: branch.trim(),
      year: year.trim(),
      domain: domain.trim(),
      projectName: projectName.trim(),
      pptUrl: pptUrl.trim(),
      prototypeUrl: prototypeUrl.trim(),
      demoVideoUrl: demoVideoUrl && demoVideoUrl.trim() !== '' ? demoVideoUrl.trim() : '',
      teamSize: parsedTeamSize,
      teamMembers: cleanMembers,
    });

    const savedRegistration = await registration.save();

    // Send confirmation email asynchronously (does not revert registration on failure)
    const emailResult = await sendRegistrationConfirmationEmail({
      to: user.email,
      participantName: fullName.trim(),
      projectName: projectName.trim(),
      domain: domain.trim(),
      teamSize: parsedTeamSize,
      teamMembers: cleanMembers,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Hackathon registration submitted successfully.',
      registration: savedRegistration,
      emailSent: emailResult.success,
      emailConfigured: emailResult.configured,
    });
  } catch (error) {
    // Handle MongoDB duplicate key error gracefully
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already registered for this hackathon.',
      });
    }

    next(error);
  }
};

/**
 * @desc    Fetch authenticated user's hackathon registration
 * @route   GET /api/hackathon/my-entry
 * @access  Private (JWT Protected)
 */
export const getMyEntry = async (req, res, next) => {
  try {
    const entry = await HackathonRegistration.findOne({ user: req.user._id });

    if (!entry) {
      return res.status(200).json({
        status: 'success',
        hasRegistered: false,
        entry: null,
        message: 'No hackathon registration found for this account.',
      });
    }

    return res.status(200).json({
      status: 'success',
      hasRegistered: true,
      entry,
    });
  } catch (error) {
    next(error);
  }
};

