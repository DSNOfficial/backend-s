const db = require("../config/db");
const { logError } = require("../config/helper");
const massage = require("../route/massage.route");
const { isEmptyOrNull } = require("../config/helper");


const getPersonCount = async (req, res) => {
    try {
        const sql = "SELECT COUNT(Code_Number) AS count FROM person WHERE Code_Number IS NOT NULL";
        const [rows] = await db.query(sql);
        const count = rows[0]?.count || 0;

        res.json({ count }); // ✅ Correct format
    } catch (err) {
        logError("person.getPersonCount", err, res);
    }
};


const getList = async (req, res) => {
    try {
        // Query to get roles
    
        

        
        let sql1 = "SELECT * FROM model_motor WHERE 1=1";
        const [model_motor] = await db.query(sql1);
       

        
         let sql3 = "SELECT * FROM province WHERE 1=1";
        const [province] = await db.query(sql3);

         let sql4 = "SELECT * FROM users WHERE 1=1";
        const [users] = await db.query(sql4);
         
         //let sql2 = "SELECT Name_Type FROM department WHERE 1=1";

        ///let sql2 = "SELECT Name_Type FROM department WHERE 1=1";
         let sql2 = "SELECT * FROM department WHERE 1=1";
        const [department] = await db.query(sql2);

        // Initialize search parameters
        const { txt_search } = req.query;
        let sql = "SELECT * FROM person WHERE 1=1";   
        let sqlWhere = "";
        let param = {};

        // Check if search text is provided and not empty
        if (!isEmptyOrNull(txt_search)) {
            sqlWhere += " AND (FullName LIKE :txt_search OR Motor_Number LIKE :txt_search OR Code_Number LIKE :txt_search OR Code_Number LIKE :txt_search OR Gender LIKE :txt_search)";
            param["txt_search"] = `%${txt_search}%`;
        }
       
        // Construct the final query
        sql = sql + sqlWhere + " ORDER BY id DESC";
        const [list] = await db.query(sql, param);
    
        // Send the response
        res.json({

            department:department,
            model_motor:model_motor,
            province:province,
            users:users,
            list: list,
            
        });
    } catch (err) {
        logError("person.getList", err, res);
    }
};

const create = async (req, res) => {
    try {

        // Safely access body
        const body = req.body || {};
        const { ProvinceId,ModelId,DepartmentId, FullName, Phone, Gender,Id_Card,Motor_Number,Color_Motor_Person,Code_Number,Other, CreateBy } = body;   
        // ValIdation
        const message = {};
        if (isEmptyOrNull(FullName)) {
            message.FullName = "FullName required!";
        }
           if (isEmptyOrNull(Id_Card)) {
            message.Id_Card = "Id_Card required!";
        }
        if (isEmptyOrNull(Motor_Number)) {
            message.Motor_Number = "Motor_Number required!";
        }    
           
         if (isEmptyOrNull(ModelId)) {
            message.ModelId = "ModelId required!";
        }
         if (isEmptyOrNull(DepartmentId)) {
            message.DepartmentId = "DepartmentId required!";
        }
        if (isEmptyOrNull(Phone)) {
            message.Phone = "Phone required!";
        }
        if (isEmptyOrNull(Gender)) {
            message.Gender = "Gender required!";
        }
        if (isEmptyOrNull(CreateBy)) {
            message.CreateBy = "CreateBy required!";
        }

        if (Object.keys(message).length > 0) {
            return res.status(400).json({ error: true, message });
        }

     const sql = `
    INSERT INTO person (
        
        ProvinceId,
        DepartmentId,
        FullName,
        Phone,
        Gender,
        Id_Card,
        Motor_Number,
        Color_Motor_Person,    
        Code_Number,
        Other,
        ModelId,
        CreateBy
    )
    VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

        const params = [ProvinceId,DepartmentId,FullName,Phone,Gender,Id_Card,Motor_Number,Color_Motor_Person,Code_Number,Other,ModelId,CreateBy];

        const [data] = await db.query(sql, params);

        res.json({
            message: 'បញ្ជូលបានជោគជ័យ',
            data
        });

    } catch (err) {
        logError("person.create", err, res);
    }
};

const update = async (req, res) => {
    try {
        const {
            Id,
            ProvinceId,
            DepartmentId,
            FullName,
            Phone,
            Gender,
            Id_Card,
            Motor_Number,
            Color_Motor_Person,
            Code_Number,
            Other,
            ModelId,
            CreateBy
        } = req.body;

        // Basic validation
        const message = {};
        if (isEmptyOrNull(Id)) message.Id = "Id is required!";
        if (isEmptyOrNull(ProvinceId)) message.ProvinceId = "ProvinceId is required!";
        if (isEmptyOrNull(DepartmentId)) message.DepartmentId = "DepartmentId is required!";
        if (isEmptyOrNull(FullName)) message.FullName = "FullName is required!";
        if (isEmptyOrNull(Phone)) message.Phone = "Phone is required!";
        if (isEmptyOrNull(Gender)) message.Gender = "Gender is required!";
        if (isEmptyOrNull(Id_Card)) message.Id_Card = "Id_Card is required!";
        if (isEmptyOrNull(Motor_Number)) message.Motor_Number = "Motor_Number is required!";
        if (isEmptyOrNull(Color_Motor_Person)) message.Color_Motor_Person = "Color_Motor_Person is required!";
        if (isEmptyOrNull(Code_Number)) message.Code_Number = "Code_Number is required!";
        if (isEmptyOrNull(ModelId)) message.ModelId = "ModelId is required!";
        if (isEmptyOrNull(CreateBy)) message.CreateBy = "CreateBy is required!";

        if (Object.keys(message).length > 0) {
            return res.status(400).json({ error: true, message });
        }

        // SQL update
        const sql = `
            UPDATE person SET
                ProvinceId = ?, 
                DepartmentId = ?, 
                FullName = ?, 
                Phone = ?, 
                Gender = ?, 
                Id_Card = ?, 
                Motor_Number = ?, 
                Color_Motor_Person = ?, 
                Code_Number = ?, 
                Other = ?, 
                ModelId = ?, 
                CreateBy = ?
            WHERE id = ?
        `;

        const params = [
            ProvinceId,
            DepartmentId,
            FullName,
            Phone,
            Gender,
            Id_Card,
            Motor_Number,
            Color_Motor_Person,
            Code_Number,
            Other,
            ModelId,
            CreateBy,
            Id
        ];

        const [data] = await db.query(sql, params);

        res.json({
            message: data.affectedRows !== 0 ? "បញ្ជូលបានជោគជ័យ" : "បរាជ័យ សូមព្យាយាមម្តងទៀត!",
            data
        });

    } catch (err) {
        logError("person.update", err, res);
    }
};

const remove = async (req, res) => {
    try {
        
        const param = {
            Id:req.body?.Id
        };
        const [dataInfo] = await db.query("SELECT * FROM person WHERE Id=:Id", param);
        console.log(req.body.Id)
        if (dataInfo.length > 0) {
            const sql = "DELETE FROM person WHERE Id = :Id";
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
        logError("person.remove", err, res);
    }
};

module.exports = {
    getList,
    create,
    update,
    remove,
    getPersonCount

}