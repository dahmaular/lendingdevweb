import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AppBar } from "@mui/material";
import "./App.css";
import ConfirmationPage from "./components/ConfirmationPage";
import LoginPage from "./pages/apply";
import StatementReview from "./components/StatementReview";
import LoanApplicationPage from "./pages/loanApplication";
import PersonalDetails from "./pages/personalDetails";

// Wrapper for ConfirmationPage to handle route state
const ConfirmationPageWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formData = location.state?.formData || {
    employer_id: "",
    employer_name: "",
    email: "",
    salary: 0,
    bank_name: "",
    account_name: "",
    account_number: "",
    bvn: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    middle_name: "",
    nin: "",
    lga: "",
    home_address: "",
    state: "",
    date_of_birth: "",
    sex: "",
    loan_amount: 0,
    loan_duration: 0,
  };

  return (
    <ConfirmationPage
      formData={formData}
      onBack={() => navigate("/loan-application")}
      onSubmitSuccess={(reference) => {
        console.log("Application submitted with reference:", reference);
        navigate("/");
      }}
    />
  );
};

// Wrapper component to use hooks
const AppContent = () => {
  const navigate = useNavigate();

  const handleLoanApplication = (
    loanAmount: number,
    duration: number,
    monthlyIncome: number
  ) => {
    navigate("/confirmation", {
      state: {
        loanAmount,
        loanTenure: duration,
        monthlyIncome,
      },
    });
  };

  return (
    <div className="App">
      <AppBar position="static">
        {/* <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "white", flexGrow: 1 }}
          >
            LendGrid
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Apply Now
          </Button>
        </Toolbar> */}
      </AppBar>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/statement-review"
          element={
            <StatementReview
              onNext={() => navigate("/personal-details")}
              onBack={() => navigate("/")}
            />
          }
        />
        <Route
          path="/personal-details"
          element={
            <PersonalDetails
              onGoBack={() => navigate("/statement-review")}
              onSubmitApplication={() => navigate("/loan-application")}
            />
          }
        />
        <Route
          path="/loan-application"
          element={
            <LoanApplicationPage
              onSubmitApplication={handleLoanApplication}
              onGoBack={() => navigate("/personal-details")}
            />
          }
        />
        <Route path="/confirmation" element={<ConfirmationPageWrapper />} />
      </Routes>
    </div>
  );
};

// Root component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
