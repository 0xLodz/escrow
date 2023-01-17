export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
  approved,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <div
          className="button"
          onClick={(e) => {
            e.preventDefault();

            handleApprove(address);
          }}
        >
          Approve
        </div>
        {approved && <div>✓ It's been approved!</div>}
      </ul>
    </div>
  );
}
