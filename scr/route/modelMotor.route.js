const multer = require("multer");
const upload = multer(); // No storage config needed for .none()
const modelMotor_controller = require("../controller/modelMotor.controller");
const { CheckToken } = require("../controller/user.controller");

const Motor = (app) => {
    const uploadForm = upload.none(); // ✅ for parsing form-data

    app.get("/api/Motor/getList", modelMotor_controller.getList);
    app.post("/api/Motor/create", CheckToken(), uploadForm, modelMotor_controller.create);
    app.put("/api/Motor/update", CheckToken(), uploadForm, modelMotor_controller.update);
    app.delete("/api/Motor/delete", CheckToken(),uploadForm, modelMotor_controller.remove);
   

};

module.exports = Motor;

