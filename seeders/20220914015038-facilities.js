"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("Facilities", [
      {
        facility_id: "4abdd106-1916-4563-a84f-11daa788794d",
        facility_name: "PUP QC Gymnasium",
        facility_picture: "image",
        facility_description: "It is a large space specifically designed for physical exercise and physical education classes and large scale meetings.",
        facility_status: 'Available',
        facility_capacity: "200",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        facility_id: "2b7e4c6f-3237-4210-902e-b8875a84d4a4",
        facility_name: "Computer Laboratory",
        facility_picture: "image",
        facility_description: "It is a room equipped with multiple computers, networked and connected to the internet, for students to use for educational and technological purposes.",
        facility_status: 'Available',
        facility_capacity: "40",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        facility_id: "d62dfb04-56ac-42ba-bd2e-af2602fd5d09",
        facility_name: "Audio-Visual Room",
        facility_picture: "image",
        facility_description: "It is a dedicated space equipped with audio and visual technology to enhance the learning experience for students. It is typically equipped with a large screen or projector, sound system, and various audio-visual components such as DVD players, microphones, and speakers.",
        facility_status: 'Available',
        facility_capacity: "60",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        facility_id: "330fdc66-d5ac-45c9-a06e-189c04573f5d",
        facility_name: "PUPQC Chapel",
        facility_picture: "image",
        facility_description: "It is a place of worship or meditation within a school campus. It is usually a quiet and peaceful space that is designed to promote reflection, spirituality, and religious expression.",
        facility_status: 'Available',
        facility_capacity: "120",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        facility_id: "ae34db44-aea2-4678-a36b-97bb53ab729f",
        facility_name: "PUPQC Library",
        facility_picture: "image",
        facility_description: "It is a collection of resources, both physical and digital, intended to support student learning and research. It typically contains books, periodicals, journals, and other reading materials.",
        facility_status: 'Unavailable',
        facility_capacity: "30",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        facility_id: "02fa0e31-f69f-4e26-ba13-d9808593e631",
        facility_name: "Entrep Laboratory",
        facility_picture: "image",
        facility_description: "It is a dedicated space designed to help students develop entrepreneurial skills and innovative thinking.",
        facility_status: 'Deleted',
        facility_capacity: "55",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {},
};



