const express = require("express");
const multer = require("multer");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer({ dest: "uploads/" });
let users = [];

app.post("/api/profile", upload.single("profilePicture"), (req, res) => {
  try {
    const { name, age, gender, location, interests, username, password } =
      req.body;
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
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(400).json({ error: "Username is already taken!" });
    }
    const newUser = {
      id: users.length + 1,
      name,
      age,
      gender,
      location,
      interests,
      username,
      password, 
      profilePicture: req.file ? req.file.path : null, 
    };

    users.push(newUser); 
    res
      .status(201)
      .json({ message: "Profile created successfully!", user: newUser });
  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required!" });
    }
    const user = users.find((u) => u.username === username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
