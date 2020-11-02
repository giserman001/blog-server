module.exports = (sequelize, dataTypes) => {
  const Ip = sequelize.define('ip', {
    id: {
      type: dataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    ip: {
      type: dataTypes.TEXT,
      allowNull: false,
    },
    auth: {
      type: dataTypes.BOOLEAN,
      defaultValue: true,
      comment: '是否可用',
    },
  })
  Ip.associate = (models) => {
    // Ip.belongsTo(models.user, {
    //   foreignKey: 'userId',
    //   targetKey: 'id',
    //   constraints: false
    // })
  }
  return Ip
}
