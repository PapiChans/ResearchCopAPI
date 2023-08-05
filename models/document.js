'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Document extends Model {
        static associate(models) {
            // define association here
            this.hasMany(models.Document_Request, {
                foreignKey: 'document_id',
                as: 'document_assigned_to_request',
                onDelete: 'RESTRICT',
            })

            this.hasMany(models.Document_Requirement, {
                foreignKey: 'document_id',
                as: 'document_requirements',
                onDelete: 'RESTRICT',
            })

            this.hasMany(models.Document_Signatory, {
                foreignKey: 'document_id',
                as: 'document_signatories',
                onDelete: 'RESTRICT',
            })

            this.hasMany(models.Request_Signatory, {
                foreignKey: 'document_id',
                as: 'signatories_assigned_to_document',
                onDelete: 'RESTRICT',
            })
        }
    }
    Document.init(
        {
            document_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            document_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            document_type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Transcript of Records', 'Certifications', 'Unclaimed', 'CAV']],
                        msg: 'document_type should be Transcript of Records, Certifications, Unclaimed, and CAV.',
                    },
                },
            },
            document_details: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            document_status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Active', 'Deleted']],
                        msg: 'document_status should be Active or Deleted.',
                    },
                },
                defaultValue: 'Active',
            },
        },
        {
            sequelize,
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            modelName: 'Document',
        }
    )
    return Document
}
