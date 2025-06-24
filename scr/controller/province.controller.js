const db = require("../config/db");
const { logError } = require("../config/helper");
const massage = require("../route/massage.route");
const { isEmptyOrNull } = require("../config/helper");

// const getList = async (req, res) => {
//     try {
//         const [list] = await db.query("SELECT * FROM province WHERE 1=1 ORDER BY Id DESC")
//         res.json({
//             message: 'This is listing route.',
//             list,
//             userThatRequested:req.user
//         })
//     } catch (err) {
//         logError("province.getList", err, res)
//     }
// }


const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM province WHERE 1=1";
        let sqlWhere = "";
        let param = {};

        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (Name_Province LIKE :txt_search OR Other LIKE :txt_search OR Code_Province LIKE:txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }

        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
        

    
        res.json({
            list: list,
        });
    } catch (err) {
        logError("province.getList", err, res);
    }
}


const create = async (req, res) => {
    try {

        // Safely access body
        const body = req.body || {};
        const { Name_Province,Code_Province, Other } = body;

        // ValIdation
        const message = {};
        if (isEmptyOrNull(Name_Province)) {
            message.FullName = "FullName required!";
        }
          if (isEmptyOrNull(Code_Province)) {
            message.Code_Province = "Code_Province required!";
        }
     

        if (Object.keys(message).length > 0) {
            return res.status(400).json({ error: true, message });
        }

        const sql = `
            INSERT INTO province (Name_Province,Code_Province,Other)
            VALUES (?, ? , ?)
        `;

        const params = [Name_Province,Code_Province,Other];

        const [data] = await db.query(sql, params);

        res.json({
            message: 'បញ្ជូលបានជោគជ័យ',
            data
        });

    } catch (err) {
        logError("province.create", err, res);
    }
};

const update = async (req, res) => {
    try {
        var sql =`UPDATE province SET
        Name_Province = :Name_Province,Code_Province=:Code_Province,Other =:Other WHERE Id = :Id`;
        var param = {
            Id: req.body.Id,
            Name_Province: req.body.Name_Province,
            Other: req.body.Other,
            Code_Province: req.body.Code_Province
            
        }
        const [data] = await db.query(sql, param);
        res.json({
            message: (data.affectedRows != 0 ? "កែប្រែបានជោគជ័យ" : "Not found"),
            data
        })
    } catch (err) {
        logError("province.update", err, res)
    }
}

const remove = async (req, res) => {
    try {
        
        const param = {
            Id:req.body?.Id
        };
        const [dataInfo] = await db.query("SELECT * FROM province WHERE Id=:Id", param);
        console.log(req.body.Id)
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM province WHERE Id = :Id";
            const [data] = await db.query(sql, param);

            if (!req.body?.Id || isNaN(req.body.Id)) {
    return res.status(400).json({ message: "InvalId Id", error: true });
}

           
            res.json({
                message: data.affectedRows != 0 ? "លុបចេញបានជោគជ័យ" : "Not found",
                data: data
            });
        } else {
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("province.remove", err, res);
    }
};

module.exports = {
    getList,
    create,
    update,
    remove,

}