
const multer = require("multer");
const upload = multer(); // No storage config needed for .none()
const province_controller = require("../controller/province.controller");
const { CheckToken } = require("../controller/user.controller");

const province = (app) => {
    const uploadForm = upload.none(); // ✅ for parsing form-data

    app.get("/api/province/getList", province_controller.getList);

    app.post("/api/province/create", CheckToken(), uploadForm, province_controller.create);
    app.put("/api/province/update", CheckToken(), uploadForm, province_controller.update);

    app.delete("/api/province/delete", CheckToken(),uploadForm, province_controller.remove);
   // app.delete("/api/province/delete/:id", CheckToken(), province_controller.remove);

    

};

module.exports = province;
