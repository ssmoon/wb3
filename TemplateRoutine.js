module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TemplateRoutine', {
    Row_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    RoutineName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    RoutineDesc: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    RoutineType: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    RoutineTag: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    createdAt: false,
    updatedAt: false,
    deletedAt: false,
    paranoid: false,
    freezeTableName: true,
  });
};
