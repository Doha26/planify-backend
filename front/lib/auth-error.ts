export type AuthErrorType =
  | "InvalidCredentials"
  | "UserNotFound"
  | "EmailNotVerified"
  | "AccountLocked"
  | "NetworkError"
  | "ServerError"
  | "ValidationError"
  | "UserExists"
  | "WeakPassword"
  | "Unknown"
  | "Unauthorized"
  | "TooManyAttempts"
  | "InvalidResponse"
  | "Success"
  | "Redirect"
  | "InformationalResponse"
  | "PaymentRequired"
  | "Forbidden"
  | "MethodNotAllowed"
  | "NotAcceptable"
  | "ProxyAuthRequired"
  | "RequestTimeout"
  | "Conflict"
  | "Gone"
  | "LengthRequired"
  | "PreconditionFailed"
  | "PayloadTooLarge"
  | "URITooLong"
  | "UnsupportedMediaType"
  | "RangeNotSatisfiable"
  | "ExpectationFailed"
  | "ImATeapot"  // Yes, this is real!
  | "UnprocessableEntity"
  | "Locked"
  | "FailedDependency"
  | "TooEarly"
  | "UpgradeRequired"
  | "PreconditionRequired"
  | "TooManyRequests"
  | "RequestHeaderFieldsTooLarge"
  | "UnavailableForLegalReasons"
  | "NotImplemented"
  | "BadGateway"
  | "ServiceUnavailable"
  | "GatewayTimeout"
  | "HTTPVersionNotSupported"
  | "VariantAlsoNegotiates"
  | "InsufficientStorage"
  | "LoopDetected"
  | "BandwidthLimitExceeded"
  | "NotExtended"
  | "NetworkAuthenticationRequired";

// Map HTTP status codes to error types
export const HTTP_ERROR_MAP: Record<number, AuthErrorType> = {
  // 1xx: Informational responses
  100: "InformationalResponse", // Continue
  101: "InformationalResponse", // Switching Protocols
  102: "InformationalResponse", // Processing
  103: "InformationalResponse", // Early Hints

  // 2xx: Successful responses
  200: "Success", // OK
  201: "Success", // Created
  202: "Success", // Accepted
  203: "Success", // Non-Authoritative Information
  204: "Success", // No Content
  205: "Success", // Reset Content
  206: "Success", // Partial Content
  207: "Success", // Multi-Status
  208: "Success", // Already Reported
  226: "Success", // IM Used

  // 3xx: Redirection messages
  300: "Redirect", // Multiple Choices
  301: "Redirect", // Moved Permanently
  302: "Redirect", // Found
  303: "Redirect", // See Other
  304: "Redirect", // Not Modified
  305: "Redirect", // Use Proxy
  307: "Redirect", // Temporary Redirect
  308: "Redirect", // Permanent Redirect

  // 4xx: Client error responses
  400: "ValidationError", // Bad Request
  401: "Unauthorized", // Unauthorized
  402: "PaymentRequired", // Payment Required
  403: "Forbidden", // Forbidden
  404: "UserNotFound", // Not Found
  405: "MethodNotAllowed", // Method Not Allowed
  406: "NotAcceptable", // Not Acceptable
  407: "ProxyAuthRequired", // Proxy Authentication Required
  408: "RequestTimeout", // Request Timeout
  409: "Conflict", // Conflict
  410: "Gone", // Gone
  411: "LengthRequired", // Length Required
  412: "PreconditionFailed", // Precondition Failed
  413: "PayloadTooLarge", // Payload Too Large
  414: "URITooLong", // URI Too Long
  415: "UnsupportedMediaType", // Unsupported Media Type
  416: "RangeNotSatisfiable", // Range Not Satisfiable
  417: "ExpectationFailed", // Expectation Failed
  418: "ImATeapot", // I'm a teapot
  421: "InvalidResponse", // Misdirected Request
  422: "UnprocessableEntity", // Unprocessable Entity
  423: "Locked", // Locked
  424: "FailedDependency", // Failed Dependency
  425: "TooEarly", // Too Early
  426: "UpgradeRequired", // Upgrade Required
  428: "PreconditionRequired", // Precondition Required
  429: "TooManyRequests", // Too Many Requests
  431: "RequestHeaderFieldsTooLarge", // Request Header Fields Too Large
  451: "UnavailableForLegalReasons", // Unavailable For Legal Reasons

  // 5xx: Server error responses
  500: "ServerError", // Internal Server Error
  501: "NotImplemented", // Not Implemented
  502: "BadGateway", // Bad Gateway
  503: "ServiceUnavailable", // Service Unavailable
  504: "GatewayTimeout", // Gateway Timeout
  505: "HTTPVersionNotSupported", // HTTP Version Not Supported
  506: "VariantAlsoNegotiates", // Variant Also Negotiates
  507: "InsufficientStorage", // Insufficient Storage
  508: "LoopDetected", // Loop Detected
  509: "BandwidthLimitExceeded", // Bandwidth Limit Exceeded
  510: "NotExtended", // Not Extended
  511: "NetworkAuthenticationRequired" // Network Authentication Required
};

interface AuthError {
  title: string;
  message: string;
  statusCode?: number;
}

export function getAuthError(type: AuthErrorType | number): AuthError {
  const errorType: AuthErrorType = typeof type === 'number' 
    ? HTTP_ERROR_MAP[type] || "Unknown"
    : type;

  const baseError = {
    statusCode: typeof type === 'number' ? type : undefined
  };

  switch (errorType) {
    case "Success":
      return {
        ...baseError,
        title: "Success",
        message: "Operation completed successfully.",
      };
    case "InformationalResponse":
      return {
        ...baseError,
        title: "Processing",
        message: "Request is being processed.",
      };
    case "Redirect":
      return {
        ...baseError,
        title: "Redirect",
        message: "Request requires further action.",
      };
    case "InvalidCredentials":
      return {
        ...baseError,
        title: "Invalid Credentials",
        message: "The email or password you entered is incorrect.",
      };
    case "Unauthorized":
      return {
        ...baseError,
        title: "Unauthorized",
        message: "You are not authorized to access this resource.",
      };
    case "Forbidden":
      return {
        ...baseError,
        title: "Access Forbidden",
        message: "You don't have permission to access this resource.",
      };
    case "UserNotFound":
      return {
        ...baseError,
        title: "Not Found",
        message: "The requested resource was not found.",
      };
    case "MethodNotAllowed":
      return {
        ...baseError,
        title: "Method Not Allowed",
        message: "The requested method is not supported for this resource.",
      };
    case "NotAcceptable":
      return {
        ...baseError,
        title: "Not Acceptable",
        message: "The requested format is not available.",
      };
    case "RequestTimeout":
      return {
        ...baseError,
        title: "Request Timeout",
        message: "The request took too long to complete.",
      };
    case "Conflict":
      return {
        ...baseError,
        title: "Conflict",
        message: "The request conflicts with current state of the server.",
      };
    case "UnprocessableEntity":
      return {
        ...baseError,
        title: "Unprocessable Entity",
        message: "The request was well-formed but contains semantic errors.",
      };
    case "TooManyRequests":
      return {
        ...baseError,
        title: "Too Many Requests",
        message: "You have exceeded the rate limit. Please try again later.",
      };
    case "ServerError":
      return {
        ...baseError,
        title: "Server Error",
        message: "An unexpected error occurred on our servers.",
      };
    case "ServiceUnavailable":
      return {
        ...baseError,
        title: "Service Unavailable",
        message: "The service is temporarily unavailable. Please try again later.",
      };
    case "GatewayTimeout":
      return {
        ...baseError,
        title: "Gateway Timeout",
        message: "The server took too long to respond.",
      };
    // Add other specific cases as needed
    case "Unknown":
    default:
      return {
        ...baseError,
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
      };
  }
}
