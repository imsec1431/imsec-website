import FAQ from "../models/FAQ.js";

/* =========================================================
   DEFAULT FAQ DATA
========================================================= */

const defaultFAQData = {
  title: "Frequently Asked Questions",

  subtitle:
    "Find answers to the most frequently asked questions about IMS Engineering College.",

  heroLabel: "ADMISSIONS",

  heroTitle: "Frequently Asked Questions",

  heroDescription:
    "Find answers about admissions, academics, campus facilities, hostel and student life.",

  categories: ["General", "Academics", "Admissions", "Campus", "Hostel"],

  faqs: [
    {
      question: "When was IMS Engineering College established?",

      answer: "IMS Engineering College was established in the year 2002.",

      category: "General",

      displayOrder: 1,

      isActive: true,
    },

    {
      question: "Where is IMS Engineering College located?",

      answer: "IMS Engineering College is located in Ghaziabad, Uttar Pradesh.",

      category: "General",

      displayOrder: 2,

      isActive: true,
    },

    {
      question: "Which university is IMS Engineering College affiliated with?",

      answer:
        "IMS Engineering College is affiliated with Dr. A.P.J. Abdul Kalam Technical University, Lucknow.",

      category: "General",

      displayOrder: 3,

      isActive: true,
    },

    {
      question: "Are the courses offered by IMSEC approved by AICTE?",

      answer:
        "The programmes offered by the institution are approved by the All India Council for Technical Education (AICTE), as applicable.",

      category: "General",

      displayOrder: 4,

      isActive: true,
    },

    {
      question: "Does IMSEC provide scholarship facilities?",

      answer:
        "Eligible students may avail scholarships according to applicable government rules, policies and eligibility criteria.",

      category: "General",

      displayOrder: 5,

      isActive: true,
    },

    {
      question: "Is Wi-Fi facility available on the campus?",

      answer:
        "Wi-Fi connectivity is available on campus for students and academic requirements.",

      category: "Campus",

      displayOrder: 6,

      isActive: true,
    },

    {
      question: "Does IMSEC provide hostel facilities?",

      answer:
        "Yes. Hostel facilities are available for students, subject to availability and applicable hostel rules.",

      category: "Hostel",

      displayOrder: 7,

      isActive: true,
    },

    {
      question: "Is medical assistance available on campus?",

      answer:
        "Medical assistance and healthcare support facilities are available for students and staff.",

      category: "Campus",

      displayOrder: 8,

      isActive: true,
    },

    {
      question: "What is the admission procedure at IMSEC?",

      answer:
        "Students should follow the current admission process, eligibility requirements and counselling or admission guidelines applicable to their programme.",

      category: "Admissions",

      displayOrder: 9,

      isActive: true,
    },

    {
      question: "What are the eligibility requirements for B.Tech admission?",

      answer:
        "B.Tech eligibility is governed by the applicable university, counselling and regulatory guidelines. Applicants should verify the current eligibility criteria before applying.",

      category: "Admissions",

      displayOrder: 10,

      isActive: true,
    },

    {
      question: "How can I apply for admission?",

      answer:
        "Applicants should follow the current admission and counselling process published by the college and the applicable admission authority.",

      category: "Admissions",

      displayOrder: 11,

      isActive: true,
    },

    {
      question: "Does IMSEC provide student mentoring and counselling?",

      answer:
        "The institution provides mentoring and student-support initiatives to assist students with academic and other college-related matters.",

      category: "Academics",

      displayOrder: 12,

      isActive: true,
    },

    {
      question: "Does IMSEC have technical and student clubs?",

      answer:
        "Students can participate in technical, cultural, professional and extracurricular activities organised through the institution and student clubs.",

      category: "Campus",

      displayOrder: 13,

      isActive: true,
    },

    {
      question: "Are sports facilities available at the college?",

      answer:
        "Sports and recreational facilities are available for students as part of campus and student activities.",

      category: "Campus",

      displayOrder: 14,

      isActive: true,
    },

    {
      question: "Does IMSEC support research and innovation activities?",

      answer:
        "The institution promotes research, innovation and academic activities through faculty and student initiatives.",

      category: "Academics",

      displayOrder: 15,

      isActive: true,
    },
  ],

  isPublished: true,
};

/* =========================================================
   SORT FAQS
========================================================= */

const sortFAQs = (faq) => {
  if (!faq) {
    return faq;
  }

  faq.faqs = (faq.faqs || []).sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
  );

  return faq;
};

/* =========================================================
   GET ADMIN FAQ
========================================================= */

export const getAdminFAQ = async (req, res) => {
  try {
    let faq = await FAQ.findOne();

    /*
     * First time:
     * create default FAQ data.
     */

    if (!faq) {
      faq = await FAQ.create(defaultFAQData);
    }

    return res.status(200).json({
      success: true,

      data: sortFAQs(faq.toObject()),
    });
  } catch (error) {
    console.error("GET ADMIN FAQ ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load FAQ.",
    });
  }
};

/* =========================================================
   GET PUBLIC FAQ
========================================================= */

export const getPublicFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findOne({
      isPublished: true,
    });

    if (!faq) {
      return res.status(200).json({
        success: true,

        data: null,
      });
    }

    const data = faq.toObject();

    /*
     * Public page receives only
     * active questions.
     */

    data.faqs = (data.faqs || []).filter((item) => item.isActive !== false);

    return res.status(200).json({
      success: true,

      data: sortFAQs(data),
    });
  } catch (error) {
    console.error("GET PUBLIC FAQ ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to load FAQ.",
    });
  }
};

/* =========================================================
   CREATE FAQ DOCUMENT
========================================================= */

export const createFAQ = async (req, res) => {
  try {
    const existing = await FAQ.findOne();

    if (existing) {
      return res.status(200).json({
        success: true,

        message: "FAQ already exists.",

        data: sortFAQs(existing.toObject()),
      });
    }

    const faq = await FAQ.create(defaultFAQData);

    return res.status(201).json({
      success: true,

      message: "FAQ created successfully.",

      data: sortFAQs(faq.toObject()),
    });
  } catch (error) {
    console.error("CREATE FAQ ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to create FAQ.",
    });
  }
};

/* =========================================================
   UPDATE FAQ
========================================================= */

export const updateFAQ = async (req, res) => {
  try {
    const faqData = req.body;

    if (!faqData) {
      return res.status(400).json({
        success: false,

        message: "FAQ data is required.",
      });
    }

    let faq = await FAQ.findOne();

    /*
     * Create defaults if document
     * does not exist.
     */

    if (!faq) {
      faq = await FAQ.create(defaultFAQData);
    }

    /*
     * Do not allow clients to
     * overwrite MongoDB fields.
     */

    delete faqData._id;

    delete faqData.__v;

    delete faqData.createdAt;

    delete faqData.updatedAt;

    Object.assign(faq, faqData);

    await faq.save();

    return res.status(200).json({
      success: true,

      message: "FAQ updated successfully.",

      data: sortFAQs(faq.toObject()),
    });
  } catch (error) {
    console.error("UPDATE FAQ ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to update FAQ.",
    });
  }
};

/* =========================================================
   PUBLISH FAQ
========================================================= */

export const publishFAQ = async (req, res) => {
  try {
    let faq = await FAQ.findOne();

    if (!faq) {
      faq = await FAQ.create(defaultFAQData);
    }

    faq.isPublished = true;

    await faq.save();

    return res.status(200).json({
      success: true,

      message: "FAQ published successfully.",

      data: sortFAQs(faq.toObject()),
    });
  } catch (error) {
    console.error("PUBLISH FAQ ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to publish FAQ.",
    });
  }
};

/* =========================================================
   UNPUBLISH FAQ
========================================================= */

export const unpublishFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findOne();

    if (!faq) {
      return res.status(404).json({
        success: false,

        message: "FAQ not found.",
      });
    }

    faq.isPublished = false;

    await faq.save();

    return res.status(200).json({
      success: true,

      message: "FAQ unpublished successfully.",

      data: sortFAQs(faq.toObject()),
    });
  } catch (error) {
    console.error("UNPUBLISH FAQ ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to unpublish FAQ.",
    });
  }
};

/* =========================================================
   RESET FAQ
========================================================= */

export const resetFAQ = async (req, res) => {
  try {
    let faq = await FAQ.findOne();

    if (!faq) {
      faq = await FAQ.create(defaultFAQData);
    } else {
      faq.title = defaultFAQData.title;

      faq.subtitle = defaultFAQData.subtitle;

      faq.heroLabel = defaultFAQData.heroLabel;

      faq.heroTitle = defaultFAQData.heroTitle;

      faq.heroDescription = defaultFAQData.heroDescription;

      faq.categories = defaultFAQData.categories;

      faq.faqs = defaultFAQData.faqs;

      faq.isPublished = defaultFAQData.isPublished;

      await faq.save();
    }

    return res.status(200).json({
      success: true,

      message: "FAQ reset to default successfully.",

      data: sortFAQs(faq.toObject()),
    });
  } catch (error) {
    console.error("RESET FAQ ERROR:", error);

    return res.status(500).json({
      success: false,

      message: "Unable to reset FAQ.",
    });
  }
};
