'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Holiday extends Model {
        static associate(models) {
            // define association here
        }
    }
    Holiday.init(
        {
            holiday_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            holiday_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            holiday_description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            holiday_date: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            holiday_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Regular Holiday', 'Special Non-Working Day']],
                        msg: '[holidays].[holiday_type] value must be either "Regular Holiday" or "Special Non-Working Day"',
                    },
                },
            },
            holiday_recurrence: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            holiday_status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Active', 'Inactive', 'Deleted']],
                        msg: '[holidays].[holiday_status] value must be either "Active", "Inactive", or "Deleted"',
                    },
                },
                defaultValue: 'Active',
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Holiday',
        }
    )
    return Holiday
}
