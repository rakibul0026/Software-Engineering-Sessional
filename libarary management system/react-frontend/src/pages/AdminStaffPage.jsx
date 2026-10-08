import { useState, useEffect } from "react";
import {
  getAllStaff,
  addStaff,
  updateStaff,
  deleteStaff,
  logAdminAction
} from "../lib/adminDatabaseService";

/**
 * AdminStaffPage - Manages library staff members
 * Shows how to:
 * - Fetch staff from database
 * - Add new staff member
 * - Update staff details
 * - Delete staff member
 * - Log all actions to audit trail
 */
export default function AdminStaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "moderator",
    department: ""
  });
  const [editingId, setEditingId] = useState(null);

  // Load staff on component mount
  useEffect(() => {
    loadStaff();
  }, []);

  // Fetch staff from Firebase
  const loadStaff = async () => {
    setLoading(true);
    try {
      const staffData = await getAllStaff();
      setStaff(staffData);
      setError(null);
    } catch (err) {
      setError("Failed to load staff: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new staff member
  const handleAddStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newStaff = await addStaff(formData);
      
      // Log action to audit trail
      await logAdminAction({
        action: "add_staff",
        performedBy: "current_user_id", // Replace with actual user ID
        targetType: "staff",
        targetId: newStaff.id,
        changes: newStaff,
        status: "success"
      });

      setStaff(prev => [...prev, newStaff]);
      setFormData({ name: "", email: "", role: "moderator", department: "" });
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError("Failed to add staff: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update staff member
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStaff(editingId, formData);
      
      // Log action to audit trail
      await logAdminAction({
        action: "update_staff",
        performedBy: "current_user_id", // Replace with actual user ID
        targetType: "staff",
        targetId: editingId,
        changes: formData,
        status: "success"
      });

      setStaff(prev =>
        prev.map(s => s.id === editingId ? { ...s, ...formData } : s)
      );
      setFormData({ name: "", email: "", role: "moderator", department: "" });
      setEditingId(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError("Failed to update staff: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete staff member
  const handleDeleteStaff = async (staffId) => {
    if (!confirm("Are you sure you want to delete this staff member?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteStaff(staffId);
      
      // Log action to audit trail
      await logAdminAction({
        action: "delete_staff",
        performedBy: "current_user_id", // Replace with actual user ID
        targetType: "staff",
        targetId: staffId,
        changes: { deleted: true },
        status: "success"
      });

      setStaff(prev => prev.filter(s => s.id !== staffId));
      setError(null);
    } catch (err) {
      setError("Failed to delete staff: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Edit staff member
  const handleEditStaff = (staffMember) => {
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      role: staffMember.role,
      department: staffMember.department
    });
    setEditingId(staffMember.id);
    setShowForm(true);
  };

  return (
    <div className="admin-staff-page">
      <h1>Staff Management</h1>

      {error && <div className="error-message">{error}</div>}

      <button
        onClick={() => {
          setShowForm(!showForm);
          setEditingId(null);
          setFormData({ name: "", email: "", role: "moderator", department: "" });
        }}
        className="btn-primary"
      >
        {showForm ? "Cancel" : "Add New Staff"}
      </button>

      {showForm && (
        <form onSubmit={editingId ? handleUpdateStaff : handleAddStaff} className="staff-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter staff name"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              placeholder="Enter department"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Saving..." : editingId ? "Update Staff" : "Add Staff"}
          </button>
        </form>
      )}

      {loading && !showForm && <div className="loading">Loading...</div>}

      <div className="staff-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(staffMember => (
              <tr key={staffMember.id}>
                <td>{staffMember.name}</td>
                <td>{staffMember.email}</td>
                <td>{staffMember.role}</td>
                <td>{staffMember.department || "-"}</td>
                <td>
                  <span className={`status ${staffMember.status}`}>
                    {staffMember.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleEditStaff(staffMember)}
                    className="btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStaff(staffMember.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {staff.length === 0 && !loading && (
        <div className="empty-state">No staff members found</div>
      )}
    </div>
  );
}
