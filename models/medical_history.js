'use strict'
const { Model } = require('sequelize')
const crypto = require('crypto')

// * dotenv config
require('dotenv').config()

const ENCRYPTION_KEY = Buffer.from(process.env.OMSSS_ENCRYPTION_KEY, 'hex')

function decrypt(encryptedData, key) {
    const buffer = Buffer.from(encryptedData, 'base64')
    const iv = buffer.slice(0, 12)
    const tag = buffer.slice(12, 28)
    const encrypted = buffer.slice(28)
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
    return decrypted.toString()
}

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class Medical_History extends Model {
        static associate(models) {
            Medical_History.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'medical_history_assigned_to_user',
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
    Medical_History.init(
        {
            medical_history_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: true,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[medical_histories].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            medical_history: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const medicalValue = this.getDataValue('medical_history')
                    if (medicalValue === null) {
                        return null
                    }
                    const rawValue = decrypt(medicalValue, ENCRYPTION_KEY)
                    return rawValue ? rawValue.split(';') : null
                },
            },
            social_history: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const socialValue = this.getDataValue('social_history')
                    if (socialValue === null) {
                        return null
                    } else {
                        const rawValue = decrypt(socialValue, ENCRYPTION_KEY)
                        let social_history = rawValue.split(';')
                        let returnValue = {
                            smoker: social_history[0] === 'true',
                            alcoholic: social_history[1] === 'true',
                        }
                        return returnValue
                    }
                },
            },
            family_history: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const familyValue = this.getDataValue('family_history')
                    if (familyValue === null) {
                        return null
                    }
                    const rawValue = decrypt(familyValue, ENCRYPTION_KEY)
                    return rawValue ? rawValue.split(';') : null
                },
            },
            allergy: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const allergyValue = this.getDataValue('allergy')
                    if (allergyValue === null) {
                        return null
                    }
                    const rawValue = decrypt(allergyValue, ENCRYPTION_KEY)
                    return rawValue ? rawValue.split(';') : null
                },
            },
            medications: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const medicationValue = this.getDataValue('medications')
                    if (medicationValue === null) {
                        return null
                    }
                    const rawValue = decrypt(medicationValue, ENCRYPTION_KEY)
                    return rawValue ? rawValue.split(';') : null
                },
            },
        },
        {
            sequelize,
            modelName: 'Medical_History',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
    return Medical_History
}
