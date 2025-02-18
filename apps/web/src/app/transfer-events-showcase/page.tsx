import MintEvents from "@/components/mint-events";
import TransferEvents from "@/components/transfer-events";


export default function Events() {
  return (
    <div className="mx-6 flex flex-col gap-6">
        <MintEvents />
        <TransferEvents />
    </div>
  );
}
