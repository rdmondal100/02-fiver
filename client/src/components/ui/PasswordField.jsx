import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function PasswordField({
  getFieldValues: field,
  fieldErrors: errors,
  className,
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const toggleVisibility = () => setShowPassword((prev) => !prev);

  // Determine if there's an error message for this field
  const errorMessage = errors[field.name]?.message;

  return (
    <>
      <div className="relative">
        <input
          {...field}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder || ""}
          className={`${className} ${errorMessage ? "border-red-500" : ""}`}
        />

        <span
          onClick={toggleVisibility}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer ${
            errorMessage ? "text-red-500" : "text-gray-400"
          }`}
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </>
  );
}

export default PasswordField;
