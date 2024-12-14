import { useState } from "react";
import axios from "axios";

const MedicalRecordUpload = ({ contract, account, provider }) => {
  const [name, setName] = useState("");
  const [ic, setIc] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (name && ic && medicalHistory && currentMedications) {
      try {
        setLoading(true);

        // Call the smart contract to add the medical record
        await contract.addMedicalRecord(
          name,
          ic,
          medicalHistory,
          currentMedications
        );

        alert("Medical Record Uploaded Successfully");

        // Reset form fields after successful submission
        setName("");
        setIc("");
        setMedicalHistory("");
        setCurrentMedications("");
      } catch (error) {
        console.error(error);
        alert("Failed to upload medical record");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="top flex flex-col justify-center items-center bg-white p-7 rounded-lg shadow-lg space-y-6 w-full py-7 mb-10">
      <p className="text-2xl text-navy font-bold">Medical Record Information</p>
      <form className="form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="text-navy font-medium text-left">
              Name
            </label>
            <input
              id="name"
              className="address w-full border border-gray-300 bg-white text-gray-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter patient's name"
              disabled={!account}
              required
            />
          </div>
          <div>
            <label htmlFor="ic" className="text-navy font-medium text-left">
              IC
            </label>
            <input
              type="text"
              className="address w-full border border-gray-300 bg-white text-gray-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal"
              id="ic"
              name="ic"
              value={ic}
              onChange={(e) => setIc(e.target.value)}
              placeholder="Enter patient's IC"
              disabled={!account}
              required
            />
          </div>
          <div>
            <label
              htmlFor="medicalHistory"
              className="text-navy font-medium text-left"
            >
              Medical History
            </label>
            <input
              type="text"
              className="address w-full border border-gray-300 bg-white text-gray-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal"
              id="medicalHistory"
              name="medicalHistory"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              placeholder="Enter patient's medical history"
              disabled={!account}
              required
            />
          </div>
          <div>
            <label
              htmlFor="currentMedications"
              className="text-navy font-medium text-left"
            >
              Current Medications
            </label>
            <input
              type="text"
              className="address w-full border border-gray-300 bg-white text-gray-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal"
              id="currentMedications"
              name="currentMedications"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
              placeholder="Enter current medications"
              disabled={!account}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn bg-teal text-white font-light py-2 px-7 rounded-lg mt-4"
          disabled={loading || !account}
        >
          {loading ? "Uploading..." : "Upload Medical Record"}
        </button>
      </form>
    </div>
  );
};

export default MedicalRecordUpload;
