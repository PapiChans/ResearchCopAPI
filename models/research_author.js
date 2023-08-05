'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class ResearchAuthor extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'research_author_user',
                onDelete: 'RESTRICT',
            })

            this.belongsTo(models.ResearchDetails, {
                foreignKey: 'research_id',
                as: 'research_from_user',
                onDelete: 'RESTRICT',
            })
        }
    }
    ResearchAuthor.init(
        {
            research_author_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            research_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: true,
                defaultValue: DataTypes.UUIDV4,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[users].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            full_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            author_type: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Unassigned',
                validate: {
                    isIn: {
                        args: [['Unassigned','Author', 'Co-Author']],
                        msg: 'Author Types must be Unassigned, Author and Co-Author',
                    },
                },
            },
        },
        {
            sequelize,
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'ResearchAuthor',
            tableName: 'Research_Author',
        }
    )
    return ResearchAuthor
}
