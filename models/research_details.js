'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class ResearchDetails extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'research_user',
                onDelete: 'RESTRICT',
            })

            this.hasMany(models.ResearchDetails, {
                foreignKey: 'research_id',
                as: 'research_from_user',
                onDelete: 'RESTRICT',
            })
        }
    }
    ResearchDetails.init(
        {
            research_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                defaultValue: DataTypes.UUIDV4,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[users].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            research_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            research_author: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            research_co_author: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            research_abstract: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            research_date_accomplished: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            research_adviser: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            research_program: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            research_type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Non-Copyrighted',
                validate: {
                    isIn: {
                        args: [['Non-Copyrighted', 'Copyrighted']],
                        msg: 'Type Research should be Copyrighted or Non-Copyrighted.',
                    },
                },
            },
            research_status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Pending',
                validate: {
                    isIn: {
                        args: [['Approved', 'Rejected', 'Pending', 'Archived']],
                        msg: 'Status should be Approved, Rejected or Pending only',
                    },
                },
            },
            research_category: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Research',
                validate: {
                    isIn: {
                        args: [['Research', 'Capstone']],
                        msg: 'Categories should be Research or Capstone only',
                    },
                },
            },
            research_checked_by: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            research_remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            research_pdf: {
                type: DataTypes.STRING,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('research_pdf')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/research-attachments/${rawValue}`
                        : null
                },
            },
            copyright_pdf: {
                type: DataTypes.STRING,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('copyright_pdf')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/copyright-attachments/${rawValue}`
                        : null
                },
            },
            copyright_status: {
                type: DataTypes.STRING,
                allowNull: true,
                defaultValue: 'No Upload',
                validate: {
                    isIn: {
                        args: [['No Upload', 'Reviewing', 'Rejected', 'Approved']],
                        msg: 'Status should be Approved, Rejected or Reviewing only',
                    },
                },
            },
            copyright_checked_by: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            copyright_remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'ResearchDetails',
            tableName: 'Research_Details',
        }
    )
    return ResearchDetails
}
