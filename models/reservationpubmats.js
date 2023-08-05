'use strict'
const { Model } = require('sequelize')
const dotenv = require('dotenv')
const crypto = require('crypto')
module.exports = (sequelize, DataTypes) => {
    class ReservationPubmats extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.Reservation, {
                as: 'reservation_assigned_to_pubmat',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    ReservationPubmats.init(
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
            modelName: 'ReservationPubmats',
        }
    )
    return ReservationPubmats
}
