import { SchemaRegistry } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config({ path: "../../../.env.local" });

// Configuration constants
const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

async function registerSchema() {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
    schemaRegistry.connect(signer);

    const schema = "uint256 stakedCount, bool isPro";
    const revocable = true; // A flag allowing an attestation to be revoked

    const transaction = await schemaRegistry.register({
      schema,
      revocable,
    });

    await transaction.wait();
    console.log("New Schema Created", transaction);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

registerSchema();
