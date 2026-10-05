import mongoose from "mongoose";

const gymSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: "gym",
    },

    title: {
      type: String,
      required: true,
      trim: true,
      default: "Gym",
    },

    heading: {
      type: String,
      required: true,
      trim: true,
      default: "Gym & Fitness Centre",
    },

    description: {
      type: String,
      required: true,
      trim: true,
      default:
        "The institute provides a well-equipped gym and fitness facility to encourage students and staff to maintain a healthy and active lifestyle.",
    },

    facilityDescription: {
      type: String,
      required: true,
      trim: true,
      default:
        "The gym provides a suitable environment for regular exercise, fitness activities and physical well-being. Students can make use of the available fitness equipment and facilities during the designated timings.",
    },

    timings: {
      type: String,
      required: true,
      trim: true,
      default: "Monday to Saturday: 7:00 AM to 8:00 PM",
    },

    location: {
      type: String,
      required: true,
      trim: true,
      default: "Institute Campus",
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
      default: "Gym & Fitness Centre Coordinator",
    },

    contactEmail: {
      type: String,
      required: true,
      trim: true,
      default: "gym@imsec.ac.in",
    },

    contactPhone: {
      type: String,
      required: true,
      trim: true,
      default: "+91-120-4081999",
    },

    photo1: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",
      trim: true,
    },

    photo2: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=85",
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const getDefaultGym = () => ({
  singletonKey: "gym",

  title: "Gym",

  heading: "Gym & Fitness Centre",

  description:
    "The institute provides a well-equipped gym and fitness facility to encourage students and staff to maintain a healthy and active lifestyle.",

  facilityDescription:
    "The gym provides a suitable environment for regular exercise, fitness activities and physical well-being. Students can make use of the available fitness equipment and facilities during the designated timings.",

  timings: "Monday to Saturday: 7:00 AM to 8:00 PM",

  location: "Institute Campus",

  contactPerson: "Gym & Fitness Centre Coordinator",

  contactEmail: "gym@imsec.ac.in",

  contactPhone: "+91-120-4081999",

  photo1:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85",

  photo2:
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=85",

  published: true,
});

const Gym = mongoose.models.Gym || mongoose.model("Gym", gymSchema);

export default Gym;
