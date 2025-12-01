import React, { useState } from "react";
import {
  Box,
  Typography,
  InputLabel,
  Button as MuiButton,
  keyframes,
  Chip,
  Container,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BadgeIcon from "@mui/icons-material/Badge";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSavePersonalDetailsMutation } from "../store/services/baseApi";
import Logo from "../assets/logo.jpeg";
import {
  GlassCard,
  ModernButton,
  ModernInput,
  ModernProgressBar,
  ModernModal,
  AnimatedBackground,
} from "../components/ui";

const float1 = keyframes`
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(2deg); }
  75% { transform: translateY(10px) rotate(-2deg); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-25px) scale(1.05); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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

  const features = [
    {
      icon: <SecurityIcon sx={{ fontSize: 24 }} />,
      title: "Secure",
      description: "256-bit encryption",
    },
    {
      icon: <VerifiedUserIcon sx={{ fontSize: 24 }} />,
      title: "Verified",
      description: "ID verification",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background */}
      <AnimatedBackground variant="dark" />

      {/* Left Panel - Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 6,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Floating decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: "15%",
            left: "10%",
            width: 80,
            height: 80,
            borderRadius: "24px",
            background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
            opacity: 0.2,
            animation: `${float1} 6s ease-in-out infinite`,
            transform: "rotate(15deg)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
            opacity: 0.2,
            animation: `${float2} 8s ease-in-out infinite`,
          }}
        />

        <Box
          sx={{
            textAlign: "center",
            maxWidth: "480px",
            animation: `${fadeInUp} 0.8s ease-out`,
          }}
        >
          {/* Person Icon */}
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: "28px",
              background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 4,
              boxShadow: "0 20px 40px rgba(0, 168, 89, 0.3)",
            }}
          >
            <PersonIcon sx={{ fontSize: 50, color: "#fff" }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontSize: { lg: "2.75rem", xl: "3.25rem" },
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.2,
              mb: 2,
              textShadow: "0 4px 30px rgba(0,0,0,0.3)",
            }}
          >
            Personal Information
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontWeight: 400,
              mb: 5,
              lineHeight: 1.6,
            }}
          >
            Help us know you better. Your information is safe and secure with us.
          </Typography>

          {/* Feature Cards */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {features.map((feature, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  flex: "1 1 140px",
                  maxWidth: "180px",
                  transition: "all 0.3s ease",
                  animation: `${fadeInUp} 0.8s ease-out ${0.2 + idx * 0.1}s backwards`,
                  "&:hover": {
                    transform: "translateY(-5px)",
                    background: "rgba(255,255,255,0.1)",
                    borderColor: "rgba(0, 168, 89, 0.5)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #00A859 0%, #00C96A 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    mb: 2,
                    mx: "auto",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    mb: 0.5,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.85rem",
                  }}
                >
                  {feature.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Form Section */}
      <Box
        sx={{
          flex: { xs: 1, lg: "0 0 560px" },
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          background: { 
            xs: "transparent", 
            lg: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)" 
          },
          backdropFilter: { xs: "none", lg: "blur(20px)" },
          borderLeft: { xs: "none", lg: "1px solid rgba(255,255,255,0.2)" },
        }}
      >
        <Container maxWidth="sm" sx={{ py: 4, flex: 1, display: "flex", flexDirection: "column" }}>
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
                p: 1.5,
                borderRadius: "16px",
                background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0, 168, 89, 0.1)",
              }}
            >
              <img
                src={Logo}
                alt="Logo"
                style={{ width: "100px", height: "auto", borderRadius: "8px" }}
              />
            </Box>
            <ModernButton
              variant="outline"
              onClick={onGoBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                borderColor: { xs: "rgba(255,255,255,0.5)", lg: "#00A859" },
                color: { xs: "#fff", lg: "#00A859" },
                "&:hover": {
                  background: { xs: "rgba(255,255,255,0.1)", lg: "rgba(0, 168, 89, 0.05)" },
                  borderColor: { xs: "#fff", lg: "#008847" },
                },
              }}
            >
              Back
            </ModernButton>
          </Box>

          {/* Main Card */}
          <GlassCard
            variant="elevated"
            sx={{
              flex: 1,
              p: { xs: 3, sm: 4 },
              display: "flex",
              flexDirection: "column",
              background: { xs: "rgba(255,255,255,0.95)", lg: "#fff" },
              border: "1px solid rgba(0, 168, 89, 0.08)",
              animation: `${fadeInUp} 0.6s ease-out`,
            }}
          >
            {/* Progress */}
            <Box sx={{ mb: 4 }}>
              <ModernProgressBar 
                steps={4} 
                currentStep={3} 
                stepLabels={["Details", "Verify", "Review", "Complete"]}
              />
            </Box>

            {/* Form Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Chip
                label="Step 3 of 4"
                sx={{
                  mb: 2,
                  background: "linear-gradient(135deg, rgba(0, 168, 89, 0.1) 0%, rgba(0, 201, 106, 0.1) 100%)",
                  color: "#00A859",
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  border: "1px solid rgba(0, 168, 89, 0.2)",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0F172A",
                  mb: 1,
                }}
              >
                Personal Details
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#64748B",
                  maxWidth: "300px",
                  mx: "auto",
                }}
              >
                Please provide your personal information to continue
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                flex: 1,
              }}
            >
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
                    startIcon={fileName ? <CheckCircleIcon /> : <CloudUploadIcon />}
                    sx={{
                      height: 56,
                      background: fileName ? "rgba(0, 168, 89, 0.05)" : "#F8FAFC",
                      border: fileName ? "2px solid #00A859" : "2px dashed #CBD5E1",
                      borderRadius: 3,
                      color: fileName ? "#00A859" : "#64748b",
                      textTransform: "none",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: fileName ? "rgba(0, 168, 89, 0.1)" : "#F1F5F9",
                        borderColor: "#00A859",
                      },
                    }}
                  >
                    {fileName || "Choose File"}
                  </MuiButton>
                </label>
              </Box>

              <Box sx={{ mt: "auto", pt: 3 }}>
                <ModernButton
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                  endIcon={!isLoading && <ArrowForwardIcon />}
                  glow
                  sx={{
                    py: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  Continue
                </ModernButton>
              </Box>
            </Box>
          </GlassCard>
        </Container>
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
        <Typography sx={{ color: "#475569", textAlign: "center" }}>
          {modal.message}
        </Typography>
      </ModernModal>
    </Box>
  );
};

export default PersonalDetails;
