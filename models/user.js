'use strict'
const { Model } = require('sequelize')

// import aes256.js helper
const { encrypt } = require('../helpers/aes256')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            this.hasMany(models.UserProfile, {
                as: 'user_profiles',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.UserRole, {
                foreignKey: 'user_id',
                as: 'role_assigned_to_user',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Reservation, {
                foreignKey: 'user_id',
                as: 'reservation',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.FacilityReservation, {
                foreignKey: 'user_id',
                as: 'facility_reservation',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.EducationProfile, {
                foreignKey: 'user_id',
                as: 'education_profile',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Request, {
                foreignKey: 'user_id',
                as: 'request',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.Patient_Information, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_patient_info',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.Medical_History, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_medical_history',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Health_Appointment, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_health_appointment',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Health_Appointment, {
                foreignKey: 'attending_physician',
                as: 'physician_assigned_to_health_appointment',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.Immunization, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_immunization',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Announcement, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_announcement',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Reservation_Signatory, {
                foreignKey: 'user_id',
                as: 'reservation_user_signatory',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Document_Signatory, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_document_signatory',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Health_Appointment_Evaluation, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_health_appointment_evaluation',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Health_Appointment_Evaluation, {
                foreignKey: 'attending_physician',
                as: 'physician_assigned_to_health_appointment_evaluation',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Request_Signatory, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_request_signatory',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Document_Request_Evaluation, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_document_request_evaluation',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.Reservation_Evaluation, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_evrsers_evaluation',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.ResearchDetails, {
                foreignKey: 'user_id',
                as: 'research_user',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.ResearchAuthor, {
                foreignKey: 'user_id',
                as: 'research_author_user',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.OrganizationOfficers, {
                as: 'users_assigned_to_organization',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.Organization, {
                as: 'registered_by_this_user',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.EventReservation, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_reservations',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.EventSignatory, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_event_reservation_signatories',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.UserDPA, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_dpa_agreements',
                onDelete: 'RESTRICT',
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
    User.init(
        {
            user_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_no: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: { msg: 'User ID already exists.' },
                validate: {
                    notNull: { msg: 'User ID should not be null.' },
                    notEmpty: { msg: 'User ID should not be empty.' },
                },
            },
            user_type: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Student', 'PUP Staff']],
                        msg: 'user_type should be Student, PUP Staff or Super Admin.',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Password should not be null.' },
                    notEmpty: { msg: 'Password should not be empty.' },
                },
            },
            is_blacklist: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            login_attempt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            lockout_expiration: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'User',

            hooks: {
                beforeUpdate: user => {
                    // when login_attempt is equal to 3, set is_blacklist to true
                    if (user.login_attempt === 3) {
                        const lockoutExpiration = new Date(Date.now() + 15 * 60 * 1000) // Add 15 minutes to the current time
                        user.is_blacklist = true
                        user.lockout_expiration = lockoutExpiration
                    }
                },
                beforeCreate: user => {
                    // Encrypt user's password before getting sent to the database.
                    user.password = encrypt(user.password)
                },

                afterCreate: () => {
                    if (process.env.ENABLE_MODEL_LOG === 'true') {
                        console.log('A new record has been added to table [users]')
                    }
                },
            },
        }
    )
    return User
}
