module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define("Item", {
    // Giving the Author model a name of type STRING
    item_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    item_description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    item_img1: {
      type: DataTypes.STRING,
      defaultValue: "/assets/images/placeholder.png"
    },
    item_img2: {
      type: DataTypes.STRING,
      defaultValue: "/assets/images/placeholder.png"
    },
    item_img3: {
      type: DataTypes.STRING,
      defaultValue: "/assets/images/placeholder.png"
    },
    flagged: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }

  });

  Item.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Item.belongsToMany(models.Profile, {
      as: 'TransactionsSellerItem',
      through: {model:'Transaction',unique: false},
      foreignKey: 'SellerItemId',
      otherKey: 'SellerProfileId'
    });
  };
  return Item;
};
