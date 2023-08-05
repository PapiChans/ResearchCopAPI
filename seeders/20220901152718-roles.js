'use strict'

module.exports = {
	async up(queryInterface, Sequelize) {
		return queryInterface.bulkInsert('Roles', [
			{
				role_id: '084b9fd9-05ba-4e19-b733-2c5dabc5c9ff',
				role_name: 'Organizer',
				role_description: 'organizer eme',
				role_for: 'Student',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				role_id: 'd679ec16-2589-47f2-9b04-06f422b18c6d',
				role_name: 'Doctor',
				role_description: 'doctor eme',
				role_for: 'PUP Staff',
				created_at: new Date(),
				updated_at: new Date(),
			},
			{
				role_id: '641cac7a-2706-4e4c-b8a3-2c01e08bf147',
				role_name: 'Dentist',
				role_description: 'dentist eme',
				role_for: 'PUP Staff',
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
