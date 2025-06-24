const massage_controller = require("../controller/massage.controller");
const { CheckToken } = require("../controller/user.controller");
const massage = (app) =>{
      
  

    //middleware check Token
    app.get("/api/massage/getList",massage_controller.getList);
    app.post("/api/massage/create",massage_controller.create);

    app.put("/api/massage/update",CheckToken(),massage_controller.update);
    app.delete("/api/massage/delete",CheckToken(),massage_controller.remove); 
     
}
module.exports = massage;


