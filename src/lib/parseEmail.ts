import { generateEmailVerifierInputs } from "../zkEmail/input-generators";

export async function parseEmail(emailText: string) {
  try {
    const emailInputs = await generateEmailVerifierInputs(emailText);

    // Convert string arrays to appropriate types
    const header = emailInputs.emailHeader.map(Number); // u8 array
    const pubkey = emailInputs.pubkey.map(BigInt); // Field array
    const signature = emailInputs.signature.map(BigInt); // Field array

    const to_header_sequence = {
      index: 0, // TODO: update when actual indices are known
      length: emailInputs.emailHeader.length
    };

    const to_address_sequence = {
      index: 0, // TODO: update when actual indices are known
      length: 10
    };

    const event_id = 1;
    console.log("Final inputs to return:", {
      header,
      pubkey,
      signature,
      to_header_sequence,
      to_address_sequence,
      event_id,
    });
    return {
      header,
      pubkey,
      signature,
      to_header_sequence,
      to_address_sequence,
      event_id
    };
  } catch (err) {
    console.error("Failed to parse email:", err);
    throw err;
  }
}
