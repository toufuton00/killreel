"use client";

export default function SuccessPage() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0a0a0f",
      color: "white",
      fontFamily: "'Orbitron', sans-serif",
      textAlign: "center",
      gap: "24px",
    }}>
      <div style={{ fontSize: "64px" }}>🎉</div>
      <h1 style={{ color: "#ff4655", fontSize: "28px" }}>KILLREEL Pro 登録完了！</h1>
      <p style={{ color: "#888", fontSize: "14px" }}>ありがとうございます。すべての機能が使えるようになりました。</p>
      <a href="/" style={{
        padding: "12px 32px",
        background: "#ff4655",
        borderRadius: "20px",
        color: "white",
        textDecoration: "none",
        fontSize: "14px",
      }}>
        アプリに戻る
      </a>
    </div>
  );
}