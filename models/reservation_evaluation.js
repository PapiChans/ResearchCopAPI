'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reservation_Evaluation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Reservation, {
                as: 'reservation_evaluations',
                foreignKey: 'reservation_id',
            })
      this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'evrsers_evaluation_user',
            })
    }
  }
  Reservation_Evaluation.init(
  {
            evaluation_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            reservation_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[reservation_evaluations].[reservation_id] value must be a UUIDV4 type',
                    },
                },
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[reservation_evaluations].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            evaluation_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: {
                        msg: '[reservation_evaluations].[evaluation_date] value must be a date type',
                    },
                },
            },
            quality_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: '[reservation_evaluations].[quality_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[reservation_evaluations].[quality_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[reservation_evaluations].[quality_rating] value must be less than or equal to 5',
                    },
                },
            },
            timeliness_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: '[reservation_evaluations].[timeliness_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[reservation_evaluations].[timeliness_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[reservation_evaluations].[timeliness_rating] value must be less than or equal to 5',
                    },
                },
            },
            courtesy_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: '[reservation_evaluations].[courtesy_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[reservation_evaluations].[courtesy_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[reservation_evaluations].[courtesy_rating] value must be less than or equal to 5',
                    },
                },
            },
            average_rating: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: false,
            },
            evaluation_comment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
  }, 
  {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'Reservation_Evaluation',
  });
  return Reservation_Evaluation;
};