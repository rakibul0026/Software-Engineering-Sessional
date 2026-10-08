import RawHtmlPage from "../components/RawHtmlPage";

const html = `<div class="admin-container">
        <div class="admin-header">
            <div class="breadcrumb">
                <span>/</span>
                <span><i class="fas fa-microchip"></i> RFID Management</span>
            </div>
            <h1><i class="fas fa-microchip"></i> RFID Tag Management</h1>
            <p>Manage and assign RFID tags to library books</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="label">Total RFID Tags</div>
            </div>
            <div class="stat-card">
                <div class="label">Active Tags</div>
            </div>
            <div class="stat-card">
                <div class="label">Assigned to Books</div>
            </div>
            <div class="stat-card">
                <div class="label">Unassigned Tags</div>
            </div>
        </div>

        <div id="alertContainer"></div>

        <div class="tabs">
            <button class="tab-button active" data-tab="assign">
                <i class="fas fa-link"></i> Assign Tags
            </button>
            <button class="tab-button" data-tab="manage">
                <i class="fas fa-cogs"></i> Manage Tags
            </button>
            <button class="tab-button" data-tab="create">
                <i class="fas fa-plus"></i> New Tag
            </button>
        </div>

        <!-- Assign Tab -->
        <div id="assign" class="tab-content active">
            <div class="card">
                <h2><i class="fas fa-link"></i> Assign RFID Tag to Book</h2>
                <form id="assignForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="bookSelect">Select Book *</label>
                            <select id="bookSelect" required>
                                <option value="">-- Choose a book --</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="tagSelect">Select RFID Tag *</label>
                            <select id="tagSelect" required>
                                <option value="">-- Choose an unassigned tag --</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-check"></i> Assign Tag
                    </button>
                </form>
            </div>

            <div class="alert alert-info">
                <i class="fas fa-info-circle"></i> No unassigned RFID tags available. Please create new tags first.
            </div>
        </div>

        <!-- Manage Tab -->
        <div id="manage" class="tab-content">
            <div class="card">
                <h2><i class="fas fa-cogs"></i> All RFID Tags</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Tag ID</th>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                    <span style="color: #999; font-style: italic;">Unassigned</span>
                            </td>
                            <td>
                                    -
                            </td>
                            <td>
                                </span>
                            </td>
                            <td>
                                </button>
                                    <i class="fas fa-trash"></i> Remove
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>No RFID Tags</h3>
                    <p>No RFID tags have been created yet. Create a new tag to get started.</p>
                </div>
            </div>
        </div>

        <!-- Create Tab -->
        <div id="create" class="tab-content">
            <div class="card">
                <h2><i class="fas fa-plus"></i> Create New RFID Tag</h2>
                <p style="color: #666; margin-bottom: 20px;">Add a new RFID tag to the system. Leave the book field empty if you'll assign it later.</p>
                <form id="createForm">
                    <div class="form-group">
                        <label for="newTagId">RFID Tag ID *</label>
                        <input type="text" id="newTagId" placeholder="Enter unique RFID tag identifier" required>
                        <small style="color: #999; display: block; margin-top: 5px;">This should match the physical tag's unique identifier</small>
                    </div>
                    <div class="form-group">
                        <label for="newBookSelect">Book (Optional)</label>
                        <select id="newBookSelect">
                            <option value="">-- Do not assign now --</option>
                        </select>
                    </div>
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-plus"></i> Create Tag
                    </button>
                </form>
            </div>
        </div>
    </div>`;

export default function AdminRfidTagsPage() {
  return (
    <div className="page-shell">
      <RawHtmlPage html={html} />
    </div>
  );
}
