'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Request_Signatory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Request, {
                foreignKey: 'request_id',
                as: 'signatory_for_request',
                onDelete: 'RESTRICT',
            })
            this.belongsTo(models.Document, {
                foreignKey: 'document_id',
                as: 'signatory_for_document',
                onDelete: 'RESTRICT',
            })
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'signatory_for_user',
                onDelete: 'RESTRICT',
            })
        }
    }
    Request_Signatory.init(
        {
            request_signatory_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            document_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            hierarchy_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            request_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            is_signed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_onhold: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            paranoid: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
            modelName: 'Request_Signatory',
        }
    )
    return Request_Signatory
}
