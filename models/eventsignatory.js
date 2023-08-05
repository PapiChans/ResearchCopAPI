'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class EventSignatory extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'user_assigned_to_event_reservation_signatory',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.belongsTo(models.EventReservation, {
                as: 'event_reservation_signatory',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    EventSignatory.init(
        {
            reservation_signatory_id: {
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
                        msg: '[event_reservations].[reservation_id] value must be a UUIDV4 type',
                    },
                },
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[users].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            is_signed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_onhold: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            hierarchy_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'EventSignatory',
        }
    )
    return EventSignatory
}
