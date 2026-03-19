'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment/moment')
moment.locale('zh-cn')
module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Chapter.belongsTo(models.Course, { as: 'course' })
    }
  }
  Chapter.init({
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: '必须填写课程id' },
        notEmpty: { msg: 'id不能为空' },
        async isPressent(value) {
          const course = await sequelize.model.Course.findByPk(value)
          if (!course) {
            throw new Error(`id为${value}的课程不存在`)
          }
        }
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '必须填写title' },
        notEmpty: { msg: 'title不能为空' },
        len: {
          args: [2, 45],
          msg: '标题长度在2~45个字符之间'
        }
      }
    },
    content: {
      type: DataTypes.TEXT
    },
    video: DataTypes.STRING,
    rank: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
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
    modelName: 'Chapter',
  });
  return Chapter;
};