// Dependencies
var express = require("express");
var path = require("path"); // access helper functions
var bodyParser = require("body-parser"); // parse body of request object
var Sequelize = require("sequelize");

// Constants
const NODE_PORT = process.env.NODE_PORT || 3000; // define server port

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

// ** Search groceries
// DeptService, SearchDBCtrl
// Retrieve department information from database via search findAll
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
        // passed via URL params
    }

    console.log("where " + where);

    Grocery
        .findOne({
            // use findOne as id is the primary key, cannot use findById as it doesn't support eager loading
            where: where,
            limit: 20

            // , include: [{
            //     model: Manager
            //     , order: [["to_date", "DESC"]]
            //     , limit: 1
            //     , include: [Employee]
            // }]
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

    Grocery
        .update({
            name: new_name,
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