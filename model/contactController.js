const db = require("../config/dbConnection");

// Save contact information to the database
exports.contact = async (userTable) => {
  try {
    const { user_name, user_email, user_mobile, user_subject, user_message } =
      userTable;

    // SQL query
    const query = `
    INSERT INTO organic_farmer_contact_table (
      user_name,
      user_email,
      user_mobile,
      user_subject,
      user_message
    ) VALUES (?, ?, ?, ?, ?)
  `;

    // Execute the query with the user data
    const [results] = await db
      .promise()
      .query(query, [
        user_name,
        user_email,
        user_mobile,
        user_subject,
        user_message,
      ]);

    return results; // Return query results if needed
  } catch (error) {
    console.error("Database error:", error); // Log the error for debugging
    throw new Error("Error saving contact information to the database.");
  }
};

// Get All contact
exports.getAllContact = async () => {
  try {
    const query = "SELECT * FROM organic_farmer_contact_table";
    const [contact] = await db.promise().query(query);
    return contact;
  } catch (error) {
    throw new Error(error.message);
  }
};
