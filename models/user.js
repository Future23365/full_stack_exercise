'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.User.hasMany(models.Course, { as: 'courses' })
      models.User.belongsToMany(models.Course, { through: models.Like, foreignKey: 'userId', as: 'likeCourses' })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: '邮箱必须填写' },
        notEmpty: { msg: '邮箱不能为空' },
        isEmail: { msg: '必须是邮箱格式' },
        async isUnique(value) {
          const user = await User.findOne({ where: { email: value } })
          if (user) {
            throw new Error('邮箱已经存在')
          }
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '用户名必须存在'
        },
        notEmpty: {
          msg: '用户名不能为空'
        },
        len: {
          args: [2, 45],
          msg: '用户名长度在2~45个字符之间'
        },
        async isUnique(value) {
          const user = await User.findOne({ where: { username: value } })
          if (user) {
            throw new Error('用户名已经存在')
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '密码必须存在'
        },
        notEmpty: {
          msg: '密码不能为空'
        }
      },
      set(value) {
        if (typeof value === 'string') {
          if (value.length >= 6 && value.length <= 45) {
            this.setDataValue('password', bcrypt.hashSync(value, 10))
          } else {
            throw new Error('密码长度必须是6~45之间')
          }
        }
      }
    },
    nickname: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [2, 45],
          msg: '昵称长度在2~45个字符之间'
        }
      }
    },
    sex: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '性别必须填写' },
        notEmpty: { msg: '性别不能为空' },
        isIn: { args: [[0, 1, 2]], msg: '性别必须是男：0，女：1，未选择 9' }
      }
    },
    company: DataTypes.STRING,
    introduce: DataTypes.TEXT,
    role: {
      type: DataTypes.TINYINT,
      allowNull: false,
      validate: {
        notNull: { msg: '用户组必须填写' },
        notEmpty: { msg: '用户组不能为空' },
        isIn: { args: [[0, 100]], msg: '用户组必须是：普通用户：0，管理员：100' }
      }
    },
    avatar: {
      type: DataTypes.STRING,
      validate: {
        isUrl: { msg: '图片地址不正确' }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};