const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true
  },

  emailNotifications: {
  type: Boolean,
  default: true
},

notificationsStartDate: {
  type: Date,
  default: Date.now
},

  card: {
    holder: { type: String, default: "" },
    number: { type: String, default: "" },
    expiry: { type: String, default: "" }
  },

  bank: {
    name: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    accountName: { type: String, default: "" },
    currency: { type: String, default: "NGN" }
  },

  profileImage: {
    type: String,
    default: ""
  },

  walletBalance: {
    type: Number,
    default: 0
  },

  totalEarned: {
  type: Number,
  default: 0
},

  tasksCompleted: {
  type: Number,
  default: 0
},

  // ✅ FIXED: make referralCode required + stable
  referralCode: {
    type: String,
    unique: true,
    
  },

  // 🔴 IMPORTANT: this stores who referred this user (referralCode)
  referredBy: {
    type: String,
    default: null,
    index: true   // ✅ makes referral queries faster
  },

  membershipTier: {
    type: String,
    enum: ["Starter", "Bronze", "Silver", "Gold", "Premium"],
    default: "Starter"
  },

  pendingMembershipTier: {
  type: String,
  enum: ["Bronze", "Silver", "Gold", "Premium"],
  default: null
},

pendingMembershipAmount: {
  type: Number,
  default: 0
},

  membershipActivatedAt: {
  type: Date,
  default: null
},

  tierAmount: {
    type: Number,
    enum: [0, 25000, 50000, 75000, 100000],
    default: 0
  },

  activationStatus: {
    type: String,
    enum: ["pending", "active", "rejected"],
    default: "pending"
  },

  selectedVendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor"
  },

  referralEarnings: {
    type: Number,
    default: 0
  },

  referralsCount: {
    type: Number,
    default: 0
  },

  membershipActive: {
    type: Boolean,
    default: false,
    index: true   // ✅ speeds up referral filtering
  },

  // 🔥 NEW (OPTIONAL BUT STRONG UPGRADE)
  referralHistory: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      earnings: {
        type: Number,
        default: 1500
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  recentActivity: [
  {
    text: String,
    amount: Number,
    type: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
],

  surveysCompleted:{
    type: Number, 
    default: 0 
  },

  dailySurveyStats: {
  date: String,
  count: {
    type: Number,
    default: 0
  }
},
  
  earningsHistory: [
  {
    date: String,
    amount: Number
  }
],

isBanned: {
  type: Boolean,
  default: false
}


}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);