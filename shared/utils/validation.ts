// ========================================
// Form Validation Utilities
// ========================================

export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export interface FieldError {
  field: string;
  message: string;
}

// Validation rules
export const validators = {
  /**
   * Check if value is required
   */
  required(value: any, fieldName = 'این فیلد'): ValidationResult {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return { valid: false, message: `${fieldName} الزامی است` };
    }
    return { valid: true };
  },

  /**
   * Validate email format
   */
  email(value: string): ValidationResult {
    if (!value) return { valid: true }; // Skip if empty (use required for that)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return { valid: false, message: 'فرمت ایمیل صحیح نیست' };
    }
    return { valid: true };
  },

  /**
   * Validate minimum length
   */
  minLength(value: string, min: number): ValidationResult {
    if (!value) return { valid: true };

    if (value.length < min) {
      return { valid: false, message: `حداقل ${min} کاراکتر وارد کنید` };
    }
    return { valid: true };
  },

  /**
   * Validate maximum length
   */
  maxLength(value: string, max: number): ValidationResult {
    if (!value) return { valid: true };

    if (value.length > max) {
      return { valid: false, message: `حداکثر ${max} کاراکتر مجاز است` };
    }
    return { valid: true };
  },

  /**
   * Validate numeric value
   */
  numeric(value: any): ValidationResult {
    if (value === '' || value === null || value === undefined) return { valid: true };

    const num = Number(value);
    if (isNaN(num)) {
      return { valid: false, message: 'فقط عدد وارد کنید' };
    }
    return { valid: true };
  },

  /**
   * Validate positive number
   */
  positiveNumber(value: any): ValidationResult {
    if (value === '' || value === null || value === undefined) return { valid: true };

    const num = Number(value);
    if (isNaN(num) || num < 0) {
      return { valid: false, message: 'عدد مثبت وارد کنید' };
    }
    return { valid: true };
  },

  /**
   * Validate minimum value
   */
  min(value: number, minValue: number): ValidationResult {
    if (value === null || value === undefined) return { valid: true };

    if (value < minValue) {
      return { valid: false, message: `مقدار باید حداقل ${minValue} باشد` };
    }
    return { valid: true };
  },

  /**
   * Validate maximum value
   */
  max(value: number, maxValue: number): ValidationResult {
    if (value === null || value === undefined) return { valid: true };

    if (value > maxValue) {
      return { valid: false, message: `مقدار باید حداکثر ${maxValue} باشد` };
    }
    return { valid: true };
  },

  /**
   * Validate year (Jalali)
   */
  year(value: number): ValidationResult {
    if (!value) return { valid: true };

    const currentYear = 1403; // Approximate current Jalali year
    if (value < 1350 || value > currentYear + 1) {
      return { valid: false, message: 'سال معتبر نیست' };
    }
    return { valid: true };
  },

  /**
   * Validate kilometers
   */
  kilometers(value: number): ValidationResult {
    if (!value && value !== 0) return { valid: true };

    if (value < 0 || value > 1000000) {
      return { valid: false, message: 'کیلومتر معتبر نیست' };
    }
    return { valid: true };
  },

  /**
   * Validate cost/amount
   */
  amount(value: number): ValidationResult {
    if (!value && value !== 0) return { valid: true };

    if (value < 0) {
      return { valid: false, message: 'مبلغ نمی‌تواند منفی باشد' };
    }
    return { valid: true };
  },

  /**
   * Validate Iranian plate number format
   */
  plateNumber(value: string): ValidationResult {
    if (!value) return { valid: true };

    // Basic validation - can be enhanced for strict format
    if (value.length < 5) {
      return { valid: false, message: 'شماره پلاک معتبر نیست' };
    }
    return { valid: true };
  },

  /**
   * Validate password strength
   */
  password(value: string): ValidationResult {
    if (!value) return { valid: true };

    if (value.length < 6) {
      return { valid: false, message: 'رمز عبور باید حداقل ۶ کاراکتر باشد' };
    }
    return { valid: true };
  },

  /**
   * Validate password confirmation
   */
  passwordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
      return { valid: false, message: 'رمز عبور و تکرار آن یکسان نیستند' };
    }
    return { valid: true };
  },
};

/**
 * Validate a form with multiple fields
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, ((value: any) => ValidationResult)[]>
): { valid: boolean; errors: FieldError[] } {
  const errors: FieldError[] = [];

  for (const [field, fieldRules] of Object.entries(rules)) {
    for (const rule of fieldRules) {
      const result = rule(data[field]);
      if (!result.valid && result.message) {
        errors.push({ field, message: result.message });
        break; // Stop at first error for this field
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create a required validator with custom field name
 */
export function requiredField(fieldName: string) {
  return (value: any) => validators.required(value, fieldName);
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: FieldError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}

/**
 * Check if form has error for specific field
 */
export function hasFieldError(errors: FieldError[], field: string): boolean {
  return errors.some((e) => e.field === field);
}
