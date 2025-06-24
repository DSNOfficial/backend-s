
const multer = require("multer");
const upload = multer(); // No storage config needed for .none()
const departmentP_controller = require("../controller/departmentP.controller");
const { CheckToken } = require("../controller/user.controller");

const departmentP = (app) => {
    const uploadForm = upload.none(); // ✅ for parsing form-data

    app.get("/api/departmentP/getList", departmentP_controller.getList);

    app.post("/api/departmentP/create", CheckToken(), uploadForm, departmentP_controller.create);
    app.put("/api/departmentP/update", CheckToken(), uploadForm, departmentP_controller.update);

    app.delete("/api/departmentP/delete", CheckToken(),uploadForm, departmentP_controller.remove);
  

    

};

module.exports = departmentP;

