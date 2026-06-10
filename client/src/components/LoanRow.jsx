export default function LoanRow({ loan, onReturn }) {
  const borrowedAt = new Date(loan.borrowedAt).toLocaleString();
  const returnedAt = loan.returnedAt ? new Date(loan.returnedAt).toLocaleString() : "—";

  return (
    <tr>
      <td>{loan.bookTitle}</td>
      <td>{loan.studentName}</td>
      <td>{loan.status}</td>
      <td>{borrowedAt}</td>
      <td>{returnedAt}</td>
      <td>
        {loan.status === "active" ? (
          <button type="button" onClick={() => onReturn?.(loan.id)}>
            Return
          </button>
        ) : (
          "—"
        )}
      </td>
    </tr>
  );
}
