import React, { useState } from "react";
import { Box, Typography, Container } from "@mui/material";
import { useOnboarding1Mutation } from "../store/services/baseApi";
import Logo from "../assets/logo.jpeg";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { GlassCard, ModernButton, ModernInput } from "../components/ui";

const ApplyPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [onboarding1, { isLoading }] = useOnboarding1Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onboarding1({
        email,
        firstName,
        lastName,
        employer: "self",
        productId: "372e9a1d-c714-4fc2-b44a-3eeb8ebda4c1",
      }).unwrap();
    } catch (err) {
      // ignore for now
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <img src={Logo} alt="logo" style={{ width: 96, borderRadius: 8 }} />
        </Box>

        <GlassCard sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Quick Loan - Apply
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <ModernInput
              label="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              startIcon={<PersonOutlineIcon />}
              required
            />
            <ModernInput
              label="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              startIcon={<PersonOutlineIcon />}
              required
            />
            <ModernInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startIcon={<EmailOutlinedIcon />}
              required
            />
            <ModernButton
              type="submit"
              variant="primary"
              fullWidth
              loading={isLoading}
              endIcon={<ArrowForwardIcon />}
            >
              Get Started
            </ModernButton>
          </Box>
        </GlassCard>
      </Container>
    </Box>
  );
};

export default ApplyPage;
