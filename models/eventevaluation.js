'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class EventEvaluation extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.EventReservation, {
                as: 'reservation_evaluation',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    EventEvaluation.init(
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
            evaluation_date: {
                type: DataTypes.DATE,
                allowNull: true,
                validate: {
                    isDate: {
                        msg: '[reservation_evaluations].[evaluation_date] value must be a date type',
                    },
                },
            },
            event_delivery: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },
            accomodation_of_participants: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },
            event_overall_rating: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },
            average_rating: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'EventEvaluation',
        }
    )
    return EventEvaluation
}
