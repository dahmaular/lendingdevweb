import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import ConfirmationPage from "./components/ConfirmationPage";
import LoginPage from "./pages/apply";
import StatementReview from "./components/StatementReview";
import LoanApplicationPage from "./pages/loanApplication";
import PersonalDetails from "./pages/personalDetails";
import UploadOfferLetter from "./pages/uploadOfferLetter";

// Wrapper component to use hooks
const AppContent = () => {
  const navigate = useNavigate();

  const handleLogin = (email: string, bvn: string, dob: string) => {
    // In a real app, you'd validate the credit score here
    navigate("/statement-review");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <LoginPage
              onLogin={handleLogin}
              onGoBack={handleGoBack}
              onCreateAccount={() => {}}
              onResetPassword={() => {}}
            />
          }
        />
        <Route
          path="/statement-review"
          element={
            <StatementReview
              onNext={() => navigate("/personal-details")}
              onBack={() => navigate("/")}
            />
          }
        />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/loan-application" element={<LoanApplicationPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/upload-offer-letter" element={<UploadOfferLetter />} />
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
