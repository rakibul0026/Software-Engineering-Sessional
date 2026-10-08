import RawHtmlPage from "../components/RawHtmlPage";

const html = `<div class="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-2xl mt-10">
    <h2 class="text-2xl font-bold text-center mb-4">Scan Book QR</h2>
    
    <div id="reader" class="overflow-hidden rounded-xl bg-black"></div>
    
    <div id="result" class="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg hidden text-center font-medium">
        Scanning...
    </div>
</div>`;

export default function ScannerPage() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
