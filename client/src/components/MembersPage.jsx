import { useEffect, useState } from "react";
import { createMember, getMembers, updateMember } from "../api/members";
import MemberForm from "./MemberForm";

export default function MembersPage() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    loadMembers();
  }, []);

  function loadMembers() {
    setLoading(true);
    setError("");
    getMembers()
      .then((result) => {
        setMembers(result.members);
      })
      .catch(() => {
        setError("Members could not load. Check the API connection and try again.");
      })
      .finally(() => setLoading(false));
  }

  function handleSave(payload) {
    setFormError("");
    setFormSuccess("");

    const action = selectedMember ? updateMember(selectedMember.id, payload) : createMember(payload);

    action
      .then((result) => {
        setFormSuccess(selectedMember ? "Member updated." : "Member added.");
        setSelectedMember(null);
        loadMembers();
      })
      .catch((error) => {
        setFormError(error.message);
      });
  }

  function handleEdit(member) {
    setFormError("");
    setFormSuccess("");
    setSelectedMember(member);
  }

  function handleCancel() {
    setFormError("");
    setFormSuccess("");
    setSelectedMember(null);
  }

  function toggleActive(member) {
    setError("");
    setFormSuccess("");
    updateMember(member.id, { memberActive: !member.memberActive })
      .then(() => {
        setFormSuccess(member.memberActive ? "Member deactivated." : "Member reactivated.");
        loadMembers();
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <section className="book-page-grid">
      <div>
        <h1 className="page-title">Members</h1>
        {loading ? (
          <p className="loading">Loading members...</p>
        ) : error ? (
          <p className="alert">{error}</p>
        ) : (
          <>
            <p>{members.length} members found</p>
            <div className="table-wrapper">
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Member ID</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.memberId}</td>
                      <td>{member.email}</td>
                      <td>{member.memberActive ? "Active" : "Inactive"}</td>
                      <td>
                        <button type="button" onClick={() => handleEdit(member)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => toggleActive(member)}>
                          {member.memberActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <MemberForm
        member={selectedMember}
        onSave={handleSave}
        onCancel={handleCancel}
        error={formError}
        success={formSuccess}
      />
    </section>
  );
}
