'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Document_Request_Evaluation extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.Request, {
                foreignKey: 'request_id',
                as: 'document_request_evaluation',
            })
            this.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'document_request_evaluation_user',
            })
        }
    }
    Document_Request_Evaluation.init(
        {
            evaluation_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            request_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[document_request_evaluations].[request_id] value must be a UUIDV4 type',
                    },
                },
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
                validate: {
                    isUUID: {
                        args: 4,
                        msg: '[document_request_evaluations].[user_id] value must be a UUIDV4 type',
                    },
                },
            },
            evaluation_date: {
                type: DataTypes.DATE,
                allowNull: false,
                validate: {
                    isDate: {
                        msg: '[document_request_evaluations].[evaluation_date] value must be a date type',
                    },
                },
            },
            quality_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: '[document_request_evaluations].[quality_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[document_request_evaluations].[quality_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[document_request_evaluations].[quality_rating] value must be less than or equal to 5',
                    },
                },
            },
            timeliness_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: '[document_request_evaluations].[timeliness_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[document_request_evaluations].[timeliness_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[document_request_evaluations].[timeliness_rating] value must be less than or equal to 5',
                    },
                },
            },
            courtesy_rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    isInt: {
                        msg: '[document_request_evaluations].[courtesy_rating] value must be an integer type',
                    },
                    min: {
                        args: 1,
                        msg: '[document_request_evaluations].[courtesy_rating] value must be greater than or equal to 1',
                    },
                    max: {
                        args: 5,
                        msg: '[document_request_evaluations].[courtesy_rating] value must be less than or equal to 5',
                    },
                },
            },
            average_rating: {
                type: DataTypes.DECIMAL(10, 3),
                allowNull: false,
            },
            evaluation_comment: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Document_Request_Evaluation',
        }
    )
    return Document_Request_Evaluation
}
