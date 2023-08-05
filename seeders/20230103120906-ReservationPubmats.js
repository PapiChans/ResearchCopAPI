'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('ReservationPubmats', [
      {
        reservation_id: 'cca4aae9-4041-4e5b-bdac-1585a37dce69',
        pubmat_id: '07020b16-ae79-4126-8365-64a924546723',
        pubmat_images: '1',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '6382d77c-63be-4cd6-801b-c98142431bc3',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '2',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: 'cca4aae9-4041-4e5b-bdac-1585a37dce69',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '3',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '79e20dc9-3abf-4082-9d4d-880ac88e0842',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '4',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: 'e1f7a380-8ff6-4427-9da3-8fdd3d9fac7a',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '5',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '0f7119a5-ec40-4f59-af26-817cff7b0999',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '6',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: 'cc25a553-3e7d-4541-8976-fbc03767e8e9',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '7',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '8e94bc2b-fd35-4b30-ba0b-3bfcab30f4c6',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '8',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '6079e7a1-59df-4a2b-98ee-9e3d99fa40c9',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '9',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '1655c59d-dd33-4a5e-80da-2a71bc5ec726',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '10',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: 'eaa9d40b-9f5d-4846-b923-3d716176c2be',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '11',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '8e8c67c5-eea3-4212-acc4-0a185813530c',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '12',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '73dc292a-0016-42fd-9415-7af0228f1408',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '13',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: 'e51eca14-d6a2-4eba-bc58-837d9e54217e',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '14',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        reservation_id: '8b7c7b74-d4a7-4339-af9b-4f6b5242138a',
        pubmat_id: '1790752c-dd24-4caf-828b-4e8de98c19f6',
        pubmat_images: '15',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {

  }
};
