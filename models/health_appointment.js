'use strict'
const { Model } = require('sequelize')
const crypto = require('crypto')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class Health_Appointment extends Model {
        static associate(models) {
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'health_appointment_assigned_to_user',
            })
            this.belongsTo(models.User, {
                foreignKey: 'attending_physician',
                as: 'health_appointment_assigned_to_physician',
            })
            this.hasMany(models.Health_Appointment_Evaluation, {
                foreignKey: 'health_appointment_id',
                as: 'health_appointment_evaluations',
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
    Health_Appointment.init(
        {
            health_appointment_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            case_control_number: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: () => {
                    // https://sequelize.org/v3/api/datatypes/
                    let token = crypto.randomBytes(64).toString('hex')
                    let year = new Date().getFullYear()
                    let month = new Date().getMonth() + 1
                    let day = new Date().getDate()
                    let random_string =
                        String(day).length == 1
                            ? token.slice(0, 3).toUpperCase()
                            : token.slice(0, 2).toUpperCase()
                    return `${year}-CM-${month}${day}${random_string}`
                },
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[health_appointments].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            attending_physician: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[health_appointments].[attending_physician] value must be a UUIDV4 type',
                    },
                },
            },
            appointment_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Guidance', 'Medical', 'Dental']],
                        msg: 'appointment_type should be Guidance, Medical, or Dental',
                    },
                },
            },
            consultation_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['New Consultation', 'Follow Up']],
                        msg: 'consultation_type should be New Consultation or Follow-up',
                    },
                },
            },
            consultation_reason: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            consultation_date: {
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
            consultation_status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Pending',
                validate: {
                    isIn: {
                        args: [
                            [
                                'Deleted',
                                'Cancelled by Staff',
                                'Cancelled by Student',
                                'Pending',
                                'Approved',
                                'Done',
                            ],
                        ],
                        msg: 'consultation_status should be Deleted, Cancelled, Pending, Approved, Declined, or Done',
                    },
                },
            },
            is_evaluated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Health_Appointment',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
    return Health_Appointment
}
