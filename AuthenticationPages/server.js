const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;

// Middleware for JSON body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

// In-memory storage for users
let users = [];

// Profile Creation Endpoint (with username and password)
app.post("/api/profile", upload.single("profilePicture"), (req, res) => {
  try {
    const { name, age, gender, location, interests, username, password } =
      req.body;

    // Validate required fields (except profile picture)
    if (
      !name ||
      !age ||
      !gender ||
      !location ||
      !interests ||
      !username ||
      !password
    ) {
      return res
        .status(400)
        .json({
          error:
            "All fields are required: name, age, gender, location, interests, username, and password!",
        });
    }

    // Check if username already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken!" });
    }

    // Create a new user object
    const newUser = {
      id: users.length + 1,
      name,
      age,
      gender,
      location,
      interests,
      username,
      password, // You should hash this in production
      profilePicture: req.file ? req.file.path : null, // Make profilePicture optional
    };

    users.push(newUser); // Store the new user
    res
      .status(201)
      .json({ message: "Profile created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Endpoint (with username and password)
app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required!" });
    }

    // Find the user by username
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    // Check if the password matches
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
