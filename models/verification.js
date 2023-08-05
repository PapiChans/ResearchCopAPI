'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Verification extends Model {
        static associate(models) {}
    }
    Verification.init(
        {
            verification_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            verification_number: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: () => {
                    // Generate a random 6-digit number
                    const randomNumber = Math.floor(100000 + Math.random() * 900000)
                    return randomNumber.toString()
                },
            },
            expiration_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: () => {
                    const currentTime = new Date()
                    const expirationTime = new Date(currentTime.getTime() + 30 * 60000) // 30 minutes in milliseconds
                    return expirationTime
                },
            },
            is_expired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Verification',
        }
    )
    return Verification
}
