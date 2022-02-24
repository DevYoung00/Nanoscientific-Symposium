const { europeConnection } = require("../dbConfig");
const path = require("path");
const hasher = require("wordpress-hash-node");

const europeCtrl = {
  
  saveTransaction: async (req, res) => {
    const { id, userId } = req.body;

    const sql = `INSERT INTO transaction(id,user_id) VALUES('${id}',${userId})`;

    europeConnection.query(sql, (error, rows) => {
      if (error) throw error;
      res.status(200).json({
        success: true,
        message: "Success",
      });
    });
  },
  deleteTransaction: async (req, res) => {
    const { id } = req.body;
    const sql = `DELETE FROM transaction WHERE id='${id}'`;
    europeConnection.query(sql, (error, rows) => {
      if (error) throw error;
      res.status(200).json({
        success: true,
        message: "Success",
      });
    });
  },
  register: async (req, res) => {
    const {
      email,
      title,
      university,
      institute,
      street,
      zipCode,
      city,
      researchField,
      afmTool,
      nanoMechanical,
      characterizationOfSoft,
      advancedImaging,
      highResolutionImaging,
      automationInAfm,
      lastName,
      firstName,
      psOptIn,
    } = req.body;

    // const connection = await europePool.getConnection(async (conn) => conn);
    const sql = `INSERT INTO user(email,password,title,university,institute,street,zipCode,city,research_field,afm_tool,nanomechanical,characterization_of_soft,advanced_imaging,high_resolution_imaging,automation_in_afm,last_name,first_name,ps_opt_in)
 VALUES('${email}','${hasher.HashPassword(
      null
    )}','${title}','${university}','${institute}','${street}','${zipCode}','${city}','${researchField}','${afmTool}',${nanoMechanical},${characterizationOfSoft},${advancedImaging},${highResolutionImaging},${automationInAfm},'${lastName}','${firstName}',${psOptIn})`;
    europeConnection.query(sql, (error, rows) => {
      if (error) throw error;
      console.log(rows);
      res.status(200).json({
        success: true,
        id: rows.insertId,
        message: "Success",
      });
    });
  },
};

module.exports = europeCtrl;
