// ********************************************************************************
// UPDATE ALL PREFERENCES FOR CLIENT

// Endpoint to update weapon preference for the Client
app.post('/update-weapon-preference', (req, res) => {
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
  
  // Endpoint to update location preference for the Client
  app.post('/update-location-preference', (req, res) => {
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
  
  // Endpoint to update payment preference for the Client
  app.post('/update-payment-preference', (req, res) => {
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
  
  // Endpoint to update mind game preference for the Client
  app.post('/update-mind-game-preference', (req, res) => {
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
  
  // Endpoint to update communication preference for the Client
  app.post('/update-communication-preference', (req, res) => {
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
  
  // Endpoint to update timeline preference for the Client
  app.post('/update-timeline-preference', (req, res) => {
    const { username, timelinePreference } = req.body;
  
    // Create a JavaScript Date object from the input
    const timelineDate = new Date(timelinePreference);
  
    // Ensure the date is valid
    if (isNaN(timelineDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
  
    // Convert the date to the format MySQL expects: YYYY-MM-DD HH:MM:SS
    const mysqlFormattedDate = timelineDate.toISOString().slice(0, 19).replace('T', ' ');
  
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