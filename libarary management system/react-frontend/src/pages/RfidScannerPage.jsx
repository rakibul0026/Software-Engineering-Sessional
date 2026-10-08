import RawHtmlPage from "../components/RawHtmlPage";

const html = `<div class="rfid-container">
        <div class="rfid-header">
            <h1><i class="fas fa-microchip"></i> RFID Scanner</h1>
            <p>Scan RFID tags to issue or return books</p>
        </div>

        <div class="instructions">
            <h4><i class="fas fa-info-circle"></i> How to Use:</h4>
            <ul>
                <li>Place your RFID tag near the reader</li>
                <li>The system will automatically detect and process the tag</li>
                <li>Green indicator = Book issued/returned successfully</li>
                <li>Red indicator = Error or invalid tag</li>
            </ul>
        </div>

        <form id="rfidForm">
            <div class="rfid-input-group">
                <label for="rfidInput">
                    <i class="fas fa-tag"></i> RFID Tag ID
                </label>
                <input 
                    type="text" 
                    id="rfidInput" 
                    placeholder="Scan your RFID tag here..." 
                    autofocus
                    autocomplete="off"
                >
            </div>
        </form>

        <div id="rfidStatus" class="rfid-status">
            <h4 id="statusTitle">Processing...</h4>
            <p id="statusMessage"></p>
            <div id="bookDetails" class="book-details" style="display: none;"></div>
        </div>

        <div class="history-section">
            <h3><i class="fas fa-history"></i> Recent Actions</h3>
            <div id="historyContainer">
                <div class="history-empty">No recent scans</div>
            </div>
        </div>

        <div class="quick-links">
        </div>
    </div>`;

export default function RfidScannerPage() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
