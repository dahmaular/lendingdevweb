import React, { useState } from "react";
import "./login.css";
import peopleBg from "../assets/people.svg";
import ProgressBar from "../components/ProgressBar";
import {
  useOnboarding1Mutation,
  useResendEmailOtpMutation,
  useVerifyOtpMutation,
  useVerifyResendEmailOtpMutation,
} from "../store/services/baseApi";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { EMPLOYERS } from "./personalDetails";

import SearchIcon from "@mui/icons-material/Search";
import {
  OnboardingResponse,
  VerifyOtpResponse,
} from "../types/loanApplication";

interface LoginPageProps {
  onLogin: (email: string, bvn: string, dob: string) => void;
  onGoBack: () => void;
  onCreateAccount: () => void;
  onResetPassword: () => void;
}

interface PersonalDetailsForm {
  industry: string;
  employer: string;
  role: string;
  address: string;
  document?: File;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  onGoBack,
  onCreateAccount,
  onResetPassword,
}) => {
  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
  const [email, setEmail] = useState<string>("");
  const [dob, setDob] = useState<Date>(eighteenYearsAgo);
  const [bvn, setBvn] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [employer, setEmployer] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayedEmployers, setDisplayedEmployers] = useState<
    { id: string; name: string }[]
  >(EMPLOYERS.slice(0, 100));
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
  }>({ open: false, message: "", title: undefined });

  const [onboarding1, { isLoading, isError, error, data }] =
    useOnboarding1Mutation();

  const [loadingState, setLoadingState] = useState<boolean>(false);

  const [formData, setFormData] = useState<PersonalDetailsForm>({
    industry: "",
    employer: "",
    role: "",
    address: "",
  });
  const [loanId, setLoanId] = useState<string>("");
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [
    verifyOtp,
    { isLoading: verifyLoading, isError: verifyIsError, error: verifyError },
  ] = useVerifyOtpMutation();

  const [resendEmailOtp, { isLoading: resendLoading, data: resendData }] =
    useResendEmailOtpMutation();
  const [
    verifyResendEmailOtp,
    { isLoading: verifyResendLoading, data: verifyResendData },
  ] = useVerifyResendEmailOtpMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingState(true);

    if (!email || !firstName || !lastName) {
      setModal({
        open: true,
        message: "Please fill in all fields.",
        title: "Missing Fields",
      });
      return;
    }

    if (isLoading || loadingState) {
      setModal({
        open: true,
        message: "Processing, please wait...",
        title: "Please Wait",
      });
      return;
    }
    console.log({
      email,
      employer,
      firstName,
      lastName,
      productId: "372e9a1d-c714-4fc2-b44a-3eeb8ebda4c1",
    });

    try {
      const response = await onboarding1({
        email,
        employer,
        firstName,
        lastName,
        productId: "372e9a1d-c714-4fc2-b44a-3eeb8ebda4c1",
      }).unwrap();

      console.log("Onboarding Response:", response);
      if (response.success) {
        setLoanId(response?.data?.loanId);
        localStorage.setItem("loanId", response?.data?.loanId || ""); // Save to localStorage
        setModal({
          open: true,
          message:
            response?.message ||
            "Onboarding successful. Please check your email for the OTP.",
          title: "Onboarding Success",
        });
        setLoadingState(false);
        // Proceed to OTP verification step
        setIsOTP(true);
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
      setResendOTP(true);
      setOtp("");
      setModal({
        open: true,
        message:
          data?.message ||
          "An error occurred during onboarding. Please try again.",
        title: "Onboarding Error",
      });
      setLoadingState(false);
      return;
    }
    // if (isError) {
    //   setModal({
    //     open: true,
    //     message: `Error: ${
    //       typeof error === "object" && error && "message" in error
    //         ? (error as any).message
    //         : "An error occurred"
    //     }`,
    //     title: "Onboarding Error",
    //   });
    //   return;
    // }

    // setTimeout(() => {
    //   setIsOTP(true);
    //   setLoadingState(false);
    // }, 3000);
  };

  const handleSelectChange =
    (field: keyof PersonalDetailsForm) => (e: SelectChangeEvent) => {
      setFormData({
        ...formData,
        [field]: e.target.value,
      });
    };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // onLogin(email, bvn, dob.toDateString());
    if (!otp || otp.length !== 6) {
      setModal({
        open: true,
        message: "Please enter a valid 6-digit OTP.",
        title: "Invalid OTP",
      });
      return;
    }
    if (verifyLoading) {
      setModal({
        open: true,
        message: "Processing, please wait...",
        title: "Please Wait",
      });
      return;
    }
    console.log("Loan ID:", {
      loanId: loanId,
      otp: otp,
    });
    const response = await verifyOtp({
      loanId: loanId,
      otp: otp,
    });

    console.log("Verify OTP Response:", response);
    if (response.data?.success) {
      // OTP verification successful
      setOtpVerified(true);
      setModal({
        open: true,
        message: "OTP verified successfully.",
        title: "Success",
      });
    } else {
      // OTP verification failed
      console.error("OTP verification failed:", response);
      setResendOTP(true);
      setOtp("");
      setModal({
        open: true,
        message:
          (response?.error &&
            typeof response.error === "object" &&
            "data" in response.error &&
            (response.error as any)?.data?.message) ||
          (response?.error &&
            typeof response.error === "object" &&
            "message" in response.error &&
            (response.error as any)?.message) ||
          "OTP verification failed.",
        title: "Error",
      });
    }
  };

  const handleResendOTP = async () => {
    // setResendLoading(true);
    const loanId = localStorage.getItem("loanId") || "";
    try {
      const response = await resendEmailOtp({
        loanId: loanId,
      }).unwrap();
      if (response?.success) {
        setResendOTP(false);
        setIsOTP(true);
        setOtpVerified(false);
        setModal({
          open: true,
          message:
            response.message ||
            "OTP resent successfully. Please check your email.",
          title: "OTP Resent",
        });
      } else {
        setModal({
          open: true,
          message:
            response.message || "Failed to resend OTP. Please try again.",
          title: "Resend Failed",
        });
      }
    } catch (error: any) {
      setModal({
        open: true,
        message:
          resendData?.message || "Error resending OTP. Please try again.",
        title: "Resend Error",
      });
    }
  };

  const handleVerifyResendOTP = async () => {
    console.log("Verifying Resend OTP...");
    try {
      const response = await verifyResendEmailOtp({
        email: email,
        otp: otp,
      }).unwrap();
      if (response?.success) {
        setIsOTP(true);
        setModal({
          open: true,
          message: "OTP resent successfully. Please check your email.",
          title: "OTP Resent",
        });
      } else {
        setModal({
          open: true,
          message:
            response.message || "Failed to resend OTP. Please try again.",
          title: "Resend Failed",
        });
      }
    } catch (error: any) {
      setModal({
        open: true,
        message:
          verifyResendData?.message || "Error resending OTP. Please try again.",
        title: "Resend Error",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <div className="logo-container">
          {/* <img src={spectraLogo} alt="Spectra Logo" className="logo" /> */}
          <h1 className="logo-text">deVpay</h1>
        </div>
        <div className="illustration-container">
          <img src={peopleBg} alt="Business People" className="illustration" />
        </div>
      </div>

      <div className="login-right-panel">
        <div className="back-button-container">
          <button className="back-button" onClick={onGoBack}>
            <span className="back-icon">‹</span>
            <span>Go Back</span>
          </button>
        </div>

        <div className="login-form-container">
          <ProgressBar currentStep={1} />
          <div className="login-header">
            <h1>Get Started</h1>
            <p>Complete the application form to get started.</p>
          </div>

          <form
            onSubmit={isOTP ? handleOTPSubmit : handleSubmit}
            className="login-form"
          >
            <FormControl fullWidth sx={{ width: "100%" }}>
              <InputLabel id="employer-select-label">Employer</InputLabel>
              <Select
                labelId="employer-select-label"
                id="employer-select"
                value={employer}
                label="Employer"
                onChange={(e: SelectChangeEvent<string>) => {
                  setEmployer(e.target.value);
                  handleSelectChange("employer")(e);
                }}
                required
                sx={{
                  height: "48px",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "8px",
                  width: "100%",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "& .MuiSelect-select": {
                    padding: "12px 16px",
                    fontSize: "16px",
                  },
                }}
                className="form-input"
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 450,
                      maxWidth: "40%",
                    },
                  },
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "left",
                  },
                  onClose: () => {
                    setSearchQuery("");
                    setDisplayedEmployers(EMPLOYERS.slice(0, 100));
                  },
                }}
                displayEmpty
              >
                <ListSubheader sx={{ p: 0 }}>
                  <TextField
                    size="small"
                    autoFocus
                    placeholder="Search employers..."
                    value={searchQuery}
                    sx={{
                      width: "calc(100% - 16px)",
                      m: 1,
                      mb: 1,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    onChange={(e) => {
                      const query = e.target.value.toLowerCase();
                      setSearchQuery(query);
                      if (query) {
                        const filtered = EMPLOYERS.filter((emp) =>
                          emp.name.toLowerCase().includes(query)
                        );
                        setDisplayedEmployers(filtered.slice(0, 100));
                      } else {
                        setDisplayedEmployers(EMPLOYERS.slice(0, 100));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") {
                        e.stopPropagation();
                      }
                    }}
                  />
                </ListSubheader>
                {displayedEmployers.map((employer) => (
                  <MenuItem
                    key={employer.id}
                    value={employer.id}
                    sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
                  >
                    {employer.name}
                  </MenuItem>
                ))}
                {displayedEmployers.length === 0 && (
                  <MenuItem disabled>No matching employers found</MenuItem>
                )}
                {searchQuery === "" &&
                  displayedEmployers.length === 100 &&
                  EMPLOYERS.length > 100 && (
                    <MenuItem
                      sx={{ justifyContent: "center", color: "primary.main" }}
                      onClick={() => {
                        setDisplayedEmployers(EMPLOYERS);
                      }}
                    >
                      Load all employers ({EMPLOYERS.length})
                    </MenuItem>
                  )}
              </Select>
            </FormControl>
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <div className="password-input-container">
                <input
                  type="text"
                  id="firstname"
                  placeholder="Enter First Name"
                  value={firstName}
                  onChange={(e) => {
                    if (e.target.value.length <= 11) {
                      setFirstName(e.target.value);
                    }
                  }}
                  required
                  className="form-input"
                  // maxLength={11}
                  // pattern="[0-9]{11}"
                />
              </div>
              <div className="password-input-container">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  placeholder="Enter Last Name"
                  value={lastName}
                  onChange={(e) => {
                    if (e.target.value.length <= 11) {
                      setLastName(e.target.value);
                    }
                  }}
                  required
                  className="form-input"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Date of Birth</label>
              <input
                type="date"
                id="dob"
                placeholder="dd/mm/yyyy"
                value={dob.toISOString().split("T")[0]}
                onChange={(e) => setDob(new Date(e.target.value))}
                required
                className="form-input"
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="bvn">BVN</label>
              <div className="password-input-container">
                <input
                  type="number"
                  id="bvn"
                  placeholder="Enter BVN"
                  value={bvn}
                  onChange={(e) => {
                    if (e.target.value.length <= 11) {
                      setBvn(e.target.value);
                    }
                  }}
                  required
                  className="form-input"
                  maxLength={11}
                  pattern="[0-9]{11}"
                />
              </div>
            </div> */}

            {isOTP && (
              <div className="form-group">
                <label htmlFor="bvn">Email OTP</label>
                <div className="password-input-container">
                  <input
                    type="number"
                    id="otp"
                    placeholder="Enter the OTP sent to your Email"
                    value={otp}
                    onChange={(e) => {
                      if (e.target.value.length <= 6) {
                        setOtp(e.target.value);
                      }
                    }}
                    required
                    className="form-input"
                    maxLength={6}
                    pattern="[0-9]{6}"
                  />
                </div>
              </div>
            )}

            {resendOTP && (
              <div style={{ marginTop: "8px" }}>
                <span
                  style={{
                    color: resendLoading ? "#aaa" : "#1976d2",
                    textDecoration: "underline",
                    cursor: resendLoading ? "not-allowed" : "pointer",
                    fontWeight: 500,
                    fontSize: "15px",
                  }}
                  onClick={() => {
                    if (!resendLoading) {
                      handleResendOTP();
                    }
                  }}
                >
                  {resendLoading
                    ? "Resending..."
                    : "Didn’t get the OTP? Resend."}
                </span>
              </div>
            )}
            <div className="form-group">
              {isLoading ||
              loadingState ||
              verifyLoading ||
              resendLoading ||
              verifyResendLoading ? (
                <button
                  type="submit"
                  className="login-button"
                  disabled
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Spinner size={22} />
                </button>
              ) : (
                <button type="submit" className="login-button">
                  {!isOTP ? "Get started" : "Submit"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Modal
        open={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        title={modal.title}
        actions={
          <button
            className="login-button"
            onClick={() => {
              if (otpVerified) {
                window.location.href = "/statement-review";
              } else {
                setModal({ ...modal, open: false });
              }
            }}
          >
            Ok, got it
          </button>
        }
      >
        {modal.message}
      </Modal>
    </div>
  );
};

export default LoginPage;
