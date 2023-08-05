'use strict'
const { Model } = require('sequelize')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class AdminProfile extends Model {
        static associate(models) {
            this.belongsTo(models.Admin, {
                as: 'admin_profile',
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
    AdminProfile.init(
        {
            admin_profile_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            admin_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[users].[admin_id] value must be a UUIDV4 type',
                    },
                },
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'First name should not be null.' },
                    notEmpty: { msg: 'First Name should not be empty.' },
                },
            },
            middle_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: 'Last name should not be null.' },
                    notEmpty: { msg: 'Last Name should not be empty.' },
                },
            },
            extension_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            full_name: {
                type: DataTypes.STRING,
                set(value) {
                    if (this.middle_name == null && this.extension_name == null) {
                        // walang middle name at walang extension name
                        this.setDataValue('full_name', `${this.first_name} ${this.last_name}`)
                    } else if (this.middle_name == null && this.extension_name != null) {
                        // walang middle name pero may extension name
                        this.setDataValue(
                            'full_name',
                            `${this.first_name} ${this.last_name} ${this.extension_name}`
                        )
                    } else if (this.middle_name != null && this.extension_name == null) {
                        // may middle name pero walang extension name
                        this.setDataValue(
                            'full_name',
                            `${this.first_name} ${this.middle_name.charAt(0).toUpperCase()}. ${
                                this.last_name
                            }`
                        )
                    } else {
                        this.setDataValue(
                            'full_name',
                            `${this.first_name} ${this.middle_name.charAt(0).toUpperCase()}. ${
                                this.last_name
                            } ${this.extension_name}`
                        )
                    }
                },
            },
            birth_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            gender: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Male', 'Female', 'Others']],
                        msg: 'Gender should be male, female or others only.',
                    },
                },
            },
            house_street: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            barangay: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            municipality: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            province: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            region: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            full_address: {
                type: DataTypes.STRING,
                set(value) {
                    this.setDataValue(
                        'full_address',
                        this.house_street +
                            ' ' +
                            this.barangay +
                            ' ' +
                            this.municipality +
                            ' ' +
                            this.province +
                            ' ' +
                            this.region
                    )
                },
            },
            contact_number: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            email_address: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isEmail: { msg: 'Email Address entered must be in a valid format.' },
                },
                unique: { msg: 'Email Address already exists.' },
            },
            civil_status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['Single', 'Married', 'Widowed', 'Separated', 'Divorced']],
                },
            },
            citizenship: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            religion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'AdminProfile',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
    return AdminProfile
}
