const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM department WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (Name_Dept LIKE :txt_search OR Name_Type LIKE :txt_search OR Content LIKE :txt_search OR Name LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
        
        res.json({
            list: list,
        });
    } catch (err) {
        logError("department.getList", err, res);
    }
}
const getOne = async (req, res) => {
    try {
      const sql = "SELECT * FROM department WHERE id = :id";
      const param = {
        id: req.body.id  // Accessing the ID from URL parameters
      };
      const [result] = await db.query(sql, param);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Blog post not found' });
      }
  
      res.json({
        message: 'Department post fetched successfully',
        data: result[0]
      });
    } catch (err) {
      logError("department.getOne", err, res);
    }
  } 
const create = async (req, res) => {
    try {
        const { Name_Dept,Name_Type} = req.body;
       
        const message = {}; // Empty object
        if (isEmptyOrNull(Name_Dept)) {
            message.Name_Dept = "Name_Dept required!";
        }
       
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return false;
        }
        const sql = "INSERT INTO department ( Name_Dept,Name_Type) VALUES ( :Name_Dept,:Name_Type)";
        const param = {
           
            Name_Dept,
            Name_Type,
          
            
        };
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "បញ្ជូលបានជោគជ័យ" : "Failed insert data",
            data: data
        });
    } catch (err) {
        logError("departmentP.create", err, res);
    }
}
const update = async (req, res) => {
    try {
        const { Id, Name_Dept,Name_Type } = req.body;
        
        const message = {}; // Empty object
        if (isEmptyOrNull(Id)) {
            message.Id = "id required!";
        }
        
       
        if (Object.keys(message).length > 0) {
            res.json({
                error: true,
                message: message
            });
            return false;
        }
        const param = {
            Id,
            Name_Dept,
            Name_Type,
            
        };
        const [dataInfo] = await db.query("SELECT * FROM department WHERE Id=:Id", { Id: Id });
        if (dataInfo.length > 0) {
            const sql = "UPDATE department SET Name_Dept=:Name_Dept, Name_Type=:Name_Type WHERE Id = :Id";
            const [data] = await db.query(sql, param);
            if (data.affectedRows) {
                if (req.file && !isEmptyOrNull(req.body.Image)) {
                    await removeFile(req.body.Image); // Remove old file
                }
            }
            res.json({
                message: (data.affectedRows != 0 ? "កែប្រែបានជោគជ័យ" : "Not found"),
                data: data
            });
        } else {
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("department.update", err, res);
    }
}

const remove = async (req, res) => {
    try {
        var sql = "DELETE FROM department WHERE Id = :Id"
        var param = {
            Id: req.body.Id
        
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: data.affectedRows != 0 ? "លុបចេញបានជោគជ័យ" : "Not found",
            data
        })
    } catch (err) {
        logError("department.remove", err, res)
    }
}

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
