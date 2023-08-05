'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.bulkInsert('Document_Requirements', [
            {
                doc_req_id: '3f6bfa22-6936-4145-b405-a347be0a7a2a',
                document_id: 'a592fddd-a46e-4535-b288-ff019daf4eee',
                doc_req_name:
                    'Photocopy of TOR (must capture the whole page including the signatories)',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '6e6787fb-f7a8-4b20-9fc8-f19b72264fcb',
                document_id: 'a592fddd-a46e-4535-b288-ff019daf4eee',
                doc_req_name: 'Photocopy of Diploma',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '27364a6a-7082-4e7c-93be-5e4f4c0f477c',
                document_id: 'a592fddd-a46e-4535-b288-ff019daf4eee',
                doc_req_name: 'Letter format for CHED',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: 'ef374473-c6b4-4eb0-8d09-b6de6edd7aef',
                document_id: '2424b818-7269-4bc3-a343-bd638f9cdb6f',
                doc_req_name:
                    'Photocopy of TOR (must capture the whole page including the signatories)',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '3b03776a-c776-4aba-8c7e-51a1756dc6f6',
                document_id: '2424b818-7269-4bc3-a343-bd638f9cdb6f',
                doc_req_name: 'Photocopy of Diploma',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: 'b5824222-dbac-4056-ab2e-3f8626be69e4',
                document_id: '669955c7-1489-4db0-b25d-d4004e1a81bb',
                doc_req_name: 'Letter of Request to Transfer',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: 'dcba775c-0624-4283-9fd1-34b2cc7faa43',
                document_id: '39cd7abf-570e-4395-8293-1b557a8fec97',
                doc_req_name: 'List of Subject/s',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '170f8f88-86d9-4621-a9de-a4a263060b27',
                document_id: '5f817358-63ed-4399-a379-69aa0cd8447f',
                doc_req_name:
                    'Photocopy of TOR (must capture the whole page including the signatories)',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: 'f32b3bbf-0162-4f1f-903b-61e56caa3253',
                document_id: '690f1352-50e2-4a28-9fcb-fa8f298a8be9',
                doc_req_name: 'Documentary Stamp',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: 'e5a5b2b3-9be3-4552-a0a2-a5ff5db9a1e0',
                document_id: '690f1352-50e2-4a28-9fcb-fa8f298a8be9',
                doc_req_name: 'Letter stating the Purpose of Request',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '6aa3cb38-07d4-482b-a340-ee00e08bddf0',
                document_id: '666d8694-9038-450b-978d-158ca6bd547f',
                doc_req_name: 'Original Diploma',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: 'ce829a26-b238-43c1-98ec-91eee37ee94c',
                document_id: '7a48939e-463c-410e-b27b-0206bbfa41d7',
                doc_req_name: 'Claiming Stub (Or Affidavit of Loss)',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '70a7e6fe-dccb-494a-bf92-062c6d75ac1e',
                document_id: '95717abd-14a5-4af2-a0ca-4e1e353e9f9f',
                doc_req_name: 'Copy of sample format or request letter',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '5ec7db21-aeb9-4cd1-a78d-ae517998abbb',
                document_id: 'e2c5ad08-15f3-4513-9abc-2e6d35cc803c',
                doc_req_name: 'Tear-off portion of Honorable Dismissal',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '2d5a01ac-8723-455a-83a6-bf513e3003e3',
                document_id: '5df36ebd-df1f-4455-86d9-206518fcf5ac',
                doc_req_name: 'Tear-off portion of Honorable Dismissal',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '25f21b63-9db3-430d-b441-57b91869bc2f',
                document_id: 'e9a703f6-0e02-49df-99be-712aa9c6445c',
                doc_req_name: 'Tear-off portion of Honorable Dismissal',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '0a0c609a-4fa3-4efa-b36a-6c59f9fcbfc5',
                document_id: '8f34536d-a905-46b2-8fa7-b91e0261c611',
                doc_req_name: 'Tear-off portion of Honorable Dismissal',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                doc_req_id: '184f63e8-e0e9-46a2-a0c6-07f9544443d5',
                document_id: 'e1f4c9ec-0c5a-4d34-9ba7-83f704bc959a',
                doc_req_name: 'Fully Accomplished WES/ICES/IQAS Form',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Document_Requirements', null, {})
    },
}
