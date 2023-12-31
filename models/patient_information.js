'use strict'
const { Model } = require('sequelize')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class Patient_Information extends Model {
        static associate(models) {
            Patient_Information.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'patient_info_assigned_to_user',
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
    Patient_Information.init(
        {
            patient_information_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[patient_information].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            emergency_contact_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            emergency_contact_number: {
                type: DataTypes.STRING(11),
                allowNull: true,
            },
            emergency_contact_email: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isEmail: {
                        args: true,
                        msg: '[health_appointments].[emergency_contact_email] must be unique!',
                    },
                },
                unique: { msg: 'Email must be unique. ' },
            },
            emergency_contact_address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            philhealth_number: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            philhealth_id_image: {
                type: DataTypes.STRING,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('philhealth_id_image')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/philhealth-id-attachments/${rawValue}`
                        : null
                },
            },
        },
        {
            sequelize,
            modelName: 'Patient_Information',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
    return Patient_Information
}
