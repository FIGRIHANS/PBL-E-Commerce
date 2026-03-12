import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import {
  Truck,
  CalendarDays,
  FileText,
  ImageIcon,
  MapPin,
  Clock,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ShippingInfoProps {
  pengiriman?: {
    id_pengiriman: number;
    id_detail_pembelian: number;
    nomor_resi: string;
    tanggal_pengiriman: string;
    bukti_pengiriman: string;
    catatan_pengiriman?: string;
    created_at: string;
    updated_at: string;
  };
  address: {
    nama_penerima: string;
    no_telepon: string;
    alamat_lengkap: string;
    kode_pos: string;
    district: { name: string };
    regency: { name: string };
    province: { name: string };
  };
  shippingMethod?: string;
  notes?: string | null;
  showBukti?: boolean;
}

export function ShippingInfo({
  pengiriman,
  address,
  shippingMethod,
  notes,
  showBukti = true,
}: ShippingInfoProps) {
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Add null check for pengiriman
  if (!pengiriman) return null;

  const imageUrl = pengiriman.bukti_pengiriman
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/${pengiriman.bukti_pengiriman}`
    : null;

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <Truck className="h-4 w-4 text-[#F79E0E]" />
          </div>
          <span className="font-medium">Informasi Pengiriman</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="flex-1 space-y-4">
            {/* Shipping Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-50/40 p-3 rounded-lg border border-orange-100/50">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <FileText className="h-3.5 w-3.5 text-[#F79E0E]" />
                  Nomor Resi
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 tracking-wide">
                    {pengiriman.nomor_resi}
                  </p>
                  <Button
                    variant="link"
                    className="text-[#F79E0E] text-xs p-0 h-auto"
                    onClick={() => {
                      // Add tracking functionality here
                      window.open(
                        `https://cekresi.com/?noresi=${pengiriman.nomor_resi}`,
                        "_blank"
                      );
                    }}
                  >
                    Lacak
                  </Button>
                </div>
              </div>

              <div className="bg-orange-50/40 p-3 rounded-lg border border-orange-100/50">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                  <CalendarDays className="h-3.5 w-3.5 text-[#F79E0E]" />
                  Tanggal Pengiriman
                </div>
                <p className="text-sm text-gray-900">
                  {formatDate(pengiriman.tanggal_pengiriman, true)}
                </p>
              </div>
            </div>

            {/* Address Information with updated styling */}
            <div className="mt-3 bg-white border border-orange-100 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 text-[#F79E0E]" />
                <span>Alamat Pengiriman</span>
              </div>
              <div className="space-y-1">
                <p className="font-medium text-gray-900">
                  {address.nama_penerima}
                </p>
                <p className="text-sm text-gray-600">{address.no_telepon}</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {address.alamat_lengkap}, {address.district.name},{" "}
                  {address.regency.name}, {address.province.name},{" "}
                  {address.kode_pos}
                </p>
              </div>
            </div>

            {/* Shipping Method with icon */}
            {shippingMethod && (
              <div className="mt-3 bg-white border border-orange-100 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock className="h-4 w-4 text-[#F79E0E]" />
                  <span>Metode Pengiriman</span>
                </div>
                <p className="text-sm text-gray-700">{shippingMethod}</p>
              </div>
            )}

            {/* Notes */}
            {notes && (
              <div className="mt-3 bg-white border border-orange-100 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Catatan:</p>
                <p className="text-sm text-gray-700 leading-relaxed">{notes}</p>
              </div>
            )}
          </div>

          {/* Shipping Proof - Only show if showBukti is true */}
          {showBukti && imageUrl && (
            <div className="w-24">
              <div
                className="aspect-[3/4] relative rounded-lg overflow-hidden border border-orange-100 
                         cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => setIsImageOpen(true)}
              >
                <img
                  src={imageUrl}
                  alt="Bukti Pengiriman"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-xs px-2 py-1"
                  >
                    <ImageIcon className="h-3 w-3 mr-1" />
                    Lihat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Image Preview Dialog */}
      <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
        <DialogContent className="max-w-3xl">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Bukti Pengiriman"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
