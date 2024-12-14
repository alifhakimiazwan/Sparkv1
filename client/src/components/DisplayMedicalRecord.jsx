import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DisplayMedicalRecord = ({ contract, account }) => {
  const [medicalRecord, setMedicalRecord] = useState({
    name: "",
    ic: "",
    medicalHistory: "",
    currentMedications: "",
  });

  useEffect(() => {
    // Automatically fetch the medical record when the component mounts
    const fetchMedicalRecord = async () => {
      try {
        let record;
        // Fetch the medical record for the current account
        record = await contract.displayMedicalRecord(account);

        // Check if the response contains valid data
        if (record) {
          const [name, ic, medicalHistory, currentMedications] = record;
          setMedicalRecord({
            name: name || "Not available",
            ic: ic || "Not available",
            medicalHistory: medicalHistory || "Not available",
            currentMedications: currentMedications || "Not available",
          });
        } else {
          setMedicalRecord({
            name: "Not available",
            ic: "Not available",
            medicalHistory: "Not available",
            currentMedications: "Not available",
          });
        }
      } catch (e) {
        setMedicalRecord({
          name: "Error retrieving data",
          ic: "Error retrieving data",
          medicalHistory: "Error retrieving data",
          currentMedications: "Error retrieving data",
        });
      }
    };

    fetchMedicalRecord();
  }, [contract, account]);

  // Fetch when contract or account changes

  // This function can still be used if the user wants to search another address
  const getMedicalRecord = async () => {
    const otherAddress = document.querySelector(".address").value;
    try {
      let record;
      if (otherAddress) {
        // Fetch the medical record for the specified address
        record = await contract.displayMedicalRecord(otherAddress);
      } else {
        // Fetch the medical record for the current account
        record = await contract.displayMedicalRecord(account);
      }

      // Check if the response contains valid data
      if (record) {
        const [name, ic, medicalHistory, currentMedications] = record;
        setMedicalRecord({
          name: name || "Not available",
          ic: ic || "Not available",
          medicalHistory: medicalHistory || "Not available",
          currentMedications: currentMedications || "Not available",
        });
      } else {
        setMedicalRecord({
          name: "Not available",
          ic: "Not available",
          medicalHistory: "Not available",
          currentMedications: "Not available",
        });
      }
    } catch (e) {
      setMedicalRecord({
        name: "Not available",
        ic: "Not available",
        medicalHistory: "Not available",
        currentMedications: "Not available",
      });
      toast.error("You don't have access to this data! displaymedicalrecord"); // Display a toast on error
    }
  };

  return (
    <>
      <div className="top flex flex-col justify-center items-center bg-white p-7 rounded-lg shadow-lg space-y-6 w-full py-7 mb-10">
        <p className="text-2xl text-navy font-bold">Find Medical Record</p>
        <div>
          <strong className="text-teal">Name:</strong>{" "}
          <span className="text-navy">{medicalRecord.name}</span>
        </div>
        <div>
          <strong className="text-teal">Identity Card:</strong>{" "}
          <span className="text-navy">{medicalRecord.ic}</span>
        </div>
        <div>
          <strong className="text-teal">Medical History:</strong>{" "}
          <span className="text-navy">{medicalRecord.medicalHistory}</span>
        </div>
        <div>
          <strong className="text-teal">Current Medication</strong>{" "}
          <span className="text-navy">{medicalRecord.currentMedications}</span>
        </div>

        {/* Optionally display the address input and button for searching other users */}
        <div className="flex w-full">
          <input
            type="text"
            className="address w-full border border-gray-300 bg-white text-gray-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal"
            placeholder="Enter Address"
          />
          <button
            className="btn bg-teal text-white font-light py-2 px-7 rounded-lg ml-4"
            onClick={getMedicalRecord} // You can still use this if the user wants to search for another account
          >
            Get Medical Record
          </button>
        </div>
      </div>
    </>
  );
};

export default DisplayMedicalRecord;
