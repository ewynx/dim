import { ethers } from "ethers"

const PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY!
const RPC_URL = process.env.RPC_URL!

const provider = new ethers.JsonRpcProvider(RPC_URL)
const wallet = new ethers.Wallet(PRIVATE_KEY, provider)

export async function POST(req: Request) {
  try {
    const { nullifier } = await req.json()

    if (!nullifier || typeof nullifier !== "string") {
      return new Response("Invalid nullifier", { status: 400 })
    }

    console.log("Received nullifier:", nullifier)
    console.log("Admin address:", wallet.address)

    // TODO

    return new Response(JSON.stringify({
      success: true,
      message: "Nullifier received and wallet ready",
      adminAddress: wallet.address
    }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (err) {
    console.error("Error in backend:", err)
    return new Response("Internal Error", { status: 500 })
  }
}
