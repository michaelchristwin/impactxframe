import { Label } from "./ui/label";

export const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <fieldset className={`w-full`}>
      <Label className={`font-semibold`}>
        {label}
        {children}
      </Label>
    </fieldset>
  );
};
