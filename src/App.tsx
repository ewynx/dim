import { useState } from "react"
import { UltraHonkBackend } from "@aztec/bb.js"
import { Noir } from "@noir-lang/noir_js"
import { compile, createFileManager } from "@noir-lang/noir_wasm"
import main from "../public/circuit/src/main.nr?url";
import nargoToml from "../public/circuit/Nargo.toml?url";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

export async function getCircuit() {
  const fm = createFileManager("/");
  const mainRes = await fetch(main)
  const nargoRes = await fetch(nargoToml)
  
  if (!mainRes.body || !nargoRes.body) throw new Error("Failed to load files")
  
  fm.writeFile("./src/main.nr", mainRes.body)
  fm.writeFile("./Nargo.toml", nargoRes.body)
  return await compile(fm);
 }


export default function App() {
    const [logs, setLogs] = useState<string[]>([])
    const [proofOutput, setProofOutput] = useState<string | null>(null)

    function log(msg: string) {
        setLogs(l => [...l, msg])
    }

    async function handleSubmit(ageInput: string) {
        try {
            const age = parseInt(ageInput)
            if (isNaN(age)) {
                log("⚠️ Please enter a valid number")
                return
            }

            log("Compiling circuit...")
            const { program } = await getCircuit()
            const noir = new Noir(program)
            const backend = new UltraHonkBackend(program.bytecode)

            log("Generating witness...")
            const { witness } = await noir.execute({ age })
            log("Witness generated ✅")

            log("Generating proof...")
            const proof = await backend.generateProof(witness)
            log("Proof generated ✅")

            log("Verifying proof...")
            const isValid = await backend.verifyProof(proof)
            log(`Proof is ${isValid ? "✅ valid" : "❌ invalid"}`)

            setProofOutput(JSON.stringify(proof.proof))

            const res = await fetch("/.netlify/functions/submit-nullifier", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              // TODO make sure this is the correct pub signal
              body: JSON.stringify({ nullifier: proof.publicInputs[0] })
            })
            const data = await res.json()
            log(`TX sent ✅ Hash: ${data.txHash}`)
        } catch (err) {
            console.error(err)
            log("Oh 💔 Something broke")
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Noir Age Check</h1>
            <input
                type="number"
                placeholder="Enter age"
                onKeyDown={e => {
                    if (e.key === "Enter") handleSubmit((e.target as HTMLInputElement).value)
                }}
            />
            <button
                onClick={() => {
                    const input = document.querySelector("input") as HTMLInputElement
                    handleSubmit(input.value)
                }}
            >
                Submit Age
            </button>

            <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
                <div style={{ flex: 1, border: "1px solid black", padding: "1rem" }}>
                    <h2>Logs</h2>
                    {logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>
                <div style={{ flex: 1, border: "1px solid black", padding: "1rem" }}>
                    <h2>Proof</h2>
                    <code style={{ fontSize: "0.8rem", wordWrap: "break-word" }}>{proofOutput}</code>
                </div>
            </div>
        </div>
    )
}
