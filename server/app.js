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

// MySQL connection
var sequelize = new Sequelize(
    'employees',
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

// Models
var Department = require('./models/department')(sequelize, Sequelize);
var Employee = require('./models/employee')(sequelize, Sequelize);
var Manager = require('./models/deptmanager')(sequelize, Sequelize);

// Associations
Department.hasMany(Manager, {foreignKey: 'dept_no'});
Manager.hasOne(Employee, {foreignKey: 'emp_no'}); // manager is also an employee

// Middlewares
app.use(express.static(CLIENT_FOLDER)); // serve files from client folder and look for index.html
app.use(bodyParser.json());

// ROUTE HANDLERS

// ** Search groceries
// DeptService, SearchDBCtrl
// Retrieve department information from database via search findAll
app.get("/api/departments", function (req, res) {
    Department
        .findAll({
            where: {
                $or: [
                    {dept_name: {$like: "%" + req.query.searchString + "%"}},
                    {dept_no: {$like: "%" + req.query.searchString + "%"}}
                    // passed via non-URL params
                ]
            }
        })
        .then(function (departments) {
            res
                .status(200)
                .json(departments);
        })
        .catch(function (err) {
            res
                .status(500)
                .json(err);
        });
});

// ** searchDB via ID
// DeptService, SearchDBCtrl
// Search specific department by dept_no
    // define before /api/departments/managers if not managers route would be treated as dept_no
app.get("/api/departments/:dept_no", function (req, res) {
    var where = {};
    if (req.params.dept_no) {
        where.dept_no = req.params.dept_no
        // passed via URL params
    }

    console.log("where " + where);

    Department
        .findOne({
            // use findOne as dept_no is the primary key, cannot use findById as it doesn't support eager loading
            where: where
            , include: [{
                model: Manager
                , order: [["to_date", "DESC"]]
                , limit: 1
                , include: [Employee]
            }]
        })
        .then(function (departments) {
            console.log("-- GET /api/departments/:dept_no findOne then() result \n " + JSON.stringify(departments));
            res.json(departments);
        })
        .catch(function (err) {
            console.log("-- GET /api/departments/:dept_no findOne catch() \n " + JSON.stringify(departments));
            res
                .status(500)
                .json({error: true});
        });

});

// ** edit groceries
// DeptService, EditCtrl
// Edit department info
app.put('/api/departments/:dept_no', function (req, res) {

    var where = {};
    where.dept_no = req.params.dept_no; // passed via URL params
    var new_dept_name = req.body.dept_name;  // passed via body

    Department
        .update({
            dept_name: new_dept_name,
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