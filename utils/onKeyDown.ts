export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9]/.test(e.key) &&
    e.key !== "Backspace" &&
    e.key !== "Delete" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight" &&
    e.key !== "Tab" &&
    e.key !== "."
  ) {
    e.preventDefault();
  }
  // Ensure only one period is allowed
  if (e.key === "." && e.currentTarget.value.includes(".")) {
    e.preventDefault();
  }
};
