const db = require("../config/db");
const bcrypt = require("bcrypt");
const { logError, isEmptyOrNull, getPermissionByRoleMenu } = require("../config/helper");
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../config/token_key");
const jwt = require("jsonwebtoken");



const getList = async (req, res) => {
    try {
        // Query to get roles
        // let sql1 = "SELECT * FROM province WHERE 1=1";
        // const [province] = await db.query(sql1);

        // Initialize search parameters
        const { txt_search } = req.query;
        let sql = "SELECT * FROM model_motor WHERE 1=1";   
        let sqlWhere = "";
        let param = {};

        // Check if search text is provided and not empty
        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (firstName LIKE :txt_search OR mobile LIKE :txt_search OR RoleId LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }
       
        // Construct the final query
        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
    
        // Send the response
        res.json({
            // province:province,
            list: list,
            
        });
    } catch (err) {
        logError("model_motor.getList", err, res);
    }
}
const create = async (req, res) => {
    try {
        const {  Name_Motor ,Color_Motor} = req.body;

        if ( !Name_Motor ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const sql = `INSERT INTO model_motor (Name_Motor,Color_Motor) 
                     VALUES (?, ? )`;

        const params = [Name_Motor,Color_Motor];

        const [data] = await db.query(sql, params);
        res.json({ message: 'Motor created successfully', data });
    } catch (err) {
        logError("model_motor.create", err, res);
    }
};

const update = async (req, res) => {
    try {
        const { Id, Name_Motor ,Color_Motor} = req.body;

        if (!Id  || !Name_Motor ) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let sql = `UPDATE model_motor SET  Name_Motor = ?,Color_Motor=?`;
        const params = [ Name_Motor,Color_Motor];

       
        sql += ` WHERE Id = ?`;
        params.push(Id);

        const [data] = await db.query(sql, params);

        res.json({ message: data.affectedRows !== 0 ? "Update successful" : "User not found", data });
    } catch (err) {
        logError("users.update", err, res);
    }
};

const remove = async (req, res) => {
    try {
        const { Id } = req.body;

        if (!Id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (isNaN(Id)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const sql = "DELETE FROM model_motor WHERE Id = ?";
        const params = [Id];
        const [data] = await db.query(sql, params);

        res.json({ message: data.affectedRows !== 0 ? "Delete successful" : "User not found", data });
    } catch (err) {
        logError("model_motor.remove", err, res);
    }
};






module.exports = {
    getList,
    create,
    update,
    remove
    
};
