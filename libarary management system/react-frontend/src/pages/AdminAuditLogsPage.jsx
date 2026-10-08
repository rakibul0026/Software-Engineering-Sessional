import { useState, useEffect } from "react";
import {
  getAuditLogs,
  getAuditLogsByUser,
  getAllStaff,
  listenToAuditLogs
} from "../lib/adminDatabaseService";

/**
 * AdminAuditLogsPage - View and filter admin activity logs
 * Shows how to:
 * - Fetch audit logs from database
 * - Filter logs by staff member
 * - Listen to real-time audit log updates
 * - Display comprehensive audit trail
 */
export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStaffId, setFilterStaffId] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsub = listenToAuditLogs((liveData) => {
      // Apply filter if selected
      if (filterStaffId) {
        const filtered = liveData.filter(log => log.performedBy === filterStaffId);
        setLogs(filtered);
      } else {
        setLogs(liveData);
      }
    });

    setUnsubscribe(() => unsub);

    return () => {
      if (unsub) unsub();
    };
  }, [filterStaffId]);

  // Load staff and initial logs
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [staffData, logsData] = await Promise.all([
        getAllStaff(),
        getAuditLogs(100)
      ]);

      setStaff(staffData);
      setLogs(logsData);
      setError(null);
    } catch (err) {
      setError("Failed to load data: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle staff filter change
  const handleFilterChange = async (staffId) => {
    setFilterStaffId(staffId);

    if (staffId) {
      // Load logs for specific staff
      try {
        const logsData = await getAuditLogsByUser(staffId, 100);
        setLogs(logsData);
      } catch (err) {
        setError("Failed to filter logs: " + err.message);
      }
    } else {
      // Load all logs
      try {
        const logsData = await getAuditLogs(100);
        setLogs(logsData);
      } catch (err) {
        setError("Failed to load logs: " + err.message);
      }
    }
  };

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get action badge color
  const getActionColor = (action) => {
    const colors = {
      add_: "color-success",
      update_: "color-warning",
      delete_: "color-danger",
      login: "color-info",
      export: "color-info"
    };

    for (const [key, color] of Object.entries(colors)) {
      if (action.includes(key)) return color;
    }

    return "color-default";
  };

  // Get status badge color
  const getStatusColor = (status) => {
    return status === "success" ? "status-success" : "status-failed";
  };

  return (
    <div className="admin-audit-logs-page">
      <h1>Audit Logs</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-section">
        <label>Filter by Staff:</label>
        <select
          value={filterStaffId || ""}
          onChange={(e) => handleFilterChange(e.target.value || null)}
        >
          <option value="">All Staff</option>
          {staff.map(staffMember => (
            <option key={staffMember.id} value={staffMember.id}>
              {staffMember.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading audit logs...</div>
      ) : (
        <div className="logs-table">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Staff Member</th>
                <th>Action</th>
                <th>Target Type</th>
                <th>Target ID</th>
                <th>Status</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => {
                const staffMember = staff.find(s => s.id === log.performedBy);
                return (
                  <tr key={log.id}>
                    <td className="timestamp">{formatDate(log.timestamp)}</td>
                    <td>{staffMember?.name || log.performedBy}</td>
                    <td>
                      <span className={`badge ${getActionColor(log.action)}`}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>{log.targetType}</td>
                    <td className="target-id">{log.targetId}</td>
                    <td>
                      <span className={`status ${getStatusColor(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="ip-address">{log.ipAddress || "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {logs.length === 0 && !loading && (
        <div className="empty-state">No audit logs found</div>
      )}

      <div className="logs-info">
        <p>Total logs displayed: <strong>{logs.length}</strong></p>
        <small>Note: Real-time updates enabled. New logs will appear automatically.</small>
      </div>
    </div>
  );
}
