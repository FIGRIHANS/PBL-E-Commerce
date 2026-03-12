import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface StatusUpdateDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  status: string;
  notes: string;
  setNotes: (notes: string) => void;
  onUpdateStatus: () => void;
}

export default function StatusUpdateDialog({
  isOpen,
  setIsOpen,
  status,
  notes,
  setNotes,
  onUpdateStatus,
}: StatusUpdateDialogProps) {
  // Get status badge color based on order status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Menunggu Pembayaran":
        return "bg-yellow-100 text-yellow-800";
      case "Dibayar":
        return "bg-blue-100 text-blue-800";
      case "Diproses":
        return "bg-indigo-100 text-indigo-800";
      case "Dikirim":
        return "bg-purple-100 text-purple-800";
      case "Selesai":
        return "bg-green-100 text-green-800";
      case "Dibatalkan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Order Status</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to change the order status to{" "}
            <Badge className={getStatusBadgeColor(status)}>{status}</Badge>. 
            This action might affect the order workflow and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Admin Notes (optional)
          </label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this status change..."
            className="mt-1"
            rows={3}
          />
          
          {status === "Dibayar" && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
              This will update the order status to <strong>Dibayar</strong>, indicating that payment has been confirmed.
            </div>
          )}
          
          {status === "Diproses" && (
            <div className="mt-4 p-3 bg-indigo-50 text-indigo-800 rounded-md text-sm">
              This indicates the seller is processing the order and preparing for shipment.
            </div>
          )}
          
          {status === "Dikirim" && (
            <div className="mt-4 p-3 bg-purple-50 text-purple-800 rounded-md text-sm">
              This indicates the order has been shipped to the customer.
            </div>
          )}
          
          {status === "Selesai" && (
            <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md text-sm">
              This will finalize the order and mark it as completed.
            </div>
          )}
          
          {status === "Dibatalkan" && (
            <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
              This will cancel the order. Any payment status may also be affected.
            </div>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onUpdateStatus}
            className={status === "Selesai" ? "bg-green-600 hover:bg-green-700" : 
                      status === "Dibatalkan" ? "bg-red-600 hover:bg-red-700" : ""}
          >
            Update Status
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
