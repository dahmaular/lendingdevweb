import React from "react";
import { Box, Typography } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";

interface PageLayoutProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

const float = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
`;

const Container = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  position: "relative",
  overflow: "hidden",

  "@media (max-width: 900px)": {
    flexDirection: "column",
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: "0 0 45%",
  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A855F7 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: theme.spacing(6),
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    right: "-50%",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)",
    pointerEvents: "none",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-30%",
    left: "-30%",
    width: "80%",
    height: "80%",
    background:
      "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 50%)",
    pointerEvents: "none",
  },

  "@media (max-width: 900px)": {
    display: "none",
  },
}));

const FloatingShape = styled(Box)<{ delay?: number; size?: number }>(
  ({ delay = 0, size = 60 }) => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
    background: "rgba(255, 255, 255, 0.1)",
    animation: `${float} 6s ease-in-out infinite`,
    animationDelay: `${delay}s`,
  })
);

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  background: `
    radial-gradient(at 40% 20%, rgba(99, 102, 241, 0.03) 0px, transparent 50%),
    radial-gradient(at 80% 0%, rgba(139, 92, 246, 0.03) 0px, transparent 50%),
    radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.02) 0px, transparent 50%),
    #FFFFFF
  `,
  overflow: "auto",
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(4, 6),
  maxWidth: 560,
  margin: "0 auto",
  width: "100%",

  "@media (max-width: 600px)": {
    padding: theme.spacing(3),
  },
}));

const BrandSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  color: "#fff",
  position: "relative",
  zIndex: 1,
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: 800,
  marginBottom: theme.spacing(2),
  letterSpacing: "-0.02em",
  textShadow: "0 2px 20px rgba(0,0,0,0.2)",
}));

const BrandSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: "1.125rem",
  opacity: 0.9,
  maxWidth: 360,
  margin: "0 auto",
  lineHeight: 1.6,
}));

const FeatureList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  marginTop: theme.spacing(6),
  position: "relative",
  zIndex: 1,
}));

const FeatureItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  padding: theme.spacing(2, 3),
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: 16,
  border: "1px solid rgba(255, 255, 255, 0.1)",
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: 12,
  background: "rgba(255, 255, 255, 0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
}));

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBackground = true,
}) => {
  return (
    <Container>
      {showBackground && (
        <LeftPanel>
          {/* Floating decorative shapes */}
          <FloatingShape sx={{ top: "10%", left: "10%" }} delay={0} size={80} />
          <FloatingShape
            sx={{ top: "60%", right: "15%" }}
            delay={1}
            size={60}
          />
          <FloatingShape
            sx={{ bottom: "20%", left: "20%" }}
            delay={2}
            size={100}
          />
          <FloatingShape
            sx={{ top: "30%", right: "5%" }}
            delay={1.5}
            size={40}
          />

          <BrandSection>
            <BrandTitle>Spectra Finance</BrandTitle>
            <BrandSubtitle>
              Quick and easy loans tailored to your needs. Get approved in
              minutes.
            </BrandSubtitle>

            <FeatureList>
              <FeatureItem>
                <FeatureIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </FeatureIcon>
                <Box>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                    }}
                  >
                    Secure & Safe
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    Your data is protected with bank-level security
                  </Typography>
                </Box>
              </FeatureItem>

              <FeatureItem>
                <FeatureIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </FeatureIcon>
                <Box>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                    }}
                  >
                    Quick Approval
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    Get approved within 24 hours
                  </Typography>
                </Box>
              </FeatureItem>

              <FeatureItem>
                <FeatureIcon>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </FeatureIcon>
                <Box>
                  <Typography
                    sx={{
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                    }}
                  >
                    Flexible Terms
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "0.8125rem",
                    }}
                  >
                    Choose repayment plans that work for you
                  </Typography>
                </Box>
              </FeatureItem>
            </FeatureList>
          </BrandSection>
        </LeftPanel>
      )}

      <RightPanel>
        <ContentWrapper>{children}</ContentWrapper>
      </RightPanel>
    </Container>
  );
};

export default PageLayout;
