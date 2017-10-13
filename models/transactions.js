module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define("Transaction", {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    offerAccepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    BuyerViewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    SellerViewed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  });
  return Transaction;
};
