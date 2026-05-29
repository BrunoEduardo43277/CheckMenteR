const baseClasses =
  "disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary:
    "rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] px-5 py-3 text-white shadow-lg hover:scale-[1.02]",
  pill:
    "rounded-full bg-gradient-to-r from-[#27C4BD] to-[#38B487] px-7 py-4 text-white shadow-[0_14px_34px_rgba(39,196,189,0.28)] hover:scale-[1.02]",
  actionCard:
    "w-full bg-white rounded-[30px] border border-[#E8F3ED] p-7 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
  subtle:
    "rounded-2xl border border-slate-200 bg-white px-5 py-3 font-medium text-slate-600 shadow-sm hover:bg-slate-50",
};

function juntarClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Button({ children, variant = "primary", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={juntarClasses(baseClasses, variants[variant] || variants.primary, className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <Button className={className} {...props}>
      {children}
    </Button>
  );
}

export default Button;
