'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class UserDPA extends Model {
        static associate(models) {
            this.belongsTo(models.UserDPA, {
                foreignKey: 'user_id',
                as: 'user_assigned_to_dpa_agreement',
                onDelete: 'RESTRICT',
            })
        }
    }
    UserDPA.init(
        {
            dpa_agremeent_id: {
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
                        msg: '[users].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            is_signed: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                name: 'is_signed',
                field: 'is_signed',
            },
        },
        {
            sequelize,
            timestamps: false,
            modelName: 'UserDPA',
        }
    )
    return UserDPA
}
