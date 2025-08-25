# Smart Start Free Trial Component

A comprehensive React component system for handling free trial registrations with OTP email verification.

## Components

### 1. `StartFreeTrialModal`
The main modal component that handles the complete trial registration flow.

#### Features
- **Multi-step registration process**:
  - Step 1: Registration form with validation
  - Step 2: OTP verification via email
  - Step 3: Success confirmation

- **Form validation** using react-hook-form and zod
- **OTP verification** with 6-digit input fields
- **Auto-resend OTP** functionality with timer
- **Responsive design** with dark mode support
- **Error handling** and user feedback

#### Props
```javascript
{
  isOpen: boolean,           // Controls modal visibility
  onClose: function,         // Callback when modal closes
  selectedPlan: object       // Plan object (optional)
}
```

#### Plan Object Structure
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  currency: string,
  interval: string,
  maxEmployees: number|null
}
```

### 2. `StartFreeTrialButton`
A reusable button component that triggers the trial modal.

#### Props
```javascript
{
  plan: object,              // Plan object (optional)
  className: string,         // Additional CSS classes
  children: ReactNode,       // Button text/content
  variant: string           // 'primary' | 'secondary' | 'outline'
}
```

#### Usage Examples
```jsx
// Basic usage
<StartFreeTrialButton />

// With specific plan
<StartFreeTrialButton 
  plan={selectedPlan}
  variant="primary"
>
  Start Professional Trial
</StartFreeTrialButton>

// Custom styling
<StartFreeTrialButton 
  className="w-full py-4"
  variant="outline"
>
  Try Enterprise Plan
</StartFreeTrialButton>
```

## API Endpoints

The component expects these backend endpoints:

### 1. Trial Registration
```
POST /api/auth/register-trial
```
**Request Body:**
```javascript
{
  companyName: string,
  adminFirstName: string,
  adminLastName: string,
  adminEmail: string,
  adminPassword: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string,
  trial: {
    id: string,
    email: string,
    // ... other trial data
  }
}
```

### 2. OTP Verification
```
POST /api/auth/verify-trial-otp
```
**Request Body:**
```javascript
{
  adminEmail: string,
  otp: string,
  trialId: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string,
  user: {
    id: string,
    email: string,
    // ... user data
  },
  token: string            // Optional JWT token
}
```

### 3. Resend OTP
```
POST /api/auth/resend-trial-otp
```
**Request Body:**
```javascript
{
  adminEmail: string,
  trialId: string
}
```

**Response:**
```javascript
{
  success: boolean,
  message: string
}
```

## Form Validation Schema

The component uses zod for form validation:

```javascript
const trialFormSchema = z.object({
  adminFirstName: z.string().min(2, 'First name must be at least 2 characters'),
  adminLastName: z.string().min(2, 'Last name must be at least 2 characters'),
  adminEmail: z.string().email('Invalid email address'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  adminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Please confirm your password'),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine((data) => data.adminPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

## Integration with PlansPage

The component is integrated into the PlansPage for seamless user experience:

```jsx
import { StartFreeTrialButton } from '@/components/forms'

// Replace regular buttons with trial buttons
<StartFreeTrialButton
  plan={plan}
  className="w-full py-3 px-6"
  variant="primary"
>
  {plan.buttonText}
</StartFreeTrialButton>
```

## Features

### 🔒 **Security**
- Password validation with confirmation
- OTP verification via email
- Terms of service agreement required
- Input sanitization and validation

### 📱 **User Experience**
- Multi-step guided process
- Real-time form validation
- Auto-focus on OTP inputs
- Loading states and feedback
- Responsive design for all devices

### ⏰ **OTP System**
- 6-digit verification code
- 5-minute expiration timer
- Visual countdown display
- Automatic resend functionality
- Multiple input fields with auto-advance

### 🎨 **UI/UX**
- Clean, modern design
- Dark mode support
- Smooth animations and transitions
- Contextual icons and messaging
- Professional layout structure

### 🔄 **State Management**
- Form state handled by react-hook-form
- Modal state management
- Timer state for OTP expiration
- Error state handling

## Error Handling

The component includes comprehensive error handling:

- **Network errors**: Display user-friendly messages
- **Validation errors**: Real-time field validation
- **API errors**: Server response error display
- **OTP errors**: Invalid code feedback
- **Timeout errors**: Expired OTP handling

## Customization

### Styling
All components use Tailwind CSS classes and can be customized via:
- `className` prop for additional styles
- Tailwind configuration for color schemes
- CSS custom properties for theming

### Behavior
Customize behavior through:
- Props configuration
- API endpoint URLs
- Validation schema modification
- Timer duration settings

## Dependencies

- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation integration  
- `zod` - Schema validation
- `react-toastify` - Toast notifications
- `@heroicons/react` - Icons
- `axios` - HTTP client (via httpClient)

## Best Practices

1. **Always validate on both client and server**
2. **Use HTTPS for OTP transmission**
3. **Implement rate limiting on OTP endpoints**
4. **Store OTPs securely (hashed) on backend**
5. **Set appropriate OTP expiration times**
6. **Log security-relevant events**
7. **Provide clear error messages**
8. **Test across different email providers**

## Browser Support

Compatible with all modern browsers:
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Accessibility

The component follows accessibility best practices:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support
