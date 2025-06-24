
const exportExcel_controller = require("../controller/exportExcel.controller");
const { CheckToken } = require("../controller/user.controller");
const exportExcel = (app) =>{
    app.get("/api/exportExcel/getList",CheckToken(),exportExcel_controller.getList);
    
}
module.exports = exportExcel;
