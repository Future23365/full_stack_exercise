'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment')
moment.locale('zh-cn')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Course.belongsTo(models.Category, { as: 'category' })
      models.Course.belongsTo(models.User, { as: 'user' })
      models.Course.hasMany(models.Chapter, { as: 'chapters' })
      models.Course.belongsToMany(models.User, { through: models.Like, foreignKey: 'courseId', as: 'likeUsers' })
    }
  }
  Course.init({
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '分类id必须填写' },
        notEmpty: { msg: '分类id不能为空' },
        async isPresent(value) {
          const category = await sequelize.models.Category.findByPk(value)
          if (!category) {
            throw new Error(`ID为：${value}的分类不存在`)
          }
        }
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '用户id必须填写' },
        notEmpty: { msg: '用户id不能为空' },
        async isPresent(value) {
          const category = await sequelize.models.User.findByPk(value)
          if (!category) {
            throw new Error(`ID为：${value}的用户不存在`)
          }
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '名字必须填写' },
        notEmpty: { msg: '名字不能为空' },
      }
    },
    image: DataTypes.STRING,
    recommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: { msg: 'recommended必须填写' },
        notEmpty: { msg: 'recommended不能为空' },
      }
    },
    introductory: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: { msg: 'introductory必须填写' },
        notEmpty: { msg: 'introductory不能为空' },
      }
    },
    content: DataTypes.TEXT,
    likesCount: DataTypes.INTEGER,
    chaptersCount: DataTypes.INTEGER,
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createAt')).format('LL')
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createAt')).format('LL')
      }
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};