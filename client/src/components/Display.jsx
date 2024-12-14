import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch documents from the smart contract
  const fetchDocuments = async (address) => {
    let dataArray = [];
    try {
      setIsLoading(true);
      dataArray = await contract.displayDocuments(address);

      // Check if the response data is empty
      if (dataArray && dataArray.length > 0) {
        const str = dataArray.toString();
        const str_array = str.split(",");
        const imageList = str_array.map((item) =>
          item.startsWith("https://gateway.pinata.cloud/ipfs/")
            ? item.split("/").pop()
            : item
        );
        setData(imageList);
      } else {
        setData([]); // No documents found
      }
    } catch (e) {
      console.error(e);
      setData([]);
      toast.error("You don't have access to this data! display");
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically fetch documents for the user's account on component mount
  useEffect(() => {
    if (contract && account) {
      fetchDocuments(account); // Fetch documents for the current account
    }
  }, [contract, account]);

  const getData = async () => {
    const otherAddress = document.querySelector(".address").value;
    if (otherAddress) {
      await fetchDocuments(otherAddress); // Fetch documents for the specified address
    } else {
      await fetchDocuments(account); // Fetch documents for the current account
    }
  };

  return (
    <>
      <div className="top flex flex-col justify-center items-center bg-white p-7 rounded-lg shadow-lg space-y-6 w-full py-7 mb-10">
        <p className="text-2xl text-navy font-bold">Find Documents</p>

        <div className="image-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.length > 0 ? (
            data.map((hash, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg shadow-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() =>
                  setSelectedImage(`https://gateway.pinata.cloud/ipfs/${hash}`)
                }
                title={hash}
              >
                <p
                  className="text-gray-700 font-semibold truncate text-center w-full"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {hash}
                </p>
                <span className="text-navy mt-2">View Image</span>
              </div>
            ))
          ) : (
            <p>No images found</p>
          )}
        </div>

        <div className="flex w-full pt-5 justify-center items-center">
          <input
            type="text"
            placeholder="Enter Address"
            className="address w-full max-w-md border border-gray-300 bg-white text-gray-500 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-teal"
          />
          <button
            className="btn bg-teal text-white font-light py-2 px-7 rounded-lg ml-4"
            onClick={getData}
          >
            Get documents
          </button>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center mt-4">
            {/* Loading Spinner */}
            <div className="animate-spin rounded-full border-t-4 border-blue-500 border-solid h-8 w-8"></div>
          </div>
        )}

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            style={{ height: "100%" }}
          >
            <div className="bg-white p-5 rounded-lg shadow-lg">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto max-w-[80vw] max-h-[80vh] object-contain mb-4 rounded-lg"
              />
              <button
                className="btn bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                onClick={() => setSelectedImage(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast Container to Display Notifications */}
      <ToastContainer />
    </>
  );
};

export default Display;
