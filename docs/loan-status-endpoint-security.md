# Securing `GET /api/v1/loan/status?email=` before production

**From:** devpay web frontend
**Date:** 13 Nov 2026
**Status:** ✅ Resolved — Option A implemented by the backend on 13 Nov 2026 and deployed to the Render dev environment. See **Backend response** at the bottom for the final contract.

## The problem

The borrower loan-status endpoint is currently **unauthenticated and keyed by email address**:

```
GET /api/v1/loan/status?email=borrower@example.com
```

Anyone who knows — or guesses — a borrower's email address can retrieve, with a single curl call and no verification:

- the borrower's full name
- loan amount, tenor, interest and fees
- disbursement amount and date
- amount paid, outstanding balance, last payment date
- repayment status (including whether they are overdue)

An email address is not a secret. It is routinely known to employers, colleagues, family, and anyone a borrower has ever emailed. For a lending product, "is this person in debt and are they behind on payments" is exactly the information that must not leak. The earlier design (`GET /loan/{id}/status` keyed by loan GUID) was stronger — a GUID is unguessable — and this change traded that away.

## Why the frontend's OTP check doesn't cover this

The status page on the website only calls this endpoint *after* the borrower proves ownership of the email via the existing resume-OTP flow (`POST /Borrower/resume/request-otp` → `POST /Borrower/current-step`). But that check lives entirely in the browser. The endpoint itself accepts any request from anywhere, so the UI's discipline provides no protection at the API boundary.

## Recommended fix (small, reuses what already exists)

Tie the endpoint to the OTP verification the backend already performs. Two options, either is fine for the frontend:

### Option A — short-lived token (preferred)

1. When `POST /Borrower/current-step` verifies an email+OTP pair successfully, include a short-lived token in its response (e.g. a 10–15 minute JWT or opaque token bound to that email).
2. Require it on the status endpoint:

```
GET /api/v1/loan/status?email=...
Authorization: Bearer <status-token>
```

3. Reject requests whose token is missing, expired, or minted for a different email.

### Option B — accept email + OTP directly

Make the endpoint take the same pair `current-step` takes, and validate it against the same `OtpService` state:

```
POST /api/v1/loan/status
{ "email": "...", "otp": "123456" }
```

This needs no new token machinery, at the cost of the code being single-use/time-boxed in the same way it is for `current-step`.

### Either way

- Rate-limit the endpoint per email and per IP (the resume-OTP endpoints already have the 3-per-5-minutes pattern).
- Return the same response shape for "no loan" and "email unknown", so the endpoint can't be used to test which emails have applications (the resume flow already does this correctly).
- Avoid logging the email as part of the request URL if query-string logging is on — switching to POST (Option B) sides-steps this entirely.

## Frontend impact

One-line change on our side for either option — the page already performs the OTP flow first and has the email, the OTP, and the `current-step` response in hand at the moment it calls the status endpoint. Nothing about the page's UX changes.

## Current deployment state

As of 13 Nov 2026 the endpoint is not yet on staging (`swagger/v1/swagger.json` does not list it; probes return 404). That's the right moment to make this change — before anything depends on the open version.

---

## Backend response — implemented (13 Nov 2026)

Option A is live on the Render dev environment (`https://devpay-api-dev.onrender.com`). The open, unauthenticated version never reached staging or production.

### Final contract

**1. Get the token.** `POST /api/v1/Borrower/current-step` (unchanged request: `{ email, otp }`, after `POST /api/v1/Borrower/resume/request-otp`) now returns one new field on success:

```jsonc
{
  "success": true,
  "data": {
    // ...existing current-step fields...
    "statusToken": "eyJhbGciOiJIUzI1NiIs..."   // 15-minute JWT bound to the verified email
  }
}
```

**2. Use it on the status call.**

```
GET /api/v1/loan/status?email=<same email>
Authorization: Bearer <statusToken>
```

**3. Responses.**

| Case | Response |
|---|---|
| Valid token, loan found | `200` — `{ success, message, data }` with the loan status object (shape unchanged) |
| Missing/expired/invalid token, or token for a different email | `401` — `{ "success": false, "message": "A valid status token for this email is required. ..." }` |
| Valid token, no application for the email | `404` — `{ "success": false, "message": "No loan application found for this email" }` |
| Missing `email` query param | `400` — ASP.NET problem-details body (`{"title":"One or more validation errors occurred.",...}`) |

On a `401` (e.g. the 15-minute token expired while the page sat open), re-run the OTP flow to get a fresh token.

### Notes on the review's other points

- **Token scope:** the status token is validated inside the status endpoint only and carries no roles or permissions — it cannot authenticate against any other endpoint in the API.
- **Rate limiting:** inherited from the OTP flow; a token cannot be obtained without passing the existing per-email OTP issuance limits.
- **Enumeration:** moot — the endpoint only answers for an email the caller has already OTP-proven.
- **`GET /loan/{id}/status`:** restored to admin-only (`Loans.View` permission + company scoping), so the GUID variant is no longer open either.
- **Email in the query string** (your logging note): still the case; flipping the endpoint to `POST` with a JSON body is a small follow-up if you want it — say the word.
