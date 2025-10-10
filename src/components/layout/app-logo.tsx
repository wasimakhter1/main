export function AppLogo() {
  return (
    <div className="flex items-center justify-center bg-primary rounded-md h-8 w-8">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-primary-foreground"
      >
        <path
          d="M8 3H5C3.89543 3 3 3.89543 3 5V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 3H19C20.1046 3 21 3.89543 21 5V8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 21H5C3.89543 21 3 20.1046 3 19V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 21H19C20.1046 21 21 20.1046 21 19V16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
