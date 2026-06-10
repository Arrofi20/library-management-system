export default function RequestRow({ request, onApprove, onReject }) {
  return (
    <tr>
      <td>{request.bookTitle}</td>
      <td>{request.studentName}</td>
      <td>{request.status}</td>
      <td>{new Date(request.requestedAt).toLocaleString()}</td>
      <td>{request.rejectedNote || "—"}</td>
      <td>
        <button type="button" onClick={() => onApprove(request.id)}>
          Approve
        </button>
        <button type="button" onClick={() => onReject(request.id)}>
          Reject
        </button>
      </td>
    </tr>
  );
}
