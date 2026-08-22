import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Check,
  Loader2,
  Lock,
  ArrowRight,
  LucideIcon,
} from "lucide-react";
import {
  useUploadIDMutation,
  useUploadSignedOfferLetterMutation,
} from "../store/services/baseApi";
import { colors, radii, shadows, type } from "../theme";
import {
  Dropzone,
  PageShell,
  PrimaryButton,
  Receipt,
  Sheet,
  SheetTitle,
} from "../components/chrome";

const UploadOfferLetter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const [uploadDocument, { isLoading: isUploadingDocument }] =
    useUploadIDMutation();
  const [uploadSignedOfferLetter, { isLoading: isUploadingOfferLetter }] =
    useUploadSignedOfferLetterMutation();

  const isLoading = isUploadingDocument || isUploadingOfferLetter;

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or image file (JPG, PNG)");
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return;
    }

    setUploadFile(file);
    setError("");
  };

  const handleUpload = async () => {
    if (!uploadFile) return;

    // Get loan_id from query params, fallback to localStorage
    const loanId =
      searchParams.get("loan_id") || localStorage.getItem("loanId");
    if (!loanId) {
      setError("Loan ID not found. Please start the application process.");
      return;
    }

    console.log("Uploading file for loan ID:", loanId);

    try {
      // Step 1: Convert file to base64
      const base64String = await fileToBase64(uploadFile);
      // const fileExtension = getFileExtension(uploadFile);

      // Step 2: Upload document to get document ID
      const uploadDocResponse = await uploadDocument({
        documentName: uploadFile.name,
        base64String,
        fileExtension: "pdf",
      }).unwrap();

      console.log("Upload document response:", uploadDocResponse);

      if (!uploadDocResponse.data?.id) {
        throw new Error("Failed to upload document");
      }

      const documentId = uploadDocResponse.data.id;

      console.log("Obtained document ID:", {
        loanId,
        signedOfferLetterDocumentId: documentId,
      });

      // Step 3: Upload signed offer letter using document ID
      const response = await uploadSignedOfferLetter({
        loanId,
        signedOfferLetterDocumentId: documentId,
      }).unwrap();

      if (response.success) {
        setShowSuccess(true);
        setTimeout(() => {
          // Navigate or close after success
          window.location.href = "/";
        }, 3000);
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(
        err?.data?.message || "Failed to upload document. Please try again."
      );
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64String = result.includes(",")
          ? result.split(",")[1]
          : result;
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  /* Unused helper function - keeping for potential future use
  const getFileExtension = (file: File): string => {
    const fileNameParts = file.name.split(".");
    if (fileNameParts.length > 1) {
      return fileNameParts.pop()?.toLowerCase() || "";
    }
    const mimeToExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "application/pdf": "pdf",
    };
    return mimeToExt[file.type] || "";
  };
  */

  return (
    <>
      <PageShell
        step={4}
        showHelp
        aside={
          <Receipt
            title="This step"
            rows={[
              { label: "Document", value: uploadFile ? uploadFile.name : undefined },
              {
                label: "Size",
                value: uploadFile
                  ? `${(uploadFile.size / 1024).toFixed(0)}KB`
                  : undefined,
              },
              { label: "Status", value: uploadFile ? "Ready to submit" : undefined },
            ]}
            footer="Your signed letter is stored encrypted and attached to this application only."
          />
        }
      >
        <Sheet>
          <SheetTitle
            title="Upload your signed offer letter"
            subtitle="Please upload your signed loan offer letter to proceed with your application."
          />

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {(
              [
                { Icon: Lock, label: "Secure upload", value: "Bank-level encryption" },
                { Icon: FileText, label: "Accepted formats", value: "PDF, JPG, PNG" },
              ] as { Icon: LucideIcon; label: string; value: string }[]
            ).map(({ Icon, label, value }) => (
              <div
                key={label}
                style={{
                  flexGrow: 1,
                  minWidth: "200px",
                  display: "flex",
                  alignItems: "center",
                  gap: "13px",
                  padding: "14px 18px",
                  background: "#FBF7EC",
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: `${radii.lg - 2}px`,
                }}
              >
                <Icon size={19} strokeWidth={1.7} color={colors.secondary.main} />
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span
                    style={{
                      font: `500 12px/1 ${type.body}`,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: colors.text.muted,
                    }}
                  >
                    {label}
                  </span>
                  <span style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Dropzone
            file={uploadFile}
            onFile={handleFileSelect}
            onClear={() => setUploadFile(null)}
            error={error || undefined}
            title="Drag & drop your file here"
            caption="or click to browse from your device"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ font: `600 14px/1 ${type.body}`, color: colors.text.primary }}>
              Before you upload
            </span>
            <ul
              style={{
                margin: 0,
                padding: 0,
                listStyle: "none",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "10px 32px",
              }}
            >
              {[
                "Ensure all pages of the offer letter are included",
                "Make sure your signature is clear and visible",
                "File size should not exceed 10MB",
                "Accepted formats: PDF, JPG, PNG",
              ].map((tip) => (
                <li
                  key={tip}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "11px",
                    font: `400 13px/1.5 ${type.body}`,
                    color: colors.text.secondary,
                  }}
                >
                  <Check
                    size={15}
                    strokeWidth={2.4}
                    color={colors.secondary.main}
                    style={{ flexShrink: 0, marginTop: "3px" }}
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: "auto" }}>
            <PrimaryButton
              onClick={handleUpload}
              loading={isLoading}
              disabled={!uploadFile}
              icon={ArrowRight}
            >
              {isLoading ? "Uploading" : "Submit offer letter"}
            </PrimaryButton>
          </div>
        </Sheet>
      </PageShell>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "40px",
                maxWidth: "400px",
                width: "100%",
                boxShadow: shadows.xl,
                textAlign: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.secondary[500]} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  boxShadow: `0 8px 24px ${colors.success}40`,
                }}
              >
                <Check size={40} color="#fff" strokeWidth={3} />
              </motion.div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: colors.neutral[900],
                  marginBottom: "12px",
                }}
              >
                Upload Successful!
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: colors.neutral[600],
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                Your signed offer letter has been uploaded successfully. We'll
                review it and get back to you shortly.
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: colors.primary[600],
                  fontSize: "14px",
                }}
              >
                <Loader2
                  size={16}
                  style={{ animation: "spin 1s linear infinite" }}
                />
                Redirecting...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default UploadOfferLetter;
