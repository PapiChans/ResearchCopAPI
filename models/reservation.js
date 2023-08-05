'use strict'
const { Model } = require('sequelize')
const dotenv = require('dotenv')
const crypto = require('crypto')
module.exports = (sequelize, DataTypes) => {
    class Reservation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Facilities, {
                as: 'facilities_assigned_to_reservation',
                foreignKey: 'facility_id',
                onDelete: 'RESTRICT',
            })

            this.belongsTo(models.User, {
                as: 'user_assigned_to_reservation',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.belongsTo(models.Organization, {
                as: 'organization_assigned_to_reservations',
                foreignKey: 'organization_id',
                onDelete: 'RESTRICT',
            })

            this.hasOne(models.ReservationPubmats, {
                as: 'ReservationPubmats',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Reservation_Signatory, {
                as: 'reservation_signatories',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.Reservation_Evaluation, {
                as: 'reservation_evaluations',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    Reservation.init(
        {
            reservation_id: {
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
            organization_id: {
                type: DataTypes.STRING(255),
                allowNull: true,
                type: DataTypes.UUID,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[organizations].[organization_id] value must be a UUIDV4 type',
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
                    return `RES-${month}${day}${random_string}`
                },
            },
            event_title: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            event_details: {
                type: DataTypes.STRING(255),
                allowNull: false,
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
                                'For Evaluation / Processing',
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
            event_request: {
                type: DataTypes.STRING(255),
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue('event_request')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/reservation-attachments/${rawValue}`
                        : null
                },
            },
            concept_paper: {
                type: DataTypes.STRING(255),
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue('concept_paper')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/reservation-attachments/${rawValue}`
                        : null
                },
            },
            others: {
                type: DataTypes.STRING(255),
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('others')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/reservation-attachments/${rawValue}`
                        : null
                },
            },
            pup_pillars: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            pup_objectives: {
                type: DataTypes.TEXT,
                allowNull: false,
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
            modelName: 'Reservation',
        }
    )
    return Reservation
}
