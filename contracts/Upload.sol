// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Upload {

    // Struct to store the patient's medical record
    struct MedicalRecord {
        string name;  // Patient's name
        string ic;    // Patient's identification card (IC)
        string medicalHistory; // Patient's medical history
        string currentMedications; // Patient's current medications
    }

    struct Access {
        address user;
        bool access;
    }

    mapping(address => MedicalRecord) private medicalRecords; // Mapping to store medical records by patient address
    mapping(address => string[]) private value; // To store general documents (e.g., images)
    mapping(address => mapping(address => bool)) private ownership; // For ownership rights (e.g., between patients and doctors)
    mapping(address => Access[]) public accessList; // List of users who have access
    mapping(address => mapping(address => bool)) private previousData; // Tracking previous access permissions

    // Event for adding medical records
    event MedicalRecordAdded(address indexed patient);

    // Function to allow the patient to add or update their medical record (name, IC, medical history, and current medications)
    function addMedicalRecord(
        string calldata name,
        string calldata ic,
        string calldata medicalHistory,
        string calldata currentMedications
    ) external {
        medicalRecords[msg.sender] = MedicalRecord({
            name: name,
            ic: ic,
            medicalHistory: medicalHistory,
            currentMedications: currentMedications
        });

        emit MedicalRecordAdded(msg.sender);
    }

    // Function to allow a doctor to access a patient's medical record
    function allow(address doctor) external {
        ownership[msg.sender][doctor] = true;

        if (previousData[msg.sender][doctor] == true) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == doctor) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(doctor, true));
            previousData[msg.sender][doctor] = true;
        }
    }

    // Function to revoke a doctor's access to a patient's medical record
    function disallow(address doctor) external {
        ownership[msg.sender][doctor] = false;
        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == doctor) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    // Function to display the patient's medical record (name, IC, medical history, medications)
    function displayMedicalRecord(address patient) external view returns (
        string memory name, 
        string memory ic, 
        string memory medicalHistory, 
        string memory currentMedications
    ) {
        require(patient == msg.sender || ownership[patient][msg.sender], "You don't have access to this record");

        MedicalRecord memory record = medicalRecords[patient];
        return (record.name, record.ic, record.medicalHistory, record.currentMedications);
    }

    // Function to display general documents like images, documents
    function displayDocuments(address patient) external view returns (string[] memory) {
        require(patient == msg.sender || ownership[patient][msg.sender], "You don't have access to these documents");
        return value[patient];
    }

    // Function to share access list (who has access to the medical record)
    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }

    // Function to add general documents (images, files)
    function addDocument(address patient, string calldata url) external {
        value[patient].push(url);
    }
}
