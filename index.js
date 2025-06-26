const express = require("express");
const cors = require("cors");
const rateLimit = require('express-rate-limit');

const app = express();

app.use(express.json());
require('dotenv').config();

// CORS Middleware
app.use(cors({ // origin 'http://localhost:3000' has been blocked by
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "allowedHeaders": "Content-Type,Authorization" // Allowed headers
}))




// Rate limiter middleware
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 15 minutes
//   max: 2, // ⛔ Change to 5 for quick testing
//   message: '⛔ Too many requests from this IP, please try again later.',
// });


// app.use(limiter); // Apply to all routes







// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


// test route
app.get("/test", (req, res) => {
  res.send("Hello IT!!");
})

// ======= App Route Service===

const user = require("./scr/route/user.route")
const department = require("./scr/route/department.route")
const category = require("./scr/route/category.route")
const post = require("./scr/route/post.route")
const postComment = require("./scr/route/postComment.route")
const postMeta = require("./scr/route/postMeta.route")
const role = require("./scr/route/role.route")
const book = require("./scr/route/book.route")
const slideShow = require("./scr/route/slideShow.route")
const multiImage = require("./scr/route/multiImage.route")
const massage = require('./scr/route/massage.route')
const leader = require('./scr/route/leader.route')
const tbpost = require("./scr/route/tbpost.route")
const showImage = require("./scr/route/showImage.route")
const tbmarquee = require("./scr/route/tbmarquee.route")
const history = require("./scr/route/history.route");
const account = require("./scr/route/tbaccount.route");
const administration = require("./scr/route/tbadministration.route");
const technical = require("./scr/route/tbtechnical.route");
const partner = require("./scr/route/partner.route");
const training = require("./scr/route/training.route");
const manyImages = require("./scr/route/manyImages.route");
const postnew = require("./scr/route/postnew.route");
const coder = require("./scr/route/coder.router");
const posts = require("./scr/route/posts.route");
const mission = require("./scr/route/mission.route");
const servicePackage = require("./scr/route/servicePackage.route");
const visionH = require("./scr/route/visionH.route");
const valueH = require("./scr/route/valueH.route");
const doscadmin = require("./scr/route/docsadmin.route");
const person = require("./scr/route/person.route");
const departmentP = require("./scr/route/departmentP.route");
const modelMotor = require("./scr/route/modelMotor.route");
const province = require("./scr/route/province.route");
const exportExcel = require("./scr/route/exportExcel.route");


// ======= App Service===
exportExcel(app);
province(app);
modelMotor(app);
departmentP(app);
person(app);
doscadmin(app);
valueH(app);
visionH(app);
servicePackage(app);
massage(app);
leader(app);
history(app);
mission(app);
posts(app);
coder(app);
postnew(app);
manyImages(app);
training(app);
partner(app);
account(app);
administration(app);
technical(app);
tbmarquee(app);
showImage(app);
tbpost(app);
multiImage(app);
department(app);
slideShow(app);
book(app);
role(app);
user(app);
category(app);
post(app);
postComment(app);
postMeta(app);





// Start Server API

const port =9899;
app.listen(port, () => {
  console.log("http://46.250.226.231:" + port)
 
})


app.get('/hello', (req, res) => {
  res.send('✅ Hello! You are within the rate limit.');
});
