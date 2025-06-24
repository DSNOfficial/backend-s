const documents_controller = require("../controller/doscadmin.controller");
const {upload_file} = require("../config/helper");
const { CheckToken } = require("../controller/user.controller");

const doscadmin = (app) =>{
 
    app.get("/api/documents/getList",documents_controller.getList);
    app.post("/api/documents/getone",documents_controller.getOne);
   // app.use(CheckToken());
    app.post("/api/documents/create",CheckToken(),upload_file.single("file"),documents_controller.create);
    app.put("/api/documents/update",CheckToken(),upload_file.single("File"),documents_controller.update);
    app.delete("/api/documents/delete",CheckToken(),documents_controller.remove);    
}
module.exports = doscadmin;


