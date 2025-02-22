import { EAS, SchemaEncoder, NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env.local" });

// Configuration
const easContractAddress = process.env.EAS_CONTRACT_ADDRESS || "";
const schemaUID = process.env.SCHEMA_UID || "";

// Initialize EAS
const eas = new EAS(easContractAddress);

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
eas.connect(signer);

// Function to create an attestation
export async function createAttestation(recipient: string, id: string, stakedCount: number, isPro: boolean) {
  try {
    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("string id, uint256 stakedCount, bool isPro");
    const encodedData = schemaEncoder.encodeData([
      { name: "id", value: id, type: "string" },
      { name: "stakedCount", value: stakedCount, type: "uint256" },
      { name: "isPro", value: isPro, type: "bool" },
    ]);

    // Create the attestation
    const tx = await eas.attest({
      schema: schemaUID,
      data: {
        recipient: recipient, // Address of the recipient
        expirationTime: NO_EXPIRATION, // No expiration
        revocable: true, // Attestation is revocable
        data: encodedData,
      },
    });

    // Wait for the transaction to be mined
    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);

    return newAttestationUID;
  } catch (error) {
    console.error("Error creating attestation:", error);
    throw error;
  }
}