const mySqlPool = require("../database/config");


// addSchool
exports.addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  // Validate input data
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if a school with the same name and address already exists
    const [existingSchool] = await mySqlPool.query(
      "SELECT * FROM schools WHERE name = ? AND address = ?",
      [name, address]
    );

    if (existingSchool.length > 0) {
      // School with the same name and address already exists
      return res
        .status(409)
        .json({ error: "A school with the same name and address already exists" });
    }

    // If no duplicate is found, insert the new school into the table
    await mySqlPool.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );

    res.status(201).json({ message: "School added successfully" });
  } catch (error) {
    console.error("Error adding school:", error);
    res.status(500).json({ error: "An error occurred while adding the school" });
  }
};



  
  

// Helper function to calculate the distance between two coordinates using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const earthRadiusKm = 6371;
  
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return earthRadiusKm * c;
  };
  
  // Controller for listing schools sorted by proximity
  exports.listSchools = async (req, res) => {
    const userLatitude = parseFloat(req.query.latitude) ;
    const userLongitude = parseFloat(req.query.longitude) ;
  
    try {
      // Fetch all schools from the database
      const [schools] = await mySqlPool.query("SELECT * FROM schools");
  
      // If coordinates are provided and valid, calculate distance and sort by proximity
      if (
        !isNaN(userLatitude) &&
        !isNaN(userLongitude) &&
        userLatitude >= -90 && userLatitude <= 90 &&
        userLongitude >= -180 && userLongitude <= 180
      ) {
        const sortedSchools = schools
          .map((school) => {
            const distance = calculateDistance(
              userLatitude,
              userLongitude,
              parseFloat(school.latitude),
              parseFloat(school.longitude)
            );
            return { ...school, distance };
          })
          .sort((a, b) => a.distance - b.distance);
  
        return res.json(sortedSchools);
      }
  
      // If no valid coordinates are provided, return all schools
      res.json(schools);
    } catch (error) {
      console.error("Error fetching schools from the database:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the list of schools." });
    }
  };
  
  


