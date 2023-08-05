'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Immunization extends Model {
        static associate(models) {
            // define association here
            Immunization.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'immunization_assigned_to_user',
            })
        }
    }
    Immunization.init(
        {
            immunization_id: {
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
                        msg: '[immunization].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            vaccination_card: {
                type: DataTypes.STRING,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('vaccination_card')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/vaccination-card-attachments/${rawValue}`
                        : null
                },
            },
        },
        {
            sequelize,
            modelName: 'Immunization',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
    return Immunization
}
