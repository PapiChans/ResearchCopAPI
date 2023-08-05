'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Document_Requirement extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Document, {
                foreignKey: 'document_id',
                as: 'requirement_for_document',
                onDelete: 'RESTRICT',
            })
        }
    }
    Document_Requirement.init(
        {
            doc_req_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            document_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            doc_req_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            modelName: 'Document_Requirement',
        }
    )
    return Document_Requirement
}
