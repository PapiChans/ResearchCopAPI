'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Document_Request extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Request, {
                foreignKey: 'request_id',
                as: 'request_information',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Document, {
                foreignKey: 'document_id',
                as: 'document_information',
                onDelete: 'RESTRICT',
            })
        }
    }
    Document_Request.init(
        {
            document_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            request_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Document_Request',
        }
    )
    return Document_Request
}
