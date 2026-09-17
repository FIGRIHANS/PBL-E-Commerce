"use client";

import { useParams, useRouter } from "next/navigation";
import { useEditAddressForm } from "./hooks/useEditAddressForm";
import { EditAddressHeader } from "./components/EditAddressHeader";
import { EditFormCard } from "./components/EditFormCard";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) || "";

  const {
    formData,
    regionData,
    loading,
    error,
    success,
    updateFormData,
    submitForm,
  } = useEditAddressForm(id);

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <EditAddressHeader />

      {loading.data ? (
        <LoadingSkeleton />
      ) : (
        <EditFormCard
          formData={formData}
          regionData={regionData}
          loading={loading}
          error={error}
          success={success}
          onUpdateFormData={updateFormData}
          onSubmit={submitForm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
