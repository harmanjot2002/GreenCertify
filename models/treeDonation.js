const mongoose = require('mongoose');

const TreeDonationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  amount: Number,
  treesDonated: Number,
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => mongoose.Types.ObjectId(),
    auto: true,
  },
});

const TreeDonation = mongoose.model('TreeDonation', TreeDonationSchema);

module.exports = TreeDonation;
