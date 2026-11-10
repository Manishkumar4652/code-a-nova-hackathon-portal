import mongoose from 'mongoose';

/**
 * Sub-schema for individual team members
 */
const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
      minlength: [2, 'Team member name must be at least 2 characters long'],
    },
    email: {
      type: String,
      required: [true, 'Team member email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address for team member'],
    },
  },
  { _id: false }
);

/**
 * URL validation regex pattern
 */
const urlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .~-]*)*\/?(\?.*)?$/i;

/**
 * Hackathon Registration Schema
 * Enforces field validations, 10-digit mobile number, URL constraints,
 * and dynamic team size synchronization.
 */
const hackathonRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters long'],
      match: [/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number'],
    },
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year of study is required'],
      trim: true,
    },
    domain: {
      type: String,
      required: [true, 'Domain / Track is required'],
      trim: true,
    },
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [5, 'Project name must be at least 5 characters long'],
    },
    pptUrl: {
      type: String,
      required: [true, 'PPT link is required'],
      trim: true,
      match: [urlRegex, 'Please provide a valid URL for PPT (Google Drive / OneDrive)'],
    },
    prototypeUrl: {
      type: String,
      required: [true, 'Prototype link is required'],
      trim: true,
      match: [urlRegex, 'Please provide a valid URL for prototype (GitHub / Figma / live demo)'],
    },
    demoVideoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v || v.trim() === '') return true;
          return urlRegex.test(v);
        },
        message: 'Please provide a valid URL for demo video (YouTube / Drive)',
      },
      default: '',
    },
    teamSize: {
      type: Number,
      required: [true, 'Team size is required'],
      min: [1, 'Team size must be between 1 and 5'],
      max: [5, 'Team size must be between 1 and 5'],
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: [],
      validate: {
        validator: function (members) {
          if (this.teamSize === 1) {
            return !members || members.length === 0;
          }
          return members && members.length === this.teamSize - 1;
        },
        message: 'The number of additional team members must be exactly teamSize - 1.',
      },
    },
  },
  {
    timestamps: true,
  }
);

const HackathonRegistration = mongoose.model(
  'HackathonRegistration',
  hackathonRegistrationSchema
);

export default HackathonRegistration;

