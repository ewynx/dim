import { useRef } from "react";
import { parseEmail } from "../lib/parseEmail";

type Props = {
  onParsed: (inputs: any) => void;
};

export default function ZkEmailTest({ onParsed }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const text = await file.text();
    const parsed = await parseEmail(text);
    console.log("Parsed inputs:", parsed);
    onParsed(parsed);
  };

  return (
    <div>
      <h2>zkEmail Test</h2>
      <input type="file" ref={fileInputRef} />
      <button onClick={handleFile}>Parse Email</button>
    </div>
  );
}
