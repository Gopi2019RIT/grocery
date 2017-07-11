// Model for employees table
module.exports = function(conn, Sequelize) {
    var Employees=  conn.define('employees', {
        emp_no: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        birth_date: {
            type: Sequelize.DATE,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        gender: {
            type: Sequelize.ENUM('M','F'),
            allowNull: false
        },
        hire_date: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }, {
        tableName: 'employees',
        timestamps: false
    });
    return Employees;
};