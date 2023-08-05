'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Reservation_Signatory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'user_assigned_to_reservation_signatory',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.belongsTo(models.Reservation, {
                as: 'assigned_reservation',
                foreignKey: 'reservation_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    Reservation_Signatory.init(
        {
            reservation_signatory_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            reservation_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
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
            hierarchy_number: {
                type: DataTypes.INTEGER,
                allowNull: false,
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
            modelName: 'Reservation_Signatory',
        }
    )
    return Reservation_Signatory
}
