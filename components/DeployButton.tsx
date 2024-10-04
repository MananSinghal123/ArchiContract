import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import idl from "../../solana-backend/solana-backend/target/idl/basic_template.json"; // Your smart contract's IDL
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

const deployContract = async (wallet) => {
  try {
    // Connect to the Solana cluster (network)
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Create an Anchor provider with the connected wallet
    const provider = new AnchorProvider(connection, wallet, {
      preflightCommitment: "processed",
    });

    // Get the program ID (your contract) from the IDL file
    const programId = new PublicKey(idl.metadata.address);

    // Load the program using IDL
    const program = new Program(idl, programId, provider);

    // Deploy a new contract instance or perform an action (depending on your smart contract's logic)
    const transaction = await program.rpc.initialize({});

    // Send the transaction to the blockchain
    console.log("Transaction successful:", transaction);
  } catch (err) {
    console.error("Error deploying contract:", err);
  }
};

export const DeployButton = () => {
  const wallet = useWallet();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDeploy = async () => {
    if (!wallet || !wallet.publicKey) {
      alert("Please connect your wallet first");
      return;
    }
    await deployContract(wallet);
  };

  if (!isClient) {
    return null; // Prevent rendering on the server
  }

  return <button onClick={handleDeploy}>Deploy Contract</button>;
};
