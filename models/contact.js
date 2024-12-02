const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    email: { type: String, unique: true, sparse: true },
    phoneNumber: { type: String, unique: true, sparse: true },
    isPrimary: { type: Boolean, default: true },
    primaryContactId: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", default: null },
});

module.exports = mongoose.model("Contact", contactSchema);


