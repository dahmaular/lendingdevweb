import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Check,
  Loader2,
  FileCheck,
  AlertCircle,
  Trash2,
  Sparkles,
  Shield,
} from "lucide-react";
import {
  useUploadIDMutation,
  useUploadSignedOfferLetterMutation,
} from "../store/services/baseApi";
import { colors, shadows } from "../theme";
import Logo from "../assets/devpay-logo.png";

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.neutral[50]} 50%, ${colors.secondary[50]} 100%)`,
    padding: "24px",
  } as React.CSSProperties,

  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "800px",
    margin: "0 auto",
    width: "100%",
  } as React.CSSProperties,

  card: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "48px",
    boxShadow: shadows.xl,
    border: `1px solid ${colors.neutral[200]}`,
    width: "100%",
  } as React.CSSProperties,

  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
  } as React.CSSProperties,

  uploadZone: {
    border: `3px dashed ${colors.neutral[300]}`,
    borderRadius: "20px",
    padding: "60px 40px",
    textAlign: "center" as const,
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: colors.neutral[50],
    position: "relative" as const,
    overflow: "hidden" as const,
  } as React.CSSProperties,

  uploadZoneActive: {
    borderColor: colors.primary[500],
    background: `linear-gradient(135deg, ${colors.primary[50]} 0%, ${colors.secondary[50]} 100%)`,
    transform: "scale(1.02)",
    boxShadow: `0 0 0 4px ${colors.primary[100]}`,
  } as React.CSSProperties,

  uploadZoneDragOver: {
    borderColor: colors.secondary[500],
    background: `linear-gradient(135deg, ${colors.secondary[50]} 0%, ${colors.primary[50]} 100%)`,
    borderStyle: "solid" as const,
  } as React.CSSProperties,

  filePreview: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    border: `2px solid ${colors.primary[200]}`,
    marginTop: "24px",
  } as React.CSSProperties,

  button: {
    width: "100%",
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: 600,
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
    color: "#fff",
    boxShadow: shadows.md,
  } as React.CSSProperties,

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  } as React.CSSProperties,
};

const UploadOfferLetter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "32px" }}
        >
          <img
            src={Logo}
            alt="devpay"
            style={{ width: "132px", height: "auto", display: "block" }}
          />
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={styles.card}
        >
          {/* Header */}
          <div style={styles.header}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "20px",
                background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: `0 8px 24px ${colors.primary[200]}`,
              }}
            >
              <FileCheck size={40} color="#fff" />
            </motion.div>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: colors.neutral[900],
                marginBottom: "12px",
              }}
            >
              Upload Signed Offer Letter
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: colors.neutral[600],
                lineHeight: 1.6,
              }}
            >
              Please upload your signed loan offer letter to proceed with your
              application
            </p>
          </div>

          {/* Info Boxes */}
          <div style={{ display: "flex", gap: "16px", marginBottom: "32px" }}>
            <div
              style={{
                flex: 1,
                padding: "16px",
                background: colors.primary[50],
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: `1px solid ${colors.primary[200]}`,
              }}
            >
              <Shield
                size={20}
                color={colors.primary[600]}
                style={{ flexShrink: 0 }}
              />
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: colors.neutral[600],
                    margin: 0,
                  }}
                >
                  Secure Upload
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: colors.neutral[800],
                    margin: "2px 0 0",
                  }}
                >
                  Bank-level encryption
                </p>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: "16px",
                background: colors.secondary[50],
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                border: `1px solid ${colors.secondary[200]}`,
              }}
            >
              <FileText
                size={20}
                color={colors.secondary[600]}
                style={{ flexShrink: 0 }}
              />
              <div>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: colors.neutral[600],
                    margin: 0,
                  }}
                >
                  Accepted Formats
                </p>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: colors.neutral[800],
                    margin: "2px 0 0",
                  }}
                >
                  PDF, JPG, PNG
                </p>
              </div>
            </div>
          </div>

          {/* Upload Zone */}
          {!uploadFile && (
            <motion.div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{
                ...styles.uploadZone,
                ...(isDragging ? styles.uploadZoneDragOver : {}),
              }}
            >
              {/* Decorative background */}
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  right: "-50px",
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${colors.primary[100]} 0%, transparent 70%)`,
                  opacity: 0.5,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  left: "-30px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${colors.secondary[100]} 0%, transparent 70%)`,
                  opacity: 0.5,
                }}
              />

              <motion.div
                animate={{
                  y: isDragging ? -5 : [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: isDragging ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                style={{ position: "relative", zIndex: 1 }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <Upload size={36} color={colors.primary[600]} />
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    color: colors.neutral[800],
                    marginBottom: "8px",
                  }}
                >
                  {isDragging ? "Drop file here" : "Drag & drop your file here"}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: colors.neutral[500],
                    marginBottom: "20px",
                  }}
                >
                  or click to browse from your device
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 24px",
                    background: "#fff",
                    borderRadius: "10px",
                    border: `2px solid ${colors.primary[300]}`,
                    fontSize: "14px",
                    fontWeight: 600,
                    color: colors.primary[600],
                  }}
                >
                  <Sparkles size={16} />
                  Choose File
                </div>
              </motion.div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
              />
            </motion.div>
          )}

          {/* File Preview */}
          {uploadFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.filePreview}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                    background: `linear-gradient(135deg, ${colors.primary[100]} 0%, ${colors.secondary[100]} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FileText size={28} color={colors.primary[600]} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: colors.neutral[800],
                      marginBottom: "4px",
                    }}
                  >
                    {uploadFile.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "14px",
                      color: colors.neutral[500],
                      margin: 0,
                    }}
                  >
                    {formatFileSize(uploadFile.size)}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUploadFile(null);
                    setError("");
                  }}
                  style={{
                    background: colors.neutral[100],
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Trash2 size={20} color={colors.neutral[600]} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "16px",
                padding: "16px",
                background: colors.error + "15",
                borderRadius: "12px",
                border: `1px solid ${colors.error}30`,
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <AlertCircle size={20} color={colors.error} />
              <p
                style={{
                  fontSize: "14px",
                  color: colors.error,
                  margin: 0,
                }}
              >
                {error}
              </p>
            </motion.div>
          )}

          {/* Upload Button */}
          {uploadFile && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={handleUpload}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              style={{
                ...styles.button,
                marginTop: "24px",
                ...(isLoading ? styles.buttonDisabled : {}),
              }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={20}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Document
                </>
              )}
            </motion.button>
          )}

          {/* Tips */}
          <div
            style={{
              marginTop: "32px",
              padding: "20px",
              background: colors.neutral[50],
              borderRadius: "12px",
              borderLeft: `4px solid ${colors.primary[500]}`,
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: colors.neutral[700],
                marginBottom: "8px",
              }}
            >
              📋 Important Tips:
            </p>
            <ul
              style={{
                fontSize: "13px",
                color: colors.neutral[600],
                lineHeight: 1.8,
                margin: 0,
                paddingLeft: "20px",
              }}
            >
              <li>Ensure all pages of the offer letter are included</li>
              <li>Make sure your signature is clear and visible</li>
              <li>File size should not exceed 10MB</li>
              <li>Accepted formats: PDF, JPG, PNG</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Success Modal */}
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
    </div>
  );
};

export default UploadOfferLetter;
