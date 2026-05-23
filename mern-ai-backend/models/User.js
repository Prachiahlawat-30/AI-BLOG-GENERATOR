const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    subscription: {
      type: String,
      enum: ['trial', 'free', 'basic', 'premium'],
      default: 'trial',
    },

    trialExpires: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
    },

    credits: {
      type: Number,
      default: 10,
    },

    apiRequestCount: {
      type: Number,
      default: 0,
    },

    monthlyRequestCount: {
      type: Number,
      default: 0,
    },

    nextBillingDate: Date,
    planExpires: Date,

    razorpayCustomerId: String,
    subscriptionId: String,

    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],

    contentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContentHistory',
      },
    ],
  },
  {
    timestamps: true,
    toJSON : { virtuals : true},
    toObject : { virtuals : true}
  }
);

const User = mongoose.model('User', userSchema);
module.exports = User;