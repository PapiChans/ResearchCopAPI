'use strict'
const { Model } = require('sequelize')
const crypto = require('crypto')
module.exports = (sequelize, DataTypes) => {
    class Announcement extends Model {
        static associate(models) {
            // define association here
            this.belongsTo(models.User, {
                as: 'announcement_assigned_to_user',
                foreignKey: 'user_id',
                onDelete: 'RESTRICT',
            })
        }
    }
    Announcement.init(
        {
            announcement_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4,
            },
            reference_id: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: () => {
                    let id = crypto.randomBytes(16).toString('hex')
                    return id
                },
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
            announcement_type: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['News', 'Advisory', 'Announcement']],
                        msg: '[announcements].[announcement_type] value must be either "News", "Advisory", or "Announcement"',
                    },
                },
            },
            announcement_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            announcement_link: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            announcement_description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            announcement_content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            announcement_image: {
                type: DataTypes.TEXT,
                allowNull: true,
                get() {
                    const rawValue = this.getDataValue('announcement_image')
                    return rawValue
                        ? `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/announcement-attachments/${rawValue}`
                        : null
                },
            },
            announcement_status: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: {
                        args: [['Published', 'Hidden', 'Deleted']],
                        msg: '[announcement].[announcement_status] value must be either "Published", "Hidden", or "Deleted"',
                    },
                },
                defaultValue: 'Published',
            },
        },
        {
            sequelize,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            modelName: 'Announcement',

            hooks: {
                // When a new announcement is created, the announcement_link is created using:
                // announcement_link = "https://mypupqc.live/" + announcement_type + "/" + reference_id
                beforeCreate: announcement => {
                    if (
                        announcement.announcement_type == 'News' ||
                        announcement.announcement_type == 'Advisory'
                    ) {
                        let announcement_link =
                            'https://www.mypupqc.live/' +
                            announcement.announcement_type.toLowerCase() +
                            '/' +
                            announcement.reference_id

                        announcement.announcement_link = announcement_link
                    }
                },
            },
        }
    )
    return Announcement
}
