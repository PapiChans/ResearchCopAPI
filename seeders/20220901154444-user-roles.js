'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert('UserRoles', [
			{
				user_id: 'fb4a5104-fc9e-4f4f-96d8-5a5c9e2726e5',
				role_id: '084b9fd9-05ba-4e19-b733-2c5dabc5c9ff',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				user_id: 'a5ad3552-6d19-4dd3-b6b9-8f93bab0739f',
				role_id: 'd679ec16-2589-47f2-9b04-06f422b18c6d',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				user_id: '1097d51b-526e-4b0c-8732-d36df6daeee5',
				role_id: '641cac7a-2706-4e4c-b8a3-2c01e08bf147',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				user_id: '1097d51b-526e-4b0c-8732-d36df6daeee5',
				role_id: 'd679ec16-2589-47f2-9b04-06f422b18c6d',
				created_at: new Date(),
				updated_at: new Date(),
			},
		])
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
}
