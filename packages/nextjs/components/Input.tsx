import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  webkitdirectory?: "true" | "false";
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ type, ...props }, ref) => {
  return <input type={type} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
