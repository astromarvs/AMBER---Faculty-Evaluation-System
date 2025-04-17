const { poolPromise } = require("../config/db");

const getSchools = async (req, res) => {
    try {
        const pool = await poolPromise;
        
        // Try with schema qualification first
        const query = `SELECT * FROM School`;
        const result = await pool.query(query);

        if (result.length === 0) {
            return res.status(404).json({ error: "No schools found" });
        }

        res.json(result);
    } catch (error) {
        console.error("Get School Error:", error);
        
        // More specific error messages
        if (error.code === 208) {
            return res.status(404).json({ 
                error: "School table not found",
                details: "The database doesn't contain a table named 'School'"
            });
        }
        
        return res.status(500).json({ 
            error: "Failed to retrieve schools",
            details: error.message 
        });
    }
};

module.exports = {
    getSchools
}