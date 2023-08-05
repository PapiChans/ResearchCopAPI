'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class OrganizationOfficers extends Model {
        static associate(models) {
            this.belongsTo(models.Organization, {
                as: 'officers_assigned_to_organizations',
                foreignKey: 'organization_id',
                onDelete: 'RESTRICT',
            })
            this.belongsTo(models.User, {
                as: 'users_assigned_to_organizations',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    OrganizationOfficers.init(
        {
            officer_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            organization_id: {
                type: DataTypes.UUID,
                allowNull: false,
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
            position: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'OrganizationOfficers',
        }
    )
    return OrganizationOfficers
}
