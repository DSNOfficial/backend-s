const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");
//const decode = require("decode-uri-component");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbvalue WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (Title LIKE :txt_search OR Description LIKE :txt_search OR Content LIKE :txt_search OR Name LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
        
        res.json({
            list: list,
        });
    } catch (err) {
        logError("tbvalue.getList", err, res);
    }
}

module.exports = {
    getList,
   
};
