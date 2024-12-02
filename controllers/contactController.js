const Contact = require('../models/contact');

// POST /identify
const identifyContact = async (req, res) => {
  const { email, phoneNumber } = req.body;

  try {
    // Check if a primary contact already exists
    const existingContact = await Contact.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingContact) {
      // If contact exists, return the consolidated data
      const primaryContact = await Contact.findOne({ contactId: existingContact.primaryContactId });
      const secondaryContacts = await Contact.find({ primaryContactId: primaryContact.contactId, isPrimary: false });
      return res.json({
        contact: {
          primaryContactId: primaryContact.contactId,
          emails: [primaryContact.email, ...secondaryContacts.map(c => c.email)],
          phoneNumbers: [primaryContact.phoneNumber, ...secondaryContacts.map(c => c.phoneNumber)],
          secondaryContactIds: secondaryContacts.map(c => c.contactId),
        },
      });
    }

    // Create a new primary contact if none exists
    const newContact = await Contact.create({
      contactId: new mongoose.Types.ObjectId(),
      email,
      phoneNumber,
      isPrimary: true,
    });

    res.status(201).json({ contact: newContact });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /search
const searchContacts = async (req, res) => {
  const { email, phoneNumber } = req.query;

  try {
    // Search for primary contacts
    const query = {};
    if (email) query.email = email;
    if (phoneNumber) query.phoneNumber = phoneNumber;

    const contacts = await Contact.find({ ...query, isPrimary: true });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  identifyContact,
  searchContacts,
};
