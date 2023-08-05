'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class EventPubmats extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.EventReservation, {
                as: 'event_reservation_pubmat',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    EventPubmats.init(
        {
            pubmat_id: {
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
                        msg: '[reservation].[reservation_id] value must be a UUIDV4 type',
                    },
                },
            },
            pubmats_images: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue('pubmats_images').split(';')
                    const allPubmats = rawValue.map(
                        element =>
                            `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/pubmats-attachments/${element}`
                    )
                    return allPubmats
                },
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'EventPubmats',
        }
    )
    return EventPubmats
}
