'use strict'
const { Model } = require('sequelize')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class Health_Appointment_Evaluation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Health_Appointment, {
                foreignKey: 'health_appointment_id',
                as: 'health_appointment_evaluation',
            })
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'health_appointment_evaluation_user',
            })
            this.belongsTo(models.User, {
                foreignKey: 'attending_physician',
                as: 'health_appointment_evaluation_physician',
            })
        }
        toJSON() {
            const attributes = { ...this.get() }
            for (const x of PROTECTED_ATTRIBUTES) {
                delete attributes[x]
            }
            return attributes
        }
    }
    Health_Appointment_Evaluation.init(
        {
            evaluation_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            health_appointment_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[health_appointment_evaluations].[health_appointment_id] value must be a UUIDV4 type',
                    },
                },
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[health_appointment_evaluations].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            attending_physician: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[health_appointment_evaluations].[attending_physician] value must be a UUIDV4 type',
                    },
                },
            },
            evaluation_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: {
                        args: true,
                        msg: '[health_appointment_evaluations].[evaluation_date] value must be a date type',
                    },
                },
            },
            quality_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        args: true,
                        msg: '[health_appointment_evaluations].[quality_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[health_appointment_evaluations].[quality_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[health_appointment_evaluations].[quality_rating] value must be less than or equal to 5',
                    },
                },
            },
            timeliness_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        args: true,
                        msg: '[health_appointment_evaluations].[timeliness_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[health_appointment_evaluations].[timeliness_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[health_appointment_evaluations].[timeliness_rating] value must be less than or equal to 5',
                    },
                },
            },
            courtesy_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        args: true,
                        msg: '[health_appointment_evaluations].[courtesy_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[health_appointment_evaluations].[courtesy_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[health_appointment_evaluations].[courtesy_rating] value must be less than or equal to 5',
                    },
                },
            },
            average_rating: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: false,
            },
            evaluation_comment: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Health_Appointment_Evaluation',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
    return Health_Appointment_Evaluation
}
