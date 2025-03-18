import { API_URL } from './api';

const IPFS_GATEWAYS = [
  "https://ipfs.io/ipfs/",
  "https://ipfs.filebase.io/ipfs/",
  "https://crustwebsites.net/ipfs/"
];

async function fetchFromIPFS(cid) {
  for (let gateway of IPFS_GATEWAYS) {
    try {
      console.log(`Attempting to fetch from gateway: ${gateway}`);
      const response = await fetch(`${gateway}${cid}`);
      if (!response.ok) {
        console.warn(`Gateway ${gateway} failed with status: ${response.status}`);
        continue;
      }
      return await response.blob();
    } catch (error) {
      console.error(`Error with gateway ${gateway}:`, error);
    }
  }
  throw new Error("Failed to fetch PDF from all IPFS gateways");
}

export const getIPFSUrl = (cid) => {
  return `https://ipfs.io/ipfs/${cid}`;
};

export const downloadContractPDF = async (contractId) => {
  try {
    console.log("Fetching contract details for ID:", contractId);
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Contract response:", data);

    if (!data.contract) {
      throw new Error("No contract found with this ID");
    }

    const contract = data.contract;
    if (!contract.cids || contract.cids.length === 0) {
      throw new Error("Contract has no PDF CIDs");
    }

    const latestCID = contract.cids[contract.cids.length - 1];
    console.log("Latest CID:", latestCID);

    try {
      const pdfBlob = await fetchFromIPFS(latestCID);
      
      // Create a download link
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract_${contractId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return latestCID;
    } catch (ipfsError) {
      console.error("Failed to fetch PDF from IPFS:", ipfsError);
      throw new Error("Failed to download PDF from IPFS. Please try again later.");
    }
  } catch (error) {
    console.error("Error downloading contract:", error);
    throw error;
  }
};

// Update expired contracts
export const updateContractStatusToExpired = async () => {
  try {
    console.log("Updating expired contracts...");
    const response = await fetch(`${API_URL}/contracts/updateContractStatusToExpired`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Expired contracts updated successfully:", data);
    return data;
  } catch (error) {
    console.error("Error updating expired contracts:", error);
    throw error;
  }
};

export const viewContractOnIPFS = async (contractId) => {
  try {
    console.log("Fetching contract details for ID:", contractId);
    const response = await fetch(`${API_URL}/contracts/${contractId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Contract response:", data);

    if (!data.contract) {
      throw new Error("No contract found with this ID");
    }

    const contract = data.contract;
    if (!contract.cids || contract.cids.length === 0) {
      throw new Error("Contract has no PDF CIDs");
    }

    const latestCID = contract.cids[contract.cids.length - 1];
    console.log("Latest CID:", latestCID);

    // Try to fetch the PDF from IPFS
    try {
      const pdfBlob = await fetchFromIPFS(latestCID);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
    } catch (ipfsError) {
      console.error("Failed to fetch PDF from IPFS:", ipfsError);
      throw new Error("Failed to fetch PDF from IPFS. Please try again later.");
    }
  } catch (error) {
    console.error("Error viewing contract:", error);
    throw error;
  }
}; 