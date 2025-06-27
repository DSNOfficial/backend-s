const fs = require("fs").promises;
const multer = require("multer");
const moment = require("moment");
const {config} = require("./config");

// const path = require('path'); // ✅ Required for path.join

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// const uploads = multer({ dest: 'uploads/' })


/// old code remove
// const removeFile = async (fileName) => {
//   var filePath = config.image_path

//   try {
//     await fs.unlink(filePath + fileName);
//     return 'File deleted successfully';
//   } catch (err) {
//     console.error('Error deleting file:', err);
//     throw err;
//   }
// }


const removeFile = async (fileName) => {
  if (!fileName || fileName === "null") return;

  const filePath = path.join(config.image_path, fileName);

  try {
    await fs.unlink(filePath);
   // console.log('File deleted successfully:', filePath);
  } catch (err) {
    if (err.code === 'ENOENT') {
      //console.warn('File not found, skipping delete:', filePath);
    } else {
     // console.error('Error deleting file:', err);
      throw err; // rethrow other errors
    }
  }
};

const isEmptyOrNull = (value) => {
  if (value === "" || value === null || value === undefined || value === "null" || value === "undefined") {
    return true;
  }
  return false;
}
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      // callback(null,Config.image_path)
      callback(null, config.image_path)
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      callback(null, file.fieldname + '-' + uniqueSuffix)
    }
  }),
  limits: {
    fileSize: (1024 * 1024) * 70,// 3MB,
    file: 100
  },
  fileFilter: function (req, file, callback) {
    if (file.mimetype != "image/png" && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
      // not allow 
      callback(null, false)
    } else {
      callback(null, true)
    }
  }
})


// Generate a random code
const generateCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};


const logError = async (
  controller = "user.list",
  message = "error message",
  res
) => {
  try {
    // Append the log message to the file (create the file if it doesn't exist)
    const timestamp = moment().format("YYYY-MM-DD HH:mm:ss"); // Use 'moment' for formatted timestamp
    const path = `./logs/${controller}.txt`;
    const logMessage = `[${timestamp}]  ${message}\n\n;`
    await fs.appendFile(path, logMessage);
  } catch (error) {
    console.error("Error writing to log file:", error, res);
  }
  res.status(500).send("Internal Server Error");
};


// const upload_multi= multer({ storage });

const upload_multi = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, config.image_path);
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      callback(null, file.fieldname + '-' + uniqueSuffix);
    }
  }),
  limits: {
    fileSize: (1024 * 1024) * 50, // 3 MB
    file: 10
  },
  fileFilter: function (req, file, callback) {

    if (file.mimetype != "application/pdf" && file.mimetype !== 'application/msword' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // not allow 
      callback(null, false)
    } else {
      callback(null, true)
    }

  }
    

});


const upload_file = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, config.image_path); // Change the path as needed
    },
    filename: function (req, file, callback) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      callback(null, file.fieldname + '-' + uniqueSuffix)
    }
  }),
  limits: {
    fileSize: (1024 * 1024) * 50 // 50 MB, change as needed
  },
  fileFilter: function (req, file, callback) {

    if (file.mimetype != "application/pdf" && file.mimetype !== 'application/msword' && file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // not allow 
      callback(null, false)
    } else {
      callback(null, true)
    }

  }
});

const getPermissionByRoleMenu = (RoleName) => {
  var data = {
    IT: [
      {
        route: "home"
      }, 
      
      {
        route: "user-page"
      },
       {
        route: "model"
      },
     
      {
        route: "role-page"
      },
      {
        route: "person"
      },
      {
        route: "depart"
      },
     
       {
        route: "AI"
      },
      {
        route: "province"
      },
     
    ],
    Admin: [
         {
        route: "AI"
      },
     
      {
        route: "person"
      },
       {
        route: "home"
      }, 
       {
        route: "province"
      },
        
    ],
    Director: [
         {
        route: "AI"
      },
     
       {
        route: "person"
      },
  
      {
        route: "user-page"
      },
      {
        route: "role-page"
      },
    ],

  };
  return data[RoleName];
};




module.exports = {
  logError,
  upload,
  isEmptyOrNull,
  upload_multi,
  removeFile,
  upload_file,
  getPermissionByRoleMenu,
}
