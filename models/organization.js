'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Organization extends Model {
        static associate(models) {
            this.hasMany(models.OrganizationOfficers, {
                as: 'officers_assigned_to_organization',
                foreignKey: 'organization_id',
                onDelete: 'RESTRICT',
            })
            this.belongsTo(models.User, {
                as: 'user_assigned_for_registration',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.EventReservation, {
                as: 'organization_assigned_to_reservations',
                foreignKey: 'organization_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    Organization.init(
        {
            organization_id: {
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
                        msg: '[organization].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            organization_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organization_details: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organization_year_revalidated: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organization_adviser: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            organization_contact_email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organization_contact_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organization_status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Pending', 'For Review', 'Active', 'Inactive', 'Deleted']],
                        msg: '[organization].[organization_status] value must be either "Pending", "For Review", "Active", "Inactive", or "Deleted"',
                    },
                },
                defaultValue: 'Pending',
            },
            organization_logo: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    const rawValue = this.getDataValue('organization_logo')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/organization-logo/${rawValue}`
                        : null
                },
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Organization',
        }
    )
    return Organization
}
