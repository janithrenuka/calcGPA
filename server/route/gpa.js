const router = require("express").Router();
const { response } = require("express");
const pool = require("../db");

router.post("/add", async (req, res) => {
    try {

      const { subject_code, year, semester, credit, grade } = req.body;
  
      const row = await pool.query("SELECT * FROM gpa_data WHERE subject_code = $1", [
        subject_code,
      ]);
  
      if (row.rows.length !== 0) {
        return res.status(401).send("Subject already exists");
      }
  
      const newSubject = await pool.query(
        "INSERT INTO gpa_data (subject_code, year, semester, credit, grade) VALUES ( $1, $2, $3, $4, $5) RETURNING *",
        [subject_code, year, semester, credit, grade]
      );
  
      if(newSubject) {
        res.json("Result Added");
      }
  
       
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});


router.get("/", async (req, res) => {
    try {
      
      const data = await pool.query(
        "SELECT * FROM gpa_data ORDER BY id ASC, year ASC, semester ASC;"
      ); 
      
      if (data.rows.length === 0) {
        return res.status(401).json("No any data in the database.");
      }
  
      res.json(data.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });

module.exports = router;