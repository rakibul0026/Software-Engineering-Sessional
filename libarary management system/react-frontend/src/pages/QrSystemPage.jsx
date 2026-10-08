import RawHtmlPage from "../components/RawHtmlPage";

const html = `<header class="no-print">
        <h1>Book QR Inventory</h1>
        <p>Print these codes and attach them to physical books.</p>
        <button style="padding: 10px 20px; cursor: pointer;">Print All Codes</button>
    </header>

    <div class="qr-grid">
        <div class="qr-card">
            
            
            </span>
        </div>
    </div>

    <div class="no-print" style="text-align: center; margin-top: 50px;">
    </div>`;

export default function QrSystemPage() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
