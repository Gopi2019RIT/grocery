// Model for groceries table
    // http://docs.sequelizejs.com/en/latest/docs/getting-started/#your-first-model
    // http://docs.sequelizejs.com/en/latest/docs/models-definition/

module.exports = function (sequelize, Sequelize) {
    var Grocery = sequelize.define("grocery_list",
        {
            id: {
                type: Sequelize.INTEGER(11),
                primaryKey: true,
                allowNull: false
            },
            upc12: {
                type: Sequelize.BIGINT(12),
                allowNull: false
            },
            brand: {
                type: Sequelize.STRING(225),
                allowNull: false
            },
            name: {
                type: Sequelize.STRING (225),
                allowNull: false
            }
        },
        {
            timestamps: false,
            // don't add timestamps attributes updatedAt and createdAt
            freezeTableName: true,
            tableName: "grocery_list"
         });

    return Grocery;
};