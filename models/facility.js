'use strict'
const { Model } = require('sequelize')
const dotenv = require('dotenv')
module.exports = (sequelize, DataTypes) => {
    class Facilities extends Model {
        static associate(models) {
            //  this.hasMany(models.Reservation, {
            //      as: 'facilities_assigned_to_reservations',
            //      foreignKey: 'facility_id',
            //      onDelete: 'RESTRICT',
            //  })
            this.hasMany(models.FacilityReservation, {
                as: 'facilities_assigned_to_facility_reservations',
                foreignKey: 'facility_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    Facilities.init(
        {
            facility_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            facility_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            facility_description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            facility_picture: {
                type: DataTypes.STRING(255),
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue('facility_picture')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/facility-attachments/${rawValue}`
                        : null
                },
            },
            facility_status: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: 'Available',
                validate: {
                    isIn: {
                        args: [['Available', 'Unavailable', 'Deleted']],
                        msg: 'facility_status should be Available, Unavailable or Deleted',
                    },
                },
            },
            facility_capacity: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Facilities',
        }
    )
    return Facilities
}
