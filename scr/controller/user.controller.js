const db = require("../config/db");
const bcrypt = require("bcrypt");
const { logError, isEmptyOrNull, getPermissionByRoleMenu } = require("../config/helper");
const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = require("../config/token_key");
const jwt = require("jsonwebtoken");

const getList = async (req, res) => {
  try {
    // Get all roles from the database
    const [role] = await db.query("SELECT id, name, code FROM role");

    // Initialize parameters and search filters
    const { txt_search } = req.query;
    let sql = "SELECT * FROM users WHERE 1=1";
    const param = {};

    if (!isEmptyOrNull(txt_search)) {
      sql += " AND (firstName LIKE :txt_search OR mobile LIKE :txt_search OR RoleId LIKE :txt_search)";
      param.txt_search = `%${txt_search}%`;
    }

    sql += " ORDER BY id DESC";

    const [list] = await db.query(sql, param);

    res.json({
      role,
      list,
    });
  } catch (err) {
    logError("users.getList", err, res);
  }
};


// const getList = async (req, res) => {
//     try {
//         // Query to get roles
//         let sql1 = "SELECT u.*, r.name AS RoleName, r.code AS RoleCode FROM users u JOIN role r ON u.RoleId = r.id WHERE u.id = ?";
//         const [role] = await db.query(sql1);

//         // Initialize search parameters
//         const { txt_search } = req.query;
//         let sql = "SELECT * FROM users WHERE 1=1";   
//         let sqlWhere = "";
//         let param = {};

//         // Check if search text is provided and not empty
//         if (!isEmptyOrNull(txt_search)) {
//             sqlWhere += " AND (firstName LIKE :txt_search OR mobile LIKE :txt_search OR RoleId LIKE :txt_search)";
//             param["txt_search"] = `%${txt_search}%`;
//         }
       
//         // Construct the final query
//         sql = sql + sqlWhere + " ORDER BY id DESC";
//         const [list] = await db.query(sql, param);
    
//         // Send the response
//         res.json({
//             role: role,
//             list: list,
//         });
//     } catch (err) {
//         logError("users.getList", err, res);
//     }
// }
const create = async (req, res) => {
    try {
        const image = req.file ? req.file.filename : null;
        const { RoleId, firstName, middleName, lastName, mobile, email, intro, profile, Password } = req.body;

        if (!image ||!RoleId || !firstName || !lastName || !mobile || !email || !Password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
         const message = {}; // Empty object
        if (isEmptyOrNull(image)) {
            message.image = "image required!";
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const sql = `INSERT INTO users (image ,RoleId, firstName, middleName, lastName, mobile, email, intro, profile, Password) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      

        const params = [image,RoleId, firstName, middleName, lastName, mobile, email, intro, profile, hashedPassword];

   

        const [data] = await db.query(sql, params);
        res.json({ message: 'User created successfully', data });
    } catch (err) {
        logError("users.create", err, res);
    }
};

const update = async (req, res) => {
  try {
    const {
      id,
      RoleId,
      firstName,
      middleName,
      lastName,
      mobile,
      email,
      password,
      intro,
      profile,
      remove_image
    } = req.body;

    // ✅ Validate required fields
    const requiredFields = { id, RoleId, firstName, lastName, mobile, email };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ message: `Missing required field: ${key}` });
      }
    }

    const fields = [];
    const params = [];

    // ✅ Handle image upload/removal
    if (req.file) {
      fields.push("image = ?");
      params.push(req.file.filename);
    } else if (remove_image === "1") {
      fields.push("image = NULL");
    }

    // ✅ Append normal fields
    const updateFields = {
      RoleId,
      firstName,
      middleName: middleName || null,
      lastName,
      mobile,
      email,
      intro: intro || null,
      profile: profile || null,
    };

    for (const [key, value] of Object.entries(updateFields)) {
      fields.push(`${key} = ?`);
      params.push(value);
    }

    // ✅ Append password if updating
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("Password = ?");
      params.push(hashedPassword);
    }

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    params.push(id);

    const [data] = await db.query(sql, params);

    return res.json({
      message: data.affectedRows !== 0 ? "Update successful" : "User not found",
      data
    });
  } catch (err) {
    logError("users.update", err, res);
  }
};


// const create = (req, res) => {
//   upload(req, res, async function (err) {
//     if (err) {
//       if (err.code === 'ENOENT') {
//         return res.status(500).json({ message: "Upload folder not found" });
//       }
//       return res.status(500).json({ message: "File upload error", error: err.message });
//     }

//     try {
//       const image = req.file ? req.file.filename : null;
//       const { RoleId, firstName, middleName, lastName, mobile, email, intro, profile, Password } = req.body;

//       if (!image || !RoleId || !firstName || !lastName || !mobile || !email || !Password) {
//         return res.status(400).json({ message: "Missing required fields" });
//       }

//       const hashedPassword = await bcrypt.hash(Password, 10);

//       const sql = `INSERT INTO users (image, RoleId, firstName, middleName, lastName, mobile, email, intro, profile, Password) 
//                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//       const params = [image, RoleId, firstName, middleName, lastName, mobile, email, intro, profile, hashedPassword];

//       const [data] = await db.query(sql, params);
//       res.json({ message: 'User created successfully', data });
//     } catch (err) {
//       logError("users.create", err, res);
//     }
//   });
// };

// const update = async (req, res) => {
//     try {
//         const {
//             id,
//             RoleId,
//             firstName,
//             middleName,
//             lastName,
//             mobile,
//             email,
//             password,
//             intro,
//             profile
//         } = req.body;

//         if (!id || !RoleId || !firstName || !lastName || !mobile || !email) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         // Get uploaded image filename if present
//         const image = req.file?.filename || null;

//         let sql = `
//             UPDATE users 
//             SET image = ?, RoleId = ?, firstName = ?, middleName = ?, lastName = ?, 
//                 mobile = ?, email = ?, intro = ?, profile = ?
//         `;

//         const params = [
//             image,
//             RoleId,
//             firstName,
//             middleName || null,
//             lastName,
//             mobile,
//             email,
//             intro || null,
//             profile || null
//         ];

//         if (password) {
//             const hashedPassword = await bcrypt.hash(password, 10);
//             sql += `, Password = ?`;
//             params.push(hashedPassword);
//         }

//         sql += ` WHERE id = ?`;
//         params.push(id);

//         const [data] = await db.query(sql, params);

//         res.json({ message: data.affectedRows !== 0 ? "Update successful" : "User not found", data });
//     } catch (err) {
//         logError("users.update", err, res);
//     }
// };



const remove = async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const sql = "DELETE FROM users WHERE id = ?";
        const params = [id];
        const [data] = await db.query(sql, params);

        res.json({ message: data.affectedRows !== 0 ? "Delete successful" : "User not found", data });
    } catch (err) {
        logError("users.remove", err, res);
    }
};

const login = async (req, res) => {
    try {
        const { Username, Password } = req.body;
        const [user] = await db.query("SELECT role.name as RoleName, users.* FROM users INNER JOIN role ON (users.RoleId = role.id) WHERE mobile = ?", [Username]);

        if (user.length === 0) {
            return res.status(401).json({ error: true, message: "User doesn't exist!" });
        }

        const isCorrectPassword = await bcrypt.compare(Password, user[0].Password);

        if (isCorrectPassword) {
            delete user[0].Password;
            const accessToken = jwt.sign({ data: user[0] }, ACCESS_TOKEN_KEY, { expiresIn: "30m" });
            const refreshToken = jwt.sign({ data: user[0] }, REFRESH_TOKEN_KEY);

            res.json({ message: "Login successful", 
                
                user: user[0],
                permission_menu: getPermissionByRoleMenu(user[0].RoleName),
                access_token: accessToken,
                refresh_token: refreshToken });
        } else {
            res.status(401).json({ message: "Incorrect Password!", error: true });
        }
    } catch (err) {
        logError("users.login", err, res);
    }
};

const refresh_token = async (req, res) => {
    try {
        const refreshToken = req.body.refresh_token;

        if (isEmptyOrNull(refreshToken)) {
            return res.status(401).json({ message: 'Unauthorized - No Refresh Token' });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_KEY, async (error, result) => {
            if (error) {
                return res.status(401).json({ message: 'Unauthorized - Invalid Refresh Token', error });
            }

            const newAccessToken = jwt.sign({ data: result.data }, ACCESS_TOKEN_KEY, { expiresIn: "10s" });
            const newRefreshToken = jwt.sign({ data: result.data }, REFRESH_TOKEN_KEY);

            res.json({ access_token: newAccessToken, refresh_token: newRefreshToken });
        });
    } catch (err) {
        logError("users.refresh_token", err, res);
    }
};

// const CheckToken = () => {
//     return (req, res, next) => {
//         const authorization = req.headers.authorization;
//         let tokenFromClient = null;

//         if (authorization) {
//             tokenFromClient = authorization.split(" ")[1];
//         }

//         if (!tokenFromClient) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }

//         jwt.verify(tokenFromClient, ACCESS_TOKEN_KEY, (error, result) => {
//             if (error) {
//                 return res.status(401).json({ message: 'Unauthorized', error });
//             }

//             req.user = result.data;
//             // req.user_id = result.data.id  // write user property 
//             next();
//         });
//     };
// };

const CheckToken = () => { // call this function in middleware
    return (req, res, next) => {
        var authorization = req.headers.authorization; // token from client
        var token_from_client = null
        if (authorization != null && authorization != "") {
            token_from_client = authorization.split(" ") // authorization : "Bearer lkjsljrl;kjsiejr;lqjl;ksjdfakljs;ljl;r"
            token_from_client = token_from_client[1] // get only access_token
        }
        if (token_from_client == null) {
            res.status(401).send({
                message: 'Unauthorized',
            });
        } else {
            jwt.verify(token_from_client, ACCESS_TOKEN_KEY, (error, result) => {
                if (error) {
                    res.status(401).send({
                        message: 'Unauthorized',
                        error: error
                    });
                } else {
                    req.user = result.data // write user property 
                    req.user_id = result.data.id  // write user property 
                    next();
                }
            })
        }
    }
}

const setPassword = async (req, res) => {
    try {
        const { mobile, Password, ConfirmPassword } = req.body;

        if (!mobile || !Password || !ConfirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (Password !== ConfirmPassword) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }

        const [user] = await db.query("SELECT * FROM users WHERE mobile = ?", [mobile]);

        if (user.length === 0) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const passHash = await bcrypt.hash(Password, 10);
        const [data] = await db.query("UPDATE users SET Password = ? WHERE mobile = ?", [passHash, mobile]);

        res.json({ message: data.affectedRows !== 0 ? "Password set successfully" : "Something went wrong" });
    } catch (err) {
        logError("users.setPassword", err, res);
    }
};

module.exports = {
    getList,
    create,
    update,
    remove,
    setPassword,
    login,
    CheckToken,
    refresh_token,
};
