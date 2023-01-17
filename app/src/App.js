import { ethers } from "ethers";
import { useEffect, useState, useRef } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const providerRef = useRef(
    new ethers.providers.Web3Provider(window.ethereum)
  );
  const signerRef = useRef(null);
  const arbiterRef = useRef(null);
  const beneficiaryRef = useRef(null);
  const weiRef = useRef(null);

  useEffect(() => {
    (async function getAccounts() {
      const provider = providerRef.current;
      await provider.send("eth_requestAccounts", []);
      signerRef.current = provider.getSigner();
    })();
  }, []);

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input ref={arbiterRef} type="text" />
        </label>

        <label>
          Beneficiary Address
          <input ref={beneficiaryRef} type="text" />
        </label>

        <label>
          Deposit Amount (in Wei)
          <input ref={weiRef} type="text" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );

  async function newContract() {
    const signer = signerRef.current;
    const beneficiary = beneficiaryRef.current.value;
    const arbiter = arbiterRef.current.value;
    const value = ethers.BigNumber.from(weiRef.current.value);

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      approved: false,
      handleApprove: async (address) => {
        escrowContract.on("Approved", () => {
          const approvedEscrowIndex = escrows.findIndex(
            (escrow) => escrow.address === address
          );
          setEscrows([
            ...escrows.slice(0, approvedEscrowIndex),
            {
              ...escrows[approvedEscrowIndex],
              approved: true,
            },
            ...escrows.slice(approvedEscrowIndex + 1),
          ]);
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }
}

export default App;
