'use strict'
const { Model } = require('sequelize')

// Include all protected attributes
const PROTECTED_ATTRIBUTES = ['password']

module.exports = (sequelize, DataTypes) => {
    class Request extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'user_assigned_to_request',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Document_Request, {
                foreignKey: 'request_id',
                as: 'documents_assigned_to_request',
                onDelete: 'RESTRICT',
            })
            this.hasMany(models.Request_Signatory, {
                foreignKey: 'request_id',
                as: 'signatories_assigned_to_request',
                onDelete: 'RESTRICT',
            })
            this.hasOne(models.Document_Request_Evaluation, {
                foreignKey: 'request_id',
                as: 'document_request_evaluation',
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
    Request.init(
        {
            request_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            control_no: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: { msg: 'Control number already exists.' },
            },
            or_no: {
                type: DataTypes.STRING,
                allowNull: true,
                unique: { msg: 'OR number already exists.' },
            },
            status_of_request: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Pending for Clearance',
                validate: {
                    isIn: {
                        args: [
                            [
                                'Pending for Clearance',
                                'For Clearance',
                                'For Evaluation/Processing',
                                'Ready for Pickup',
                                'Released',
                                'Cancelled by Student',
                                'Cancelled by Staff',
                                'Deleted',
                            ],
                        ],
                    },
                },
            },
            remarks: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            purpose_of_request: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            payment_status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: 'Pending',
                validate: {
                    isIn: {
                        args: [['Pending', 'Paid', 'Cancelled']],
                    },
                },
            },
            release_classification: {
                type: DataTypes.STRING,
                allowNull: true,
                validate: {
                    isIn: {
                        args: [['Claim Stub', 'Lost Claim Stub', 'Representative']],
                        msg: 'release_classification should be Claim Stub, Lost Claim Stub, and Representative.',
                    },
                },
            },
            request_form: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            pending_for_clearance: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            for_clearance: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            for_evaluation: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            ready_for_pickup: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            released: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            cancelled: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            expiration: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deleted: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            approved: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            onhold: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_approved_all: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_evaluated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Request',
        }
    )
    return Request
}
