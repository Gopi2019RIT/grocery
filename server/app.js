// Dependencies
var express = require("express");
var path = require("path"); // access helper functions
var bodyParser = require("body-parser"); // parse body of request object
var Sequelize = require("sequelize");

// Constants
const NODE_PORT = process.env.PORT || 3000; // define server port

const CLIENT_FOLDER = path.join(__dirname, '/../client');
const MSG_FOLDER = path.join(CLIENT_FOLDER, '/assets/messages'); // define paths

// MySQL configuration
const MYSQL_USERNAME = 'root';
const MYSQL_PASSWORD = 'root';

// Express instance
var app = express();

// *** MySQL connection
var sequelize = new Sequelize(
    'shop',
    MYSQL_USERNAME,
    MYSQL_PASSWORD,
    {
        host: 'localhost',         // default port    : 3306
        logging: console.log,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

// *** Models
var Grocery = require('./models/grocery')(sequelize, Sequelize);

// Middlewares
app.use(express.static(CLIENT_FOLDER)); // serve files from client folder and look for index.html
app.use(bodyParser.json());

// ROUTE HANDLERS

// ** Search groceries A-Z
app.get("/api/groceries", function (req, res) {
    Grocery
        .findAll({
            where: {
                $or: [
                    {brand: {$like: "%" + req.query.searchString + "%"}},
                    {name: {$like: "%" + req.query.searchString + "%"}}
                    // passed via non-URL params
                ],
            },
            limit: 20,
            order: [
            ['name', 'ASC']
            // ['name', 'DESC']
            ]
        })
        .then(function (groceries) {
            res
                .status(200)
                .json(groceries);
        })
        .catch(function (err) {
            res
                .status(500)
                .json(err);
        });
});

// ** searchDB via ID
// DeptService, SearchDBCtrl
// Search specific grocery by id
    // define before /api/groceries/managers if not managers route would be treated as id
app.get("/api/groceries/:id", function (req, res) {
    var where = {};
    if (req.params.id) {
        where.id = req.params.id
    }

    console.log("where " + where);

    Grocery
        .findOne({
            // use findOne as id is the primary key, cannot use findById as it doesn't support eager loading
            where: where,
            limit: 20
        })
        .then(function (groceries) {
            console.log("-- GET /api/groceries/:id findOne then() result \n " + JSON.stringify(groceries));
            res.json(groceries);
        })
        .catch(function (err) {
            console.log("-- GET /api/groceries/:id findOne catch() \n " + JSON.stringify(groceries));
            res
                .status(500)
                .json({error: true});
        });

});

// ** edit groceries
// DeptService, EditCtrl
// Edit groceries info
app.put('/api/groceries/:id', function (req, res) {

    var where = {};
    where.id = req.params.id; // passed via URL params
    var new_name = req.body.name;  // passed via body
    var new_brand = req.body.brand;
    var new_upc12 = req.body.upc12;

    Grocery
        .update({
            name: new_name,
            brand: new_brand,
            upc12: new_upc12
        },{
            where: where,
        })
        .then(function(result) {
            res.json({ success: result });
        })
        .catch(function(err) {
            res.status(500).json({ success: false });
            console.log(err);
        })
});

// IMAGE UPLOAD
// Load all required modules for uploading files
var fs = require("fs"),
    path = require("path"),
    multer = require("multer"),
    storage = multer.diskStorage({
        // Storage configuration for multer - where to save and under what name
        destination: './uploads_tmp/',
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    upload = multer({
        // Actual upload function using previously defined configuration
        storage: storage
    });

    // POST request handler for /upload route
    app.post("/upload", upload.single("img-file"), function (req, res) {
        // Use fs to read the uploaded file to verfiy success
        fs.readFile(req.file.path, function (err, data) {
            // Error handler for reading file
            if (err) {
                console.info("ERR >> " + err);
                res.status(404).json({size:0});
            }
            // Sends a HTTP 202 status code for Accepted to browser and a json containing the image file size to be displayed in the flash message
            res.status(202).json({
                size: req.file.size
            });
        });
    });

// Error handling
    // bottom of the stack below all other path handlers
app.use(function (req, res) {
    res.status(404).sendFile(path.join(MSG_FOLDER + "/404.html"));
});

app.use(function (err, req, res, next) {
    res.status(501).sendFile(path.join(MSG_FOLDER + '/501.html'));
});

// Server / Port
app.listen(NODE_PORT, function () {
    console.log("Server running at http://localhost:" + NODE_PORT);
});