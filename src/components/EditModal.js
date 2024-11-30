import React, { useState, useEffect } from "react";

function EditModal({ show, onClose, log, onSave }) {
  const [newNote, setNewNote] = useState(log?.note || ""); // Track new note

  // Update newNote when log changes
  useEffect(() => {
    if (log) {
      setNewNote(log.note || ""); // Reset to the original note when modal is opened for a new log
    }
  }, [log]);

  if (!show) return null;

  const handleSave = () => {
    if (newNote !== log.note) {
      onSave(log, newNote); // Pass the new note to the parent component
    }
    onClose();
  };

  return (
    <div className="modal-simple">
      <div className="modal-box">
        <h5>Edit Description</h5>
        <textarea
          className="form-control"
          rows="4"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)} // Track changes
        ></textarea>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;