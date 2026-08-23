import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CreditCard,
  Hash,
  ArrowRight,
  Search,
  Check,
  Lock,
} from "lucide-react";
import {
  useResentBVNOtpMutation,
  useSalaryReviewMutation,
  useSalaryReviewOTPMutation,
  useVerifyResendBVNOtpMutation,
  useGetBanksQuery,
} from "../store/services/baseApi";
import { brand, colors, radii, shadows, type } from "../theme";
import {
  Callout,
  Field,
  FieldRow,
  Modal,
  OtpInput,
  PageShell,
  PrimaryButton,
  Receipt,
  SelectField,
  Sheet,
  SheetTitle,
} from "./chrome";

const getBackendErrorMessage = (err: unknown): string | undefined => {
  if (err && typeof err === "object" && "data" in err) {
    return (err as { data?: { message?: string } }).data?.message;
  }
  return undefined;
};

const BankSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  banks: { code: string; name: string }[];
  isLoading?: boolean;
}> = ({ value, onChange, banks, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const safeBanks = useMemo(() => (Array.isArray(banks) ? banks : []), [banks]);
  const filteredBanks = useMemo(() => {
    if (!searchQuery) return safeBanks;
    return safeBanks.filter((bank) =>
      bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, safeBanks]);
  const selected = safeBanks.find((bank) => bank.code === value);

  return (
    <div style={{ position: "relative" }}>
      <SelectField
        label="Select bank"
        value={selected?.name || ""}
        placeholder={isLoading ? "Loading banks..." : "Select your bank"}
        icon={Building2}
        disabled={isLoading}
        open={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        hint="Your main bank account."
      />

      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 10 }}
          />
          <div
            role="listbox"
            style={{
              position: "absolute",
              top: "calc(100% - 22px)",
              left: 0,
              right: 0,
              zIndex: 11,
              background: colors.background.card,
              border: `1px solid ${colors.border.light}`,
              borderRadius: `${radii.md}px`,
              boxShadow: shadows.lg,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "12px", borderBottom: `1px solid ${colors.border.light}` }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  height: "44px",
                  padding: "0 14px",
                  background: colors.background.main,
                  border: `1px solid ${colors.border.light}`,
                  borderRadius: `${radii.sm}px`,
                }}
              >
                <Search size={17} strokeWidth={1.7} color={colors.text.muted} />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search banks..."
                  style={{
                    flexGrow: 1,
                    minWidth: 0,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    font: `400 15px/1 ${type.body}`,
                    color: colors.text.primary,
                  }}
                />
              </div>
            </div>

            <div style={{ maxHeight: "260px", overflowY: "auto" }}>
              {filteredBanks.length === 0 ? (
                <div
                  style={{
                    padding: "18px",
                    font: `400 14px/1.4 ${type.body}`,
                    color: colors.text.secondary,
                  }}
                >
                  No bank matches &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                filteredBanks.map((bank) => {
                  const isSelected = bank.code === value;
                  return (
                    <button
                      key={bank.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(bank.code);
                        setIsOpen(false);
                        setSearchQuery("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        width: "100%",
                        padding: "13px 16px",
                        border: "none",
                        background: isSelected ? brand.wash : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        font: `${isSelected ? 600 : 400} 15px/1.3 ${type.body}`,
                        color: colors.text.primary,
                      }}
                    >
                      {bank.name}
                      {isSelected && (
                        <Check size={17} strokeWidth={2.4} color={colors.secondary.main} />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface StatementReviewProps {
  onNext: () => void;
  onBack: () => void;
}

export const StatementReview: React.FC<StatementReviewProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [bvn, setBvn] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isOTP, setIsOTP] = useState<boolean>(false);
  const [resendOTP, setResendOTP] = useState<boolean>(false);
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [modal, setModal] = useState<{
    open: boolean;
    message: string;
    title?: string;
  }>({ open: false, message: "", title: undefined });

  const { data: banksData = [], isLoading: banksLoading } = useGetBanksQuery();

  const [salaryReview, { isLoading }] = useSalaryReviewMutation();
  const [salaryReviewOTP, { isLoading: verifyLoading }] =
    useSalaryReviewOTPMutation();
  const [resentBVNOtp, { isLoading: resendLoading }] =
    useResentBVNOtpMutation();
  const [, { isLoading: verifyResendLoading }] =
    useVerifyResendBVNOtpMutation();

  const isAnyLoading =
    isLoading || verifyLoading || resendLoading || verifyResendLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanId = localStorage.getItem("loanId");
    if (!selectedBank || !accountNumber || !bvn) {
      setModal({
        open: true,
        message: "Please fill in all fields.",
        title: "Missing Fields",
      });
      return;
    }
    try {
      const response = await salaryReview({
        bankCode: selectedBank,
        accountNo: accountNumber,
        bvn,
        loanId: loanId || "",
        identityType: "bvn",
      }).unwrap();
      if (response?.success) {
        localStorage.setItem("bvn", bvn);
        setIsOTP(true);
        setModal({
          open: true,
          message: "OTP sent to your phone. Please verify.",
          title: "OTP Sent",
        });
      } else {
        setResendOTP(true);
        setModal({
          open: true,
          message: response.message || "Failed to submit. Please try again.",
          title: "Error",
        });
      }
    } catch (err: unknown) {
      setResendOTP(true);
      const errorMessage =
        getBackendErrorMessage(err) || "Error submitting form. Please try again.";
      setModal({ open: true, message: errorMessage, title: "Error" });
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loanId = localStorage.getItem("loanId");
    if (!otp || otp.length !== 6) {
      setModal({
        open: true,
        message: "Please enter a valid 6-digit OTP.",
        title: "Invalid OTP",
      });
      return;
    }
    const response = await salaryReviewOTP({ loanId: loanId || "", otp });
    if (response.data?.success) {
      setOtpVerified(true);
      setModal({
        open: true,
        message: "OTP verified successfully.",
        title: "Success",
      });
    } else {
      setResendOTP(true);
      setOtp("");
      const errorMessage =
        (response?.error &&
          "data" in response.error &&
          (response.error as { data?: { message?: string } }).data?.message) ||
        "OTP verification failed.";
      setModal({ open: true, message: errorMessage, title: "Error" });
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resentBVNOtp({ bvn }).unwrap();
      if (response?.success) {
        setOtpVerified(false);
        setModal({
          open: true,
          message: response.message || "OTP resent successfully.",
          title: "OTP Resent",
        });
      } else {
        setModal({
          open: true,
          message: response.message || "Failed to resend OTP.",
          title: "Error",
        });
      }
    } catch (err: unknown) {
      const errorMessage =
        getBackendErrorMessage(err) || "Error resending OTP. Please try again.";
      setModal({
        open: true,
        message: errorMessage,
        title: "Error",
      });
    }
  };

  const bankName =
    (Array.isArray(banksData)
      ? banksData.find((b: { code: string; name: string }) => b.code === selectedBank)?.name
      : undefined) || "";

  return (
    <>
      <PageShell
        step={2}
        headerAction={{ label: "Go back", onClick: onBack }}
        aside={
          <Receipt
            rows={[
              { label: "Bank", value: bankName || undefined },
              {
                label: "Account number",
                value: accountNumber.length === 10 ? accountNumber : undefined,
              },
              {
                label: "BVN",
                value: bvn.length === 11 ? `•••••••${bvn.slice(-4)}` : undefined,
              },
              { label: "Verified", value: otpVerified ? "Yes" : undefined },
            ]}
            footer="Your data is secured with bank-level encryption."
          />
        }
      >
        <Sheet>
          <SheetTitle
            title="Which account should we review?"
            subtitle="Please provide your bank details for statement review."
          />

          <form
            onSubmit={isOTP ? handleOTPSubmit : handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "22px", flexGrow: 1 }}
          >
            <BankSelect
              value={selectedBank}
              onChange={setSelectedBank}
              banks={banksData}
              isLoading={banksLoading}
            />

            <FieldRow>
              <Field
                label="Account number"
                placeholder="Enter 10-digit account number"
                value={accountNumber}
                onChange={(v) => setAccountNumber(v.replace(/\D/g, "").slice(0, 10))}
                icon={CreditCard}
                inputMode="numeric"
                maxLength={10}
                hint="10 digits, no spaces."
              />
              <Field
                label="Bank verification number"
                placeholder="Enter 11-digit BVN"
                value={bvn}
                onChange={(v) => setBvn(v.replace(/\D/g, "").slice(0, 11))}
                icon={Hash}
                inputMode="numeric"
                maxLength={11}
                why="Why we ask"
                hint="Your BVN confirms your identity. It never lets us move money."
              />
            </FieldRow>

            {isOTP && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden" }}
              >
                <OtpInput
                  label="Enter the code we texted you"
                  value={otp}
                  onChange={setOtp}
                  hint="Sent to the phone number registered against your BVN."
                  action={
                    resendOTP
                      ? {
                          label: resendLoading ? "Resending..." : "Resend code",
                          onClick: handleResendOTP,
                          disabled: resendLoading,
                        }
                      : undefined
                  }
                />
              </motion.div>
            )}

            <Callout icon={Lock} title="Read-only access">
              devpay reads six months of account history to size your offer. The connection
              cannot move money, and you can revoke it from your bank at any time.
            </Callout>

            <div style={{ marginTop: "auto" }}>
              <PrimaryButton submit loading={isAnyLoading} icon={ArrowRight}>
                {isAnyLoading ? "Processing" : isOTP ? "Verify code" : "Continue"}
              </PrimaryButton>
            </div>
          </form>
        </Sheet>
      </PageShell>
      <Modal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ ...modal, open: false })}
        onAction={() => {
          if (otpVerified) {
            onNext();
          } else {
            setModal({ ...modal, open: false });
          }
        }}
      />
    </>
  );
};

export default StatementReview;
