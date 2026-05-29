import { ArrowLeft } from "lucide-react";
import { Button } from "./Button";

function BackButton({ children = "Voltar", className = "", ...props }) {
  return (
    <Button variant="subtle" className={className} {...props}>
      <ArrowLeft size={18} />
      {children}
    </Button>
  );
}

export default BackButton;
