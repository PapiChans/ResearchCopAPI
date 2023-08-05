'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Document_Signatory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.hasMany(models.Document, {
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
    Document_Signatory.init(
        {
            document_signatory_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            document_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
            },
            hierarchy_number: {
                type: DataTypes.INTEGER,
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
            modelName: 'Document_Signatory',
        }
    )
    return Document_Signatory
}
