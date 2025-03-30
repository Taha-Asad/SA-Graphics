const bcrypt = require('bcryptjs');

(async () => {
    const enteredPassword = "TahaAsad"; // Password you are entering in login
    const storedHash = "$2b$12$ORwZrEeeW7RUO4y0kAZm3./aQ0f/nvyzNqLYmHsg/W9Afvorr3/Me"; // Your hashed password from DB

    const match = await bcrypt.compare(enteredPassword, storedHash);
    console.log("Does password match?", match);
})();
