module.exports = function(sequelize, DataTypes) {
  var Flag = sequelize.define("Flag", {
    // Giving the Author model a name of type STRING


  });


  Flag.associate = function(models) {

    Flag.belongsTo(models.Item, {
        foreignKey: {
        allowNull: false
      },
    });
  };
  return Flag;
};
