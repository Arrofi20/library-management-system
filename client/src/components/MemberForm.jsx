import { useEffect, useState } from "react";

export default function MemberForm({ member, onSave, onCancel, error, success }) {
  const [form, setForm] = useState({
    name: "",
    memberId: "",
    email: "",
    password: "",
    memberActive: "Active"
  });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        memberId: member.memberId,
        email: member.email,
        password: "",
        memberActive: member.memberActive ? "Active" : "Inactive"
      });
      setLocalError("");
      return;
    }

    setForm({ name: "", memberId: "", email: "", password: "", memberActive: "Active" });
    setLocalError("");
  }, [member]);

  function update(field, value) {
    setLocalError("");
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();

    if (!member && !form.password.trim()) {
      setLocalError("Password is required for new members.");
      return;
    }

    const payload = {
      name: form.name,
      memberId: form.memberId,
      email: form.email,
      memberActive: form.memberActive === "Active"
    };

    if (form.password.trim()) {
      payload.password = form.password;
    }

    onSave(payload);
  }

  return (
    <form className="panel form" onSubmit={submit}>
      <div className="panel-heading">
        <h2>{member ? "Edit member" : "Add member"}</h2>
        <span>{member ? "Update student member details" : "Create a new student member"}</span>
      </div>
      {localError ? <p className="alert">{localError}</p> : error ? <p className="alert">{error}</p> : null}
      {success ? <p className="alert" style={{ background: "#e1f3fb", borderColor: "#b6e0f4", color: "#176b87" }}>{success}</p> : null}
      <label>
        Name
        <input value={form.name} onChange={(event) => update("name", event.target.value)} required />
      </label>
      <label>
        Member ID
        <input value={form.memberId} onChange={(event) => update("memberId", event.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
      </label>
      <label>
        Password
        <input
          type="password"
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          placeholder={member ? "Leave blank to keep current password" : "Set a password"}
          {...(!member ? { required: true } : {})}
        />
      </label>
      <label>
        Status
        <select value={form.memberActive} onChange={(event) => update("memberActive", event.target.value)}>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </label>
      <div className="form-actions">
        <button className="primary" type="submit">
          {member ? "Update member" : "Save member"}
        </button>
        {member ? (
          <button type="button" onClick={onCancel}>
            Discard changes
          </button>
        ) : null}
      </div>
    </form>
  );
}
