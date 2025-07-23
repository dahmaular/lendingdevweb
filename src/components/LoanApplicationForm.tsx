import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Container,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  Box,
} from "@mui/material";
import { LoanApplication } from "../types/loanApplication";
import { baseApi } from "../store/services/baseApi";
import ProgressBar from "./ProgressBar";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  amount: Yup.number()
    .required("Loan amount is required")
    .min(1000, "Minimum loan amount is 1000")
    .max(1000000, "Maximum loan amount is 1,000,000"),
  purpose: Yup.string().required("Loan purpose is required"),
  employmentStatus: Yup.string()
    .oneOf(["employed", "self-employed", "unemployed"])
    .required("Employment status is required"),
  monthlyIncome: Yup.number()
    .required("Monthly income is required")
    .min(0, "Monthly income must be positive"),
  loanTerm: Yup.number()
    .required("Loan term is required")
    .min(1, "Minimum term is 1 month")
    .max(60, "Maximum term is 60 months"),
});

const initialValues: LoanApplication = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  amount: 0,
  purpose: "",
  employmentStatus: "employed",
  monthlyIncome: 0,
  loanTerm: 12,
};

interface FormField {
  name: keyof LoanApplication;
  label: string;
  type?: string;
  half?: boolean;
  multiline?: boolean;
  rows?: number;
  select?: boolean;
  options?: Array<{ value: string; label: string }>;
}

interface LoanApplicationFormProps {
  onBack: () => void;
}

export const LoanApplicationForm: React.FC<LoanApplicationFormProps> = ({
  onBack,
}) => {
  const navigate = useNavigate();
  const [submitLoan] = baseApi.useSubmitLoanApplicationMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (
    values: LoanApplication,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const result = await submitLoan(values).unwrap();
      if (result.status === "pending") {
        navigate("/confirmation");
      } else {
        setErrorMessage(
          "Your application could not be processed at this time."
        );
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting your application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formFields: FormField[] = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      half: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      half: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      half: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "text",
      half: true,
    },
    {
      name: "amount",
      label: "Loan Amount",
      type: "number",
      half: true,
    },
    {
      name: "loanTerm",
      label: "Loan Term (months)",
      type: "number",
      half: true,
    },
    {
      name: "purpose",
      label: "Loan Purpose",
      type: "text",
      multiline: true,
      rows: 2,
      half: false,
    },
    {
      name: "employmentStatus",
      label: "Employment Status",
      select: true,
      half: true,
      options: [
        { value: "employed", label: "Employed" },
        { value: "self-employed", label: "Self Employed" },
        { value: "unemployed", label: "Unemployed" },
      ],
    },
    {
      name: "monthlyIncome",
      label: "Monthly Income",
      type: "number",
      half: true,
    },
  ];

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <ProgressBar currentStep={3} />
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          Loan Application
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {formFields.map((field) => (
                  <Box
                    key={field.name}
                    sx={{
                      flex: field.half ? "0 0 calc(50% - 12px)" : "0 0 100%",
                      display: "flex",
                    }}
                  >
                    <Field
                      name={field.name}
                      as={TextField}
                      label={field.label}
                      type={field.type}
                      select={field.select}
                      multiline={field.multiline}
                      rows={field.rows}
                      fullWidth
                      error={!!(touched[field.name] && errors[field.name])}
                      helperText={touched[field.name] && errors[field.name]}
                    >
                      {field.select &&
                        field.options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </Field>
                  </Box>
                ))}

                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button variant="outlined" onClick={onBack} size="large">
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    sx={{ minWidth: 200 }}
                  >
                    {!isSubmitting && "Submit Application"}
                    {isSubmitting && (
                      <CircularProgress
                        size={24}
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          marginTop: "-12px",
                          marginLeft: "-12px",
                        }}
                      />
                    )}
                  </Button>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
