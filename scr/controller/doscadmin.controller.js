const db = require("../config/db");
const { logError } = require("../config/helper");
const { isEmptyOrNull } = require("../config/helper");
const { removeFile } = require("../config/helper");
//const decode = require("decode-uri-component");

const getList = async (req, res) => {
    try {
        const { txt_search } = req.query;
        let sql = "SELECT * FROM tbdocsadmin WHERE 1=1";
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
        logError("tbdocsadmin.getList", err, res);
    }
}

const getOne = async (req, res) => {
    try {
      const sql = "SELECT * FROM tbdocsadmin WHERE id = :id";
      const param = {
        id: req.body.id  // Accessing the ID from URL parameters
      };
      const [result] = await db.query(sql, param);
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Vision post not found' });
      }
  
      res.json({
        message: 'Vision post fetched successfully',
        data: result[0]
      });
    } catch (err) {
      logError("tbdocsadmin.getOne", err, res);
    }
  }
  

const create = async (req, res) => {
  try {
    const { title, description } = req.body;
    const message = {};

    if (isEmptyOrNull(title)) {
      message.title = "Title is required!";
    }

    if (isEmptyOrNull(description)) {
      message.description = "Description is required!";
    }

    if (Object.keys(message).length > 0) {
      return res.status(400).json({ error: true, message });
    }

    // Handle single or multiple file upload
    let file_path = null;

    // If using single file upload
    if (req.file) {
      file_path = req.file?.filename;
    }

  

    // Use `?` placeholders for mysql2
    const sql = "INSERT INTO tbdocsadmin (title, description, file_path) VALUES (?, ?, ?)";
    const [data] = await db.query(sql, [title, description, file_path]);

    return res.status(201).json({
      message: "Document created successfully",
      data
    });

  } catch (err) {
    console.error("tbdocsadmin.create error:", err);
    res.status(500).json({ error: "Internal server error" });
     logError("tbdocsadmin.create", err, res);
  }
};


const update = async (req, res) => {
    try {
        const { id, title, description, PreImage } = req.body;
        let file_path = PreImage;

        // If a new file is uploaded
        if (req.file) {
            file_path = req.file.filename;
        }

        const message = {};
        if (isEmptyOrNull(id)) message.id = "id required!";
        if (isEmptyOrNull(title)) message.title = "title required!";
        if (isEmptyOrNull(description)) message.description = "description required!";

        if (Object.keys(message).length > 0) {
            return res.status(400).json({ error: true, message });
        }

        const param = { id, title, description, file_path };

        const [dataInfo] = await db.query("SELECT * FROM tbdocsadmin WHERE id = :id", { id });
        if (!dataInfo.length) {
            return res.status(404).json({ message: "Not found", error: true });
        }

        const sql = `
            UPDATE tbdocsadmin 
            SET title = :title, description = :description, file_path = :file_path 
            WHERE id = :id
        `;
        const [data] = await db.query(sql, param);

        if (data.affectedRows) {
            if (req.file && PreImage) await removeFile(PreImage);
            res.json({ message: "Update success", data });
        } else {
            res.status(500).json({ message: "Update failed", error: true });
        }

    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Internal server error", error: true });
    }
};
// const update = async (req, res) => {
//     try {
//         console.log(req.body);
//         const { id, title, description, PreImage } = req.body;
//         let file_path = PreImage; // Default to previous pdf

      

//         if (req.file) {
//             file_path = req.file?.filename; // Use new pdf if uploaded
//         }

//         const message = {}; // Empty object for validation messages
//         if (isEmptyOrNull(id)) {
//             message.id = "id required!";
//         }
//         if (isEmptyOrNull(title)) {
//             message.title = "title required!";
//         }
//         if (isEmptyOrNull(description)) {
//             message.description = "description required!";
//         }

//         if (Object.keys(message).length > 0) {
//             res.json({
//                 error: true,
//                 message: message
//             });
//             return false;
//         }

//         const param = {
//             id,
//             title,
//             description,
//             file_path
//         };

//         const [dataInfo] = await db.query("SELECT * FROM tbdocsadmin WHERE id = :id", { id: id });
//         if (dataInfo.length > 0) {
//             const sql = "UPDATE tbdocsadmin SET title = ?, description = ?, file_path = ? WHERE id = :id";
//             const [data] = await db.query(sql, param);

//             if (data.affectedRows) {
//                 if (req.file && PreImage) {
//                     await removeFile(PreImage); // Remove old file if new file is uploaded
//                 }
//                 res.json({
//                     message: "Update success",
//                     data: data
//                 });
//             } else {
//                 res.json({
//                     message: "Update failed",
//                     error: true
//                 });
//             }
//         } else {
//             res.json({
//                 message: "Not found",
//                 error: true
//             });
//         }
//     } catch (err) {
//         logError("tbdocsadmin.update", err, res);
//     }
// };


// const update = async (req, res) => {
//     try {
//         const { id, title, description, PreImage } = req.body;
//         let file_path = PreImage;

//         if (req.file) {
//             file_path = req.file.filename;
//         }

//         const message = {};
//         if (isEmptyOrNull(id)) message.id = "id required!";
//         if (isEmptyOrNull(title)) message.title = "title required!";
//         if (isEmptyOrNull(description)) message.description = "description required!";

//         if (Object.keys(message).length > 0) {
//             return res.status(400).json({ error: true, message });
//         }

//         const param = { id, title, description, file_path };

//         const [dataInfo] = await db.query("SELECT * FROM tbdocsadmin WHERE id = :id", { id });
//         if (!dataInfo.length) {
//             return res.status(404).json({ message: "Not found", error: true });
//         }

//         const sql = `
//             UPDATE tbdocsadmin 
//             SET title = :title, description = :description, file_path = :file_path 
//             WHERE id = :id
//         `;
//         const [data] = await db.query(sql, param);

//         if (data.affectedRows) {
//             if (req.file && PreImage) await removeFile(PreImage);
//             res.json({ message: "Update success", data });
//         } else {
//             res.status(500).json({ message: "Update failed", error: true });
//         }
//     } catch (err) {
//         logError("tbdocsadmin.update", err, res);
//     }
// };

const remove = async (req, res) => {
    try {
        const { id } = req.body;
        const param = { id };

        const [dataInfo] = await db.query("SELECT * FROM tbdocsadmin WHERE id = :id", param);

        if (dataInfo.length > 0) {
            const filePath = dataInfo[0].file_path; // Assuming file path is stored in file_path column

            const sql = "DELETE FROM tbdocsadmin WHERE id = :id";
            const [data] = await db.query(sql, param);

            if (data.affectedRows) {
                if (filePath) {
                    try {
                        await removeFile(filePath); // Remove the file
                    } catch (fileErr) {
                        logError("tbdoscadmin.removeFile", fileErr, res); // Log file removal error
                    }
                }

                res.json({
                    message: "Remove success",
                    data: data
                });
            } else {
                res.json({
                    message: "Remove failed",
                    error: true
                });
            }
        } else {
            res.json({
                message: "Not found",
                error: true
            });
        }
    } catch (err) {
        logError("tbdocsadmin.remove", err, res);
    }
}

// const remove = async (req, res) => {
//     try {
//         const { id } = req.body;
//         const param = { id };

//         const [dataInfo] = await db.query("SELECT * FROM tbdoscadmin WHERE id = :id", param);

//         if (dataInfo.length > 0) {
//             const filePath = dataInfo[0].file_path; // Assuming file path is stored in file_path column

//             const sql = "DELETE FROM tbdoscadmin WHERE id = :id";
//             const [data] = await db.query(sql, param);

//             if (data.affectedRows) {
//                 if (filePath) {
//                     try {
//                         await removeFile(filePath); // Remove the file
//                     } catch (fileErr) {
//                         logError("tbdoscadmin.removeFile", fileErr, res); // Log file removal error
//                     }
//                 }

//                 res.json({
//                     message: "Remove success",
//                     data: data
//                 });
//             } else {
//                 res.json({
//                     message: "Remove failed",
//                     error: true
//                 });
//             }
//         } else {
//             res.json({
//                 message: "Not found",
//                 error: true
//             });
//         }
//     } catch (err) {
//         logError("tbdoscadmin.remove", err, res);
//     }
// };

module.exports = {
    getList,
    getOne,
    create,
    update,
    remove
};
