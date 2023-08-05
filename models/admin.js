'use strict'
const { Model } = require('sequelize')

// Bcrypt lib for encrypting password
const bcrypt = require('bcrypt')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            this.hasMany(models.AdminProfile, {
                as: 'admin_profiles',
                foreignKey: 'admin_id',
                onDelete: 'RESTRICT',
            })
        }
        toJSON() {
            const attributes = { ...this.get() }
            for (const x of PROTECTED_ATTRIBUTES) {
                delete attributes[x]
            }
            return attributes
        }
    }
    Admin.init(
        {
            admin_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_no: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: { msg: 'Admin ID already exists.' },
                validate: {
                    notNull: { msg: 'Admin ID should not be null.' },
                    notEmpty: { msg: 'Admin ID should not be empty.' },
                },
            },
            user_type: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Super Admin']],
                        msg: 'user_type should be Super Admin.',
                    },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Password should not be null.' },
                    notEmpty: { msg: 'Password should not be empty.' },
                },
            },
            is_blacklist: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            login_attempt: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            lockout_expiration: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Admin',
            tableName: 'Admin',

            hooks: {
                beforeUpdate: admin => {
                    // when login_attempt is equal to 3, set is_blacklist to true
                    if (admin.login_attempt === 3) {
                        const lockoutExpiration = new Date(Date.now() + 15 * 60 * 1000) // Add 15 minutes to the current time
                        admin.is_blacklist = true
                        admin.lockout_expiration = lockoutExpiration
                    }
                },
                beforeCreate: admin => {
                    // Encrypt user's password before getting sent to the database.
                    admin.password = bcrypt.hashSync(admin.password, 10)
                },

                afterCreate: () => {
                    if (process.env.ENABLE_MODEL_LOG === 'true') {
                        console.log('A new record has been added to table [users]')
                    }
                },
            },
        }
    )
    return Admin
}
