'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class EducationProfile extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'user_assigned_to_education_profile',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    EducationProfile.init(
        {
            education_profile_id: {
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
            user_course: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            admission_status: {
                type: DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    isIn: {
                        args: [
                            [
                                'Freshman',
                                'Continuing',
                                'Transferee',
                                'Readmission',
                                'Dropped',
                                'Graduated/Alumni',
                            ],
                        ],
                        msg: 'education_status should be Freshman, Continuing, Transferee, Readmission, Dropped, or Graduated/Alumni',
                    },
                },
            },
            scholastic_status: {
                type: DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    isIn: {
                        args: [['Regular', 'Irregular', 'Returnee']],
                        msg: 'scholastic_status should be Regular, Irregular, or Returnee',
                    },
                },
            },
            school_year_admitted: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            course_when_admitted: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            high_school_graduated: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            high_school_graduated_year: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            elementary_graduated: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            elementary_graduated_year: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'EducationProfile',
        }
    )
    return EducationProfile
}
