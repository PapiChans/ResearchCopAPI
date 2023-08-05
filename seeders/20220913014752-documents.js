'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.bulkInsert('Documents', [
            {
                document_id: '39cd7abf-570e-4395-8293-1b557a8fec97',
                document_name: 'Certification of Subject Description',
                document_type: 'Certifications',
                document_details:
                    'This certificate provides a description of the subject and a brief summary of the significant learning experiences for the subject. Each request for a subject description costs 150 pesos.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '7a48939e-463c-410e-b27b-0206bbfa41d7',
                document_name: 'Retrieval of Unclaimed Request',
                document_type: 'Unclaimed',
                document_details:
                    'For requests that has not been claimed on the day of appointment or for claim stub that has been lost, a retrieval request must be filed.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '2424b818-7269-4bc3-a343-bd638f9cdb6f',
                document_name: 'CAV-DFA/Apostille - Red Ribbon (For Undergrad)',
                document_type: 'CAV',
                document_details:
                    'The TOR, Cert of Non SO and Cert of English Medium of Instruction documents will be prepared by the Registrar in a sealed envelope, and the client will forward to DFA for CAV authentication (Red Ribbon).',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '8f34536d-a905-46b2-8fa7-b91e0261c611',
                document_name: 'Transcript of Records - Copy for (Undergraduate) 5th Year',
                document_type: 'Transcript of Records',
                document_details:
                    'The Transcript of Records requested to be given to other school or institution for the purpose of admission, transfer, or other similar purposes. This request is especifically for 5th year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '666d8694-9038-450b-978d-158ca6bd547f',
                document_name: 'Re-print Credentials / Counter Checking',
                document_type: 'Certifications',
                document_details:
                    "This is requested if changes in name or other credentials must be made as per the approval of the Registrar's Staff.",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '5f817358-63ed-4399-a379-69aa0cd8447f',
                document_name: 'Certified True Copy of Transcript of Records',
                document_type: 'Transcript of Records',
                document_details:
                    'This is a copy of the Transcript of Records that is signed, stamped, and certified by the Registrar as a true copy of the original Transcript of Records.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'e2c5ad08-15f3-4513-9abc-2e6d35cc803c',
                document_name: 'Transcript of Records - Copy for (Undergraduate) 1st Year',
                document_type: 'Transcript of Records',
                document_details:
                    'The Transcript of Records requested to be given to other school or institution for the purpose of admission, transfer, or other similar purposes. This request is especifically for 1st year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '5df36ebd-df1f-4455-86d9-206518fcf5ac',
                document_name: 'Transcript of Records - Copy for (Undergraduate) 2nd Year',
                document_type: 'Transcript of Records',
                document_details:
                    'The Transcript of Records requested to be given to other school or institution for the purpose of admission, transfer, or other similar purposes. This request is especifically for 2nd year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'e9a703f6-0e02-49df-99be-712aa9c6445c',
                document_name: 'Transcript of Records - Copy for (Undergraduate) 3rd and 4th Year',
                document_type: 'Transcript of Records',
                document_details:
                    'The Transcript of Records requested to be given to other school or institution for the purpose of admission, transfer, or other similar purposes. This request is especifically for 3rd and 4th year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '14925f28-311e-479c-a7d0-419707f3fa98',
                document_name:
                    'Transcript of Records - For evaluation/reference (Undergraduate) 1st Year',
                document_type: 'Transcript of Records',
                document_details:
                    'This is a Transcript of Records that is requested for evaluation or reference purposes such as in scholarship, financial assistance and internship applications. This request is especifically for 1st year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '0be033b6-4944-4445-8a89-0393731b74de',
                document_name:
                    'Transcript of Records - For evaluation/reference (Undergraduate) 2nd Year',
                document_type: 'Transcript of Records',
                document_details:
                    'This is a Transcript of Records that is requested for evaluation or reference purposes such as in scholarship, financial assistance and internship applications. This request is especifically for 2nd year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '89e650da-5c1a-4a87-b198-70581e947295',
                document_name:
                    'Transcript of Records - For evaluation/reference (Undergraduate) 3rd and 4th Year',
                document_type: 'Transcript of Records',
                document_details:
                    'This is a Transcript of Records that is requested for evaluation or reference purposes such as in scholarship, financial assistance and internship applications. This request is especifically for 3rd and 4th year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'c94e9c27-ba70-4229-8a7a-511b06744fbe',
                document_name:
                    'Transcript of Records - For evaluation/reference (Undergraduate) 5th Year',
                document_type: 'Transcript of Records',
                document_details:
                    'This is a Transcript of Records that is requested for evaluation or reference purposes such as in scholarship, financial assistance and internship applications. This request is especifically for 5th year students.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'ecb00ead-4b21-474f-a509-0b8965ee3c7a',
                document_name: 'Certificate of Grades (For Cross Enrollee)',
                document_type: 'Certifications',
                document_details:
                    'The Certificate of Grades to be requested by the students who are cross-enrolled or enrolled in other colleges/universities.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '669955c7-1489-4db0-b25d-d4004e1a81bb',
                document_name: 'Certificate of Transfer Credential (Honorable Dismissal)',
                document_type: 'Certifications',
                document_details:
                    'The “Transfer Credentials” (formerly referred to as “Honorable Dismissal”) is a document certifying that a student has no pending accountabilities with a school and is eligible for transfer to another educational institution, or for admission into another degree program in the same educational institution.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'd162d93d-e768-4994-8e09-c29b0ef13e4d',
                document_name: 'Certificate of Units Earned',
                document_type: 'Certifications',
                document_details:
                    'The Certificate of Units Earned is a document certifying the units credited/earned by a student on the subjects he is enrolled to during his stay in the university.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '156f0b3b-582a-404c-a0d3-272235435751',
                document_name: 'Certification for NSTP Serial Number',
                document_type: 'Certifications',
                document_details:
                    'This Certification for NSTP Serial Number is a document which certifies that the student is an NSTP Graduate.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '59ffc411-8e68-4a2c-98be-4a327971eb67',
                document_name: 'Certification of English as Medium Of instruction',
                document_type: 'Certifications',
                document_details:
                    "A Certification of English as Medium Of instruction is an official recognition of English as a medium of language in completing the student's educational records.",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'ef333c78-17aa-4e43-9e11-d790412f24c1',
                document_name: 'Certification of English as Medium Of instruction for Australia',
                document_type: 'Certifications',
                document_details:
                    'An official recognition stating that English is a medium in which one has studied as a requirement for admission/enrollment in Australia',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '216fcbab-2b0b-447e-b0db-2c39d2ea4dbb',
                document_name: 'Certification of English as Medium Of instruction for Japan',
                document_type: 'Certifications',
                document_details:
                    'An official recognition stating that English is a medium in which one has studied as a requirement for admission/enrollment in Japan',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '889d583c-66c9-40a2-a384-ca4f1eac37a2',
                document_name: 'Certification of Enrollment/Attendance',
                document_type: 'Certifications',
                document_details:
                    "Certification of enrollment is an official document that confirms attendance, awarded degrees, current & past enrollment, expected graduation date and other parts of a student's academic record",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '7ab9763b-600c-488e-acf0-d67e8e804f2c',
                document_name: 'Certification of Non-Issuance of Special Order (S.O.)',
                document_type: 'Certifications',
                document_details:
                    'A document which certifies that a Special Order has not been issued to the student.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '690f1352-50e2-4a28-9fcb-fa8f298a8be9',
                document_name: 'Informative Copy of Grades / Certified Copy of Grades',
                document_type: 'Certifications',
                document_details:
                    "The Informative Copy of Grades is a document which lists the student's grade from the 1st year 1st semester up to the latest semester he is currently enrolled in. This is requested for transfer to other school or scholarship purposes.",
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: '95717abd-14a5-4af2-a0ca-4e1e353e9f9f',
                document_name: "Special Certification required by Agency/gov't Offices",
                document_type: 'Certifications',
                document_details:
                    'A special certification is a document that is required by certain government agencies or offices in order to prove that an individual has the necessary qualifications for a certain job or task.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'a592fddd-a46e-4535-b288-ff019daf4eee',
                document_name: 'CAV-CHED (Commission on Higher Education)',
                document_type: 'CAV',
                document_details:
                    'The Certification, Authentication, and Verification (CAV) refers to the official and formal processes and acts of checking, reviewing and certifying to the genuineness and veracity of available academic records of a learner. The documents will be prepared by the Registrar in a sealed envelope, and the client will forward it to CHED.',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                document_id: 'e1f4c9ec-0c5a-4d34-9ba7-83f704bc959a',
                document_name: 'WES Form, ICES Form, IQAS Form',
                document_type: 'CAV',
                document_details:
                    'WES provides credential evaluations for international students, ICES evaluates international academic credentials and IQAS helps people get recognition for education and training they received outside of Canada',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Documents', null, {})
    },
}
