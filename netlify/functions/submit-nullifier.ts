import { ethers } from "ethers"

const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY!
const RPC_URL = process.env.RPC_URL!

const provider = new ethers.JsonRpcProvider(RPC_URL)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

export const handler = async (event: any) => {
  try {
    const { nullifier } = JSON.parse(event.body!)

    if (!nullifier || typeof nullifier !== "string") {
      return {
        statusCode: 400,
        body: "Invalid nullifier"
      }
    }

    console.log("Received nullifier:", nullifier)
    console.log("Admin address:", wallet.address)

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Nullifier received",
        adminAddress: wallet.address
      })
    }
  } catch (err) {
    console.error("Backend error:", err)
    return {
      statusCode: 500,
      body: "Internal error"
    }
  }
}
