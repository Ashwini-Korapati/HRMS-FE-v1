# API Format Documentation - Free Trial Registration System

## Overview
This document outlines the exact API formats used for the free trial registration system, including trial registration and OTP verification.

## 1. Trial Registration API

### Endpoint
```
POST /api/auth/start-trial
```

### Request Format
```json
{
  "adminFirstName": "string",
  "adminLastName": "string", 
  "adminEmail": "string",
  "adminPassword": "string"
}
```

### Example Request
```json
{
  "adminFirstName": "John",
  "adminLastName": "Doe",
  "adminEmail": "john.doe@company.com",
  "adminPassword": "SecurePassword123!"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "Trial registration successful. Please check your email for OTP.",
  "data": {
    "trialId": "unique-trial-id",
    "adminEmail": "john.doe@company.com"
  }
}
```

## 2. OTP Verification API

### Endpoint
```
POST /api/auth/verify-trial-otp
```

### Request Format
```json
{
  "email": "string",
  "otpCode": "string"
}
```

### Example Request
```json
{
  "email": "krishnatest+1754741508518@gmail.com",
  "otpCode": "457437"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "OTP verified successfully. Trial activated.",
  "data": {
    "trialId": "unique-trial-id",
    "expiresAt": "2024-01-15T12:00:00Z",
    "accessToken": "jwt-token"
  }
}
```

## 3. OTP Resend API

### Endpoint
```
POST /api/auth/resend-trial-otp
```

### Request Format
```json
{
  "email": "string"
}
```

### Example Request
```json
{
  "email": "john.doe@company.com"
}
```

### Expected Response
```json
{
  "success": true,
  "message": "OTP resent successfully."
}
```

## Implementation Notes

### Frontend Component: StartFreeTrialModal.jsx
- **Multi-step Flow**: Registration → OTP → Success
- **Validation**: Uses zod schema for form validation
- **OTP Timer**: 5-minute countdown with resend functionality
- **Error Handling**: Comprehensive error states with user feedback
- **Auto-advance**: OTP input fields auto-advance on completion

### Key Features
1. **Secure Password Validation**: Minimum 8 characters with complexity requirements
2. **Email Validation**: Proper email format validation
3. **OTP Auto-Focus**: Automatic focus management for better UX
4. **Timer Management**: Visual countdown with disable/enable states
5. **Toast Notifications**: Success/error feedback for all operations

### Error Handling
- Network errors are caught and displayed to users
- Backend validation errors are parsed and shown appropriately
- OTP expiration is handled with resend functionality
- Form validation prevents invalid submissions

### State Management
- Uses React hooks for local state management
- Form state managed by react-hook-form
- OTP timer managed with useEffect and setInterval
- Loading states prevent double submissions

## Testing Considerations

### Manual Testing Steps
1. Fill out trial registration form with valid data
2. Submit and verify OTP email is sent
3. Enter correct OTP to verify account
4. Test resend OTP functionality
5. Test form validation with invalid data
6. Test network error scenarios

### Edge Cases Handled
- Invalid OTP codes
- Expired OTP codes
- Network failures during submission
- Multiple resend attempts
- Form validation errors
- Timer expiration scenarios
