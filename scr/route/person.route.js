const multer = require("multer");
const upload = multer(); // No storage config needed for .none()
const person_controller = require("../controller/person.controller");
const { CheckToken } = require("../controller/user.controller");

const person = (app) => {
    const uploadForm = upload.none(); // ✅ for parsing form-data

    app.get("/api/person/getList", person_controller.getList);

    app.get("/api/person/count", person_controller.getPersonCount); // ✅ count API

    app.post("/api/person/create", CheckToken(), uploadForm, person_controller.create);
    app.put("/api/person/update", CheckToken(), uploadForm, person_controller.update);
    app.delete("/api/person/delete", CheckToken(), uploadForm, person_controller.remove);
};

module.exports = person;
