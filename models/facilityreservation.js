'use strict'
const { Model } = require('sequelize')
const crypto = require('crypto')
module.exports = (sequelize, DataTypes) => {
    class FacilityReservation extends Model {
        static associate(models) {
            this.belongsTo(models.Facilities, {
                as: 'facilities_assigned_to_facility_reservation',
                foreignKey: 'facility_id',
                onDelete: 'RESTRICT',
            })

            this.belongsTo(models.User, {
                as: 'user_assigned_to_facility_reservation',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    FacilityReservation.init(
        {
            facility_reservation_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            facility_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[facilities].[facility_id] value must be a UUIDV4 type',
                    },
                },
            },
            organization_id: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[organizations].[organization_id] value must be a UUIDV4 type',
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
            reservation_number: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: () => {
                    // https://sequelize.org/v3/api/datatypes/
                    let token = crypto.randomBytes(64).toString('hex')
                    let month = new Date().getMonth() + 1
                    let day = new Date().getDate()
                    let random_string =
                        String(day).length == 1
                            ? token.slice(0, 3).toUpperCase()
                            : token.slice(0, 2).toUpperCase()
                    return `FACI-RES-${month}${day}${random_string}`
                },
            },
            reserve_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    notNull: { msg: '[Reservation].[reserve_date] cannot be null!' },
                    notEmpty: {
                        msg: '[Reservation].[reserve_date] cannot be blank or empty!',
                    },
                    isDate: {
                        msg: '[Reservation].[reserve_date] value must be a date type',
                    },
                },
            },
            time_from: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            time_to: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            reserve_status: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: 'For Review',
                validate: {
                    isIn: {
                        args: [
                            [
                                'For Review',
                                'Approved & Released',
                                'Done',
                                'Deleted',
                                'For Revision',
                                'Cancelled by Staff',
                                'Cancelled by Student',
                            ],
                        ],
                        msg: 'reserve_status should be For Review, For Evaluation / Processing, Approved & Released, Done, Deleted, For Revision, Cancelled by Staff, Cancelled by Student',
                    },
                },
            },
            number_of_participants: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    isInt: {
                        msg: '[Reservation].[number_of_participants] value must be an integer type',
                    },
                },
            },
            purpose: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            is_evaluated: {
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
            modelName: 'FacilityReservation',
        }
    )
    return FacilityReservation
}
