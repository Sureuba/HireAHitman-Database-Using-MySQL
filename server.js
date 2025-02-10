const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session'); // import session middleware
const path = require('path');
require('dotenv').config();

// initialize the Express app
const app = express();

// database connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'HitmanforHire'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
    return;
  }
  console.log('Connected to the MySQL database');
});

// miiddleware to parse 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configure session 
app.use(session({
  secret: 'your-secret-key', // replace with secure key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // true if using HTTPS
}));

// serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// serve the login page at the root ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// serve the signup page for Hitman
app.get('/signup-hitman', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup-hitman.html'));
});

// for signup for Hitman
app.post('/signup-hitman', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Error hashing password' });
    }

    const query = 'INSERT INTO hitman (HUserID, HPassword) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting hitman data:', err.message);
        return res.status(500).json({ error: 'Signup failed' });
      }
      res.status(200).json({ message: 'Signup successful' });
    });
  });
});

// ******************************************************************************************
// SIGN UP USERS
// serve the signup page for Client
app.get('/signup-client', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup-client.html'));
});

// for signup for Client
app.post('/signup-client', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ error: 'Error hashing password' });
    }

    const query = 'INSERT INTO client (CUserID, CPassword) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting client data:', err.message);
        return res.status(500).json({ error: 'Signup failed' });
      }
      res.status(200).json({ message: 'Signup successful' });
    });
  });
});


// ******************************************************************************************
// SERVE EACH DASHBOARD 
// serve the hitman dashboard
app.get('/hitman-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hitman-dashboard.html'));
});

// serve the client dashboard
app.get('/client-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-dashboard.html'));
});

// ******************************************************************************************
// USER WANTS TO LOG OUT 

// logout
app.get('/logout', (req, res) => {
  req.session.destroy(); // Destroy session on logout
  res.redirect('/');
});

// ******************************************************************************************
// SERVE EACH UPDATE PROFILE PAGE 
// serve the update profile page for Hitman
app.get('/update-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'update-profile.html'));
});

// serve the update profile page for Client
app.get('/hit-specifications', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'hit-specifications.html'));
});

// ******************************************************************************************
// GET ALL PREFERENCES FROM SQL DB
// endp to get all weapons for the dropdown
app.get('/weapons', (req, res) => {
  const query = 'SELECT Type, ResultingKillMethod FROM Weapon';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching weapon data' });
    }
    res.status(200).json(results);
  });
});

// endp to get the currently logged-in user's username
app.get('/get-current-user', (req, res) => {
  if (req.session.username) {
    // retrieve the client ID from the session or database
    const username = req.session.username;

    //  get the CUserID for the logged-in user from client table
    const query = 'SELECT CUserID FROM client WHERE CUserID = ?';
    db.query(query, [username], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching user data' });
      }
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      // result returns one row with the CUserID
      const clientID = result[0].CUserID;
      return res.status(200).json({ username, clientID }); // psuh clientID as part of the response
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

// get the current user - HITMAN SIDE
app.get('/get-current-h-user', (req, res) => {
  if (req.session.username) {
    // retrieve the client ID from the session or database
    const username = req.session.username;

    // q the client table to get the CUserID for the logged-in user
    const query = 'SELECT HUserID FROM hitman WHERE HUserID = ?';
    db.query(query, [username], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching user data' });
      }
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Hitman not found' });
      }

      // result returns one row with the CUserID
      const clientID = result[0].CUserID;
      return res.status(200).json({ username, clientID }); // push the clientID as part of the response
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

// endp to get all locations for the dropdown
app.get('/locations', (req, res) => {
  const query = 'SELECT State, City, Landmark FROM LocationOfOperation';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching location data' });
    }
    res.status(200).json(results);
  });
});

// endp to get all payment options for the dropdown
app.get('/payments', (req, res) => {
  const query = 'SELECT DebtSpecific, PriceRange, PBonus FROM Payment';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching payment data' });
    }
    res.status(200).json(results);
  });
});

// endp to get all mind game techniques for the dropdown
app.get('/mind-games', (req, res) => {
  const query = 'SELECT Technique, RiskFactor FROM MindGames';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching mind game techniques' });
    }
    res.status(200).json(results);
  });
});

// endp to get all communications
app.get('/communications', (req, res) => {
  const query = 'SELECT * FROM Communication';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching communication data:', err);
      return res.status(500).json({ error: 'Failed to fetch communication data' });
    }
    res.json(results); // send back the result rows in JSON format
  });
});

// endp to get all timelines
app.get('/timelines', (req, res) => {
  const query = 'SELECT * FROM Timeline'; // get all columns
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching timeline data:', err);
      return res.status(500).json({ error: 'Failed to fetch timeline data' });
    }
    res.json(results); // push the results back as JSON
  });
});

// ******************************************************************************************
// UPDATE HITMAN PROFILE ONCE THEY INSERT INFO 

// endp to update weapon preference for the Hitman
app.post('/update-weapon-preference', (req, res) => {
  const { username, weaponPreference } = req.body;

  const selectQuery = 'SELECT * FROM Hitman WHERE HUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Hitman SET HWeapon = ? WHERE HUserID = ?';
      db.query(updateQuery, [weaponPreference, username], (err, result) => {
        if (err) {
          console.error('Error updating weapon preference:', err.message);
          return res.status(500).json({ error: 'Error updating weapon preference' });
        }
        res.status(200).json({ message: 'Weapon preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Hitman not found' });
    }
  });
});

// endp to update location preference for the Hitman
app.post('/update-location-preference', (req, res) => {
  const { username, locationPreference } = req.body;

  const selectQuery = 'SELECT * FROM Hitman WHERE HUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Hitman SET HState = ? WHERE HUserID = ?';
      db.query(updateQuery, [locationPreference, username], (err, result) => {
        if (err) {
          console.error('Error updating location preference:', err.message);
          return res.status(500).json({ error: 'Error updating location preference' });
        }
        res.status(200).json({ message: 'Location preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Hitman not found' });
    }
  });
});

// endp to update payment preference for the Hitman
app.post('/update-payment-preference', (req, res) => {
  const { username, paymentPreference } = req.body;

  const selectQuery = 'SELECT * FROM Hitman WHERE HUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Hitman SET HDebtSpecification = ? WHERE HUserID = ?';
      db.query(updateQuery, [paymentPreference, username], (err, result) => {
        if (err) {
          console.error('Error updating payment preference:', err.message);
          return res.status(500).json({ error: 'Error updating payment preference' });
        }
        res.status(200).json({ message: 'Payment preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Hitman not found' });
    }
  });
});

// endp to update mind game preference for the Hitman
app.post('/update-mind-game-preference', (req, res) => {
  const { username, mindGamePreference } = req.body;

  const selectQuery = 'SELECT * FROM Hitman WHERE HUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Hitman SET HPsychTechnique = ? WHERE HUserID = ?';
      db.query(updateQuery, [mindGamePreference, username], (err, result) => {
        if (err) {
          console.error('Error updating mind game preference:', err.message);
          return res.status(500).json({ error: 'Error updating mind game preference' });
        }
        res.status(200).json({ message: 'Mind game preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Hitman not found' });
    }
  });
});

// endp to update communication preference
app.post('/update-communication-preference', (req, res) => {
  const { username, communicationPreference } = req.body;

  const query = 'UPDATE Hitman SET HCommunication = ? WHERE HUserID = ?';
  db.query(query, [communicationPreference, username], (err, result) => {
    if (err) {
      console.error('Error updating communication preference:', err);
      return res.status(500).json({ error: 'Error updating communication preference' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Communication preference updated successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to update communication preference' });
    }
  });
});

// endp to update timeline preference for the Hitman
app.post('/update-timeline-preference', (req, res) => {
  const { username, timelinePreference } = req.body;

  // make a JavaScript Date object from the input
  const timelineDate = new Date(timelinePreference);

  // make suree the date is valid
  if (isNaN(timelineDate)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // date to format MySQL expects: YYYY-MM-DD HH:MM:SS
  const mysqlFormattedDate = timelineDate.toISOString().slice(0, 19).replace('T', ' ');

  const query = 'UPDATE Hitman SET HTimeline = ? WHERE HUserID = ?';
  db.query(query, [mysqlFormattedDate, username], (err, result) => {
    if (err) {
      console.error('Error updating timeline preference:', err.message);
      return res.status(500).json({ error: 'Error updating timeline preference' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Timeline preference updated successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to update timeline preference' });
    }
  });
});

// endp to update code name for the hitman
app.post('/update-code-name', (req, res) => {
  const { username, codeNamePreference } = req.body;

  const query = 'UPDATE Hitman SET CodeName = ? WHERE HUserID = ?';
  db.query(query, [codeNamePreference, username], (err, result) => {
    if (err) {
      console.error('Error updating nickname:', err);
      return res.status(500).json({ error: 'Error updating nickname' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Nickname preference updated successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to update nickname' });
    }
  });
});

// ******************************************************************************************
// UPDATE CLIENT PROFILE ONCE THEY INSERT INFO 

// endp to update weapon preference for the Client
app.post('/update-c-weapon-preference', (req, res) => {
  const { username, weaponPreference } = req.body;

  const selectQuery = 'SELECT * FROM Client WHERE CUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Client SET CWeaponType = ? WHERE CUserID = ?';
      db.query(updateQuery, [weaponPreference, username], (err, result) => {
        if (err) {
          console.error('Error updating weapon preference:', err.message);
          return res.status(500).json({ error: 'Error updating weapon preference' });
        }
        res.status(200).json({ message: 'Weapon preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
});

// endp to update location preference for the Client
app.post('/update-c-location-preference', (req, res) => {
  const { username, locationPreference } = req.body;

  const selectQuery = 'SELECT * FROM Client WHERE CUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Client SET CState = ? WHERE CUserID = ?';
      db.query(updateQuery, [locationPreference, username], (err, result) => {
        if (err) {
          console.error('Error updating location preference:', err.message);
          return res.status(500).json({ error: 'Error updating location preference' });
        }
        res.status(200).json({ message: 'Location preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
});

// endp to update payment preference for the Client
app.post('/update-c-payment-preference', (req, res) => {
  const { username, paymentPreference } = req.body;

  const selectQuery = 'SELECT * FROM Client WHERE CUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Client SET CDebtSpecification = ? WHERE CUserID = ?';
      db.query(updateQuery, [paymentPreference, username], (err, result) => {
        if (err) {
          console.error('Error updating payment preference:', err.message);
          return res.status(500).json({ error: 'Error updating payment preference' });
        }
        res.status(200).json({ message: 'Payment preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
});

// endp to update mind game preference for the Client
app.post('/update-c-mind-game-preference', (req, res) => {
  const { username, mindGamePreference } = req.body;

  const selectQuery = 'SELECT * FROM Client WHERE CUserID = ?';
  db.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error('Error checking user existence:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      const updateQuery = 'UPDATE Client SET CTechnique = ? WHERE CUserID = ?';
      db.query(updateQuery, [mindGamePreference, username], (err, result) => {
        if (err) {
          console.error('Error updating mind game preference:', err.message);
          return res.status(500).json({ error: 'Error updating mind game preference' });
        }
        res.status(200).json({ message: 'Mind game preference updated successfully' });
      });
    } else {
      res.status(404).json({ error: 'Client not found' });
    }
  });
});

// endp to update communication preference
app.post('/update-c-communication-preference', (req, res) => {
  const { username, communicationPreference } = req.body;

  const query = 'UPDATE Client SET CAnonymity = ? WHERE CUserID = ?';
  db.query(query, [communicationPreference, username], (err, result) => {
    if (err) {
      console.error('Error updating communication preference:', err);
      return res.status(500).json({ error: 'Error updating communication preference' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Communication preference updated successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to update communication preference' });
    }
  });
});

// endp to update timeline preference for the Client
app.post('/update-c-timeline-preference', (req, res) => {
  const { username, timelinePreference } = req.body;

  // mmake a JavaScript Date object from the input
  const timelineDate = new Date(timelinePreference);

  // make suer the date is valid
  if (isNaN(timelineDate)) {
    return res.status(400).json({ error: 'Invalid date format' });
  }

  // turn the date to the format MySQL expects: YYYY-MM-DD HH:MM:SS
  const mysqlFormattedDate = timelineDate.toISOString().slice(0, 19).replace('T', ' ');
  console.log(mysqlFormattedDate);  // output: "2024-02-15"

  const query = 'UPDATE Client SET CFinalDueDate = ? WHERE CUserID = ?';
  db.query(query, [mysqlFormattedDate, username], (err, result) => {
    if (err) {
      console.error('Error updating timeline preference:', err.message);
      return res.status(500).json({ error: 'Error updating timeline preference' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Timeline preference updated successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to update timeline preference' });
    }
  });
});

// endp to update alias for the client
app.post('/update-c-alias', (req, res) => {
  const { username, aliasPreference } = req.body;

  const query = 'UPDATE Client SET Alias = ? WHERE CUserID = ?';
  db.query(query, [aliasPreference, username], (err, result) => {
    if (err) {
      console.error('Error updating nickname:', err);
      return res.status(500).json({ error: 'Error updating nickname' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Nickname preference updated successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to update nickname' });
    }
  });
});

// endp to update motive for the client
app.post('/update-c-motive', (req, res) => {
  const { username, motivePref } = req.body;

  const query = 'UPDATE Client SET Motive = ? WHERE CUserID = ?';
  db.query(query, [motivePref, username], (err, result) => {
    if (err) {
      console.error('Error updating motive:', err);
      return res.status(500).json({ error: 'Error updating motive' });
    }

    if (result.affectedRows > 0) {
      res.json({ message: 'Motive updated successfully!' });
    } else {
      res.status(400).json({ error: 'Failed to update motive' });
    }
  });
});

// ******************************************************************************************
// login route (for both Client and Hitman)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 1. check in the client table
  let query = 'SELECT * FROM client WHERE CUserID = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      // chekc in the hitman table if not found in client
      query = 'SELECT * FROM hitman WHERE HUserID = ?';
      db.query(query, [username], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
          return res.status(400).json({ error: 'User not found' });
        }

        bcrypt.compare(password, results[0].HPassword, (err, isMatch) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (isMatch) {
            req.session.username = username;
            res.status(200).json({ redirect: '/hitman-dashboard', username });
          } else {
            res.status(400).json({ error: 'Invalid credentials' });
          }
        });
      });
    } else {
      // is user found in client table?
      bcrypt.compare(password, results[0].CPassword, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        if (isMatch) {
          req.session.username = username; // put username in session
          res.status(200).json({ redirect: '/client-dashboard', username });
        } else {
          res.status(400).json({ error: 'Invalid credentials' });
        }
      });
    }
  });
});



// serve the Add Target page
app.get('/add-target', (req, res) => {
  if (req.session.username) {
    res.sendFile(path.join(__dirname, 'public', 'add-target.html'));
  } else {
    res.redirect('/');
  }
});

// Add Target form submission
app.post('/add-target', (req, res) => {
  const {
    TName, TAddress, TAge, TThreatLevel,
    THeight, TApproxWeight, TEyeColour, THairColour
  } = req.body;

  // user is logged in and get the session username
  if (req.session.username) {
    const username = req.session.username;

    // getCUserID of the logged-in client
    const query = 'SELECT CUserID FROM client WHERE CUserID = ?';
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error('Error fetching client data:', err.message);
        return res.status(500).json({ error: 'Error fetching client data' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
      }

      const CUserID = results[0].CUserID;

      // put in  target data into the database
      const insertQuery = 'INSERT INTO Target (TName, TAddress, TAge, TThreatLevel, THeight, TApproxWeight, TEyeColour, THairColour, CUserID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
      db.query(insertQuery, [
        TName, TAddress, TAge, TThreatLevel, THeight,
        TApproxWeight, TEyeColour, THairColour, CUserID
      ], (err, result) => {
        if (err) {
          console.error('Error inserting target data:', err.message);
          return res.status(500).json({ error: 'Error saving target' });
        }

        res.status(200).json({ success: true });
      });
    });
  } else {
    res.status(401).json({ error: 'User not logged in' });
  }
});

// endp to update the Code Name for the Hitman
app.post('/update-code-name', (req, res) => {
  const { username, codeName } = req.body;

  // ensure sure the username and code name are valid
  if (!username || !codeName) {
    return res.status(400).json({ error: 'Username and Code Name are required.' });
  }

  // q to update the Code Name for the specific hitman
  const query = 'UPDATE Hitman SET CodeName = ? WHERE HUserID = ?';
  db.query(query, [codeName, username], (err, result) => {
    if (err) {
      console.error('Error updating code name:', err.message);
      return res.status(500).json({ error: 'Error updating code name' });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: 'Code Name updated successfully' });
    } else {
      res.status(404).json({ error: 'Hitman not found' });
    }
  });
});

// MATCHING ******************************
// endp to fetch the latest client preferences and calculate the match score with hitmen
app.get('/view-matches', (req, res) => {
  const username = req.session.username;  // Assuming the client is logged in

  if (!username) {
    return res.status(401).json({ error: 'User not logged in' });
  }

  // get the latest client preferences from the database
  db.query('SELECT * FROM CLIENT WHERE CUserID = ?', [username], (err, clientResults) => {
    if (err) {
      console.error('Error fetching client preferences:', err);
      return res.status(500).json({ error: 'Error fetching client preferences' });
    }

    const client = clientResults[0]; // ass only one client with this username

    // get all hitmen preferences and calculate match scores
    db.query('SELECT * FROM HITMAN', (err, hitmanResults) => {
      if (err) {
        console.error('Error fetching hitman preferences:', err);
        return res.status(500).json({ error: 'Error fetching hitman preferences' });
      }

      // calculate match scores for each hitman
      const matchScores = hitmanResults.map(hitman => {
        const score = calculateMatchScore(client, hitman); // use the latest client preferences

        // remov username and password from hitman data
        const { HPassword, HUserID, ...hitmanData } = hitman; // exclude HPassword and HUserID
        
        return { hitman: hitmanData, score };  // return hitman data without the username and password
      });

      // sort hitmen by the highest score
      matchScores.sort((a, b) => b.score - a.score);

      // get the best match
      const bestMatch = matchScores[0];  // hitman with the highest match score
      const hitmanCodeName = bestMatch.hitman.CodeName;  // ^ hitman's code name

      // if the best match has a score of 0 (no matches):
      if (matchScores[0].score === 0) {
        // no matches found, redirect to client dashboard
        return res.status(200).json({ message: 'No matches found', redirect: '/client-dashboard' });
      }

      // update the Hitman table to set the HCUserID column with the client’s ID
      const updateHitmanQuery = `
        UPDATE Hitman 
        SET HCUserID = ? 
        WHERE CodeName = ?
      `;

      // update the hitman with the client's CUserID
      db.query(updateHitmanQuery, [client.CUserID, hitmanCodeName], (err, updateResult) => {
        if (err) {
          console.error('Error updating hitman-client relationship:', err);
          return res.status(500).json({ error: 'Error updating hitman-client relationship' });
        }

        // if  update is successful, return the matched hitman and success message
        if (updateResult.affectedRows > 0) {
          return res.status(200).json({ match: bestMatch }); // return the matched hitman with the updated info
        } else {
          return res.status(404).json({ error: 'Hitman not found for update' });
        }
      });
    });
  });
});


// function to calculate match score between client and hitman
function calculateMatchScore(client, hitman) {
  let score = 0;

  // comp Weapon Preferences
  if (client.CWeaponType === hitman.HWeapon) score++; 

  // comp Location Preferences
  if (client.CState === hitman.HState) score++;  

  // comp Payment Preferences
  if (client.CDebtSpecification === hitman.HDebtSpecification) score++;  

  // comp Mind Game Preferences
  if (client.CTechnique === hitman.HPsychTechnique) score++; 

  // comp Timeline Preferences (only compsare the date part, not the time)
  const clientDate = new Date(client.CFinalDueDate).toISOString().split('T')[0];  // get the date part
  const hitmanDate = new Date(hitman.HTimeline).toISOString().split('T')[0];  // get the date part

  console.log("Client Date:", clientDate);
  console.log("Hitman Date:", hitmanDate);

  if (clientDate === hitmanDate) {
    score++;  // only rusn if the dates match exactly
  }

  // comp Communication Preferences
  if (client.CAnonymity === hitman.HCommunication) score++;  

  return score;
}

// HITMAN VIEWING CLIENT CODE
// endp to get matched client details for the Hitman
app.get('/view-client', (req, res) => {
  const hitmanUsername = req.session.username; // Assuming hitman is logged in and username is in the session

  // q the Hitman table to check the matched client
  db.query('SELECT HCUserID FROM Hitman WHERE HUserID = ?', [hitmanUsername], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching hitman data' });
    }

    if (results.length === 0 || !results[0].HCUserID) {
      // HCUserID is NULL --> it means no client matched
      return res.status(404).json({ error: 'No client matched with this hitman.' });
    }

    // a match is found, proceed to fetch the client's data
    const clientID = results[0].HCUserID;

    // get the client's details and targets
    db.query('SELECT * FROM Client WHERE CUserID = ?', [clientID], (err, clientResults) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching client data' });
      }

      const client = clientResults[0];
      
      // get the client's targets
      db.query('SELECT * FROM Target WHERE CUserID = ?', [clientID], (err, targetResults) => {
        if (err) {
          return res.status(500).json({ error: 'Error fetching target data' });
        }

        res.status(200).json({
          client: {
            alias: client.Alias,
            motive: client.Motive
          },
          targets: targetResults
        });
      });
    });
  });
});

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});