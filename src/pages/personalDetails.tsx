import React, { useState } from "react";
import {
  Box,
  Typography,
  InputLabel,
  Button as MuiButton,
  keyframes,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useSavePersonalDetailsMutation } from "../store/services/baseApi";
import Logo from "../assets/logo.jpeg";
import {
  GlassCard,
  ModernButton,
  ModernInput,
  ModernProgressBar,
  ModernModal,
  ModernSpinner,
} from "../components/ui";

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
`;

interface LoginPageProps {
  onSubmitApplication: (formData: PersonalDetailsForm) => void;
  onGoBack: () => void;
}

interface PersonalDetailsForm {
  address: string;
  document?: string;
  id: string;
}

const PersonalDetails: React.FC<LoginPageProps> = ({
  onSubmitApplication,
  onGoBack,
}) => {
  const [formData, setFormData] = useState<PersonalDetailsForm>({
    address: "",
    id: "",
  });
  const [fileName, setFileName] = useState<string>("");
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
    isSuccess?: boolean;
  }>({ open: false, message: "", title: undefined, isSuccess: false });

  const [savePersonalDetails, { isLoading }] = useSavePersonalDetailsMutation();

  const handleTextChange =
    (field: keyof PersonalDetailsForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        let base64String = reader.result as string;
        if (base64String.startsWith("data:image/png;base64,")) {
          base64String = base64String.substring(base64String.indexOf(",") + 1);
        }
        setFormData({
          ...formData,
          document: base64String,
        });
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    const loanId = localStorage.getItem("loanId");
    e.preventDefault();

    const formDataToSubmit = {
      address: formData.address,
      idNumber: formData.id,
      frontImageBase64: formData.document || "string",
      backImageBase64: formData.document || "string",
      loanId: loanId || "",
      frontImageExtension: "png",
      backImageExtension: "png",
    };

    try {
      savePersonalDetails(formDataToSubmit)
        .unwrap()
        .then((response) => {
          if (response?.data?.maxLoanEligible) {
            localStorage.setItem(
              "maxLoanEligible",
              response.data.maxLoanEligible.toString()
            );
          }
          setModal({
            open: true,
            message: "Personal details submitted successfully!",
            title: "Success",
            isSuccess: true,
          });
        })
        .catch((error) => {
          let errorMessage =
            "Failed to submit personal details. Please try again.";
          if (error?.data?.message) {
            errorMessage = error.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          setModal({
            open: true,
            message: errorMessage,
            title: "Submission Failed",
            isSuccess: false,
          });
        });
    } catch (error) {
      setModal({
        open: true,
        message: "An unexpected error occurred. Please try again.",
        title: "Error",
        isSuccess: false,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 15s ease infinite`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          animation: `${floatAnimation} 6s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "20%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
          animation: `${floatAnimation} 8s ease-in-out infinite reverse`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          animation: `${pulseAnimation} 4s ease-in-out infinite`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Left Panel - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          position: "relative",
          zIndex: 1,
        }}
      >
        <GlassCard
          sx={{
            p: 6,
            textAlign: "center",
            maxWidth: "500px",
            backdropFilter: "blur(20px)",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              boxShadow: "0 10px 40px rgba(102, 126, 234, 0.4)",
            }}
          >
            <PersonIcon sx={{ fontSize: 40, color: "white" }} />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "white",
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Personal Details
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.9)",
              mb: 4,
              fontWeight: 300,
            }}
          >
            Help us know you better
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              { icon: <SecurityIcon />, text: "Secure" },
              { icon: <VerifiedUserIcon />, text: "Verified" },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: "30px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box sx={{ color: "white", display: "flex" }}>{item.icon}</Box>
                <Typography
                  variant="body2"
                  sx={{ color: "white", fontWeight: 500 }}
                >
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </GlassCard>
      </Box>

      {/* Right Panel - Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          p: { xs: 2, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: "16px",
              background: "rgba(255,255,255,0.9)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              style={{ width: "120px", height: "auto", borderRadius: "8px" }}
            />
          </Box>
          <ModernButton
            variant="outline"
            startIcon={<ArrowBackIcon />}
            onClick={onGoBack}
            sx={{
              borderColor: "rgba(255,255,255,0.5)",
              color: "white",
              backdropFilter: "blur(10px)",
              "&:hover": {
                borderColor: "white",
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Go Back
          </ModernButton>
        </Box>

        {/* Form Card */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "500px",
            width: "100%",
            mx: "auto",
          }}
        >
          <GlassCard sx={{ p: { xs: 3, md: 4 } }}>
            {/* Progress Bar */}
            <Box sx={{ mb: 4 }}>
              <ModernProgressBar currentStep={3} steps={4} />
            </Box>

            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Personal Information
            </Typography>
            <Typography
              sx={{
                color: "#64748b",
                mb: 4,
                fontSize: "1rem",
              }}
            >
              Please provide your personal details to continue
            </Typography>

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <ModernInput
                  label="Residential Address"
                  value={formData.address}
                  onChange={handleTextChange("address")}
                  required
                  multiline
                  rows={3}
                  placeholder="Enter your full residential address"
                  startIcon={<HomeIcon />}
                />

                <ModernInput
                  label="ID Number"
                  value={formData.id}
                  onChange={handleTextChange("id")}
                  required
                  placeholder="Enter your ID number"
                  startIcon={<BadgeIcon />}
                />

                {/* Document Upload */}
                <Box>
                  <InputLabel
                    sx={{
                      color: "#334155",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    Upload Document (ID Card, Passport, or Driver's License)
                  </InputLabel>
                  <input
                    type="file"
                    id="document-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="document-upload" style={{ display: "block" }}>
                    <MuiButton
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        height: 56,
                        background: "#F8FAFC",
                        border: "2px dashed #CBD5E1",
                        borderRadius: 3,
                        color: fileName ? "#334155" : "#64748b",
                        textTransform: "none",
                        fontSize: "1rem",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "#F1F5F9",
                          borderColor: "#667eea",
                        },
                      }}
                    >
                      {fileName || "Choose File"}
                    </MuiButton>
                  </label>
                </Box>

                {/* Submit Button */}
                <Box sx={{ mt: 2 }}>
                  <ModernButton
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                      height: 56,
                      fontSize: "1.1rem",
                      fontWeight: 600,
                    }}
                  >
                    {isLoading ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <ModernSpinner size="sm" />
                        <span>Processing...</span>
                      </Box>
                    ) : (
                      "Continue"
                    )}
                  </ModernButton>
                </Box>
              </Box>
            </Box>
          </GlassCard>
        </Box>
      </Box>

      {/* Modal */}
      <ModernModal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        type={modal.isSuccess ? "success" : "error"}
        primaryAction={{
          label: modal.isSuccess ? "Continue" : "Try Again",
          onClick: () => {
            if (modal.isSuccess) {
              onSubmitApplication(formData);
            } else {
              setModal({ ...modal, open: false });
            }
          },
        }}
      >
        <Typography sx={{ color: "#64748b", textAlign: "center" }}>
          {modal.message}
        </Typography>
      </ModernModal>
    </Box>
  );
};

export default PersonalDetails;
