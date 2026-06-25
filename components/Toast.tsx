"use client";

export default function Toast({
  message,
  type = "success",
  onClose
}: {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}) {
  if (!message) return null;

  return (
    <div className={`viltrum-toast ${type}`}>
      <span>{type === "success" ? "✓" : type === "error" ? "!" : "i"}</span>
      <p>{message}</p>
      <button onClick={onClose}>×</button>
    </div>
  );
}
