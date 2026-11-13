/**
 * The resume/status lookup shared by /apply (resume an application) and
 * /status (check on one). Both flows email a six-digit code, verify it with
 * POST Borrower/current-step, and send a continuable application to the
 * screen for its next step.
 */
import { OnboardingStep } from "./types/loanApplication";
import { CurrentStatusData } from "./store/services/baseApi";

/**
 * Resume codes, per the backend's OtpService: a code lives 10 minutes, and
 * requests are capped at 3 per email per 5 minutes — so roughly one every 100
 * seconds.
 */
export const RESUME_CODE_TTL_MS = 10 * 60 * 1000;
export const RESUME_RESEND_COOLDOWN_MS = 100 * 1000;

/** Messages after which the code can no longer be used: locked, expired, spent. */
export const DEAD_CODE_MESSAGE = /locked|too many failed|expired/i;

export const formatCountdown = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${`${total % 60}`.padStart(2, "0")}`;
};

export const errorMessage = (error: unknown): string | undefined =>
  (error as { data?: { message?: string } })?.data?.message;

/**
 * Where a resumed borrower goes for each `currentStep` (the last thing they
 * finished). EmailSent stays on the apply page; MandateActivationPending is
 * Remita only, and MandateActivated is done — neither has a screen to
 * continue on.
 */
export const RESUME_ROUTES: Partial<Record<OnboardingStep, string>> = {
  [OnboardingStep.EmailValidated]: "/statement-review",
  // The BVN code was sent but not entered. The borrower re-enters their bank
  // details and BVN, which re-checks them and sends a fresh code.
  [OnboardingStep.BvnSent]: "/statement-review",
  [OnboardingStep.BvnValidated]: "/personal-details",
  [OnboardingStep.DocumentsUploaded]: "/loan-application",
  // The loan was saved but the mandate call failed; step4 again is the only
  // way forward, from the loan screen in its retry state.
  [OnboardingStep.LoanSubmitted]: "/loan-application?retry=1",
  [OnboardingStep.MandateGenerated]: "/loan-application?retry=1",
};

/** Whether a resumed application has a screen to continue on. */
export const canContinue = (status: CurrentStatusData): boolean =>
  !status.isCompleted &&
  (status.currentStep === OnboardingStep.EmailSent ||
    RESUME_ROUTES[status.currentStep as OnboardingStep] !== undefined);
