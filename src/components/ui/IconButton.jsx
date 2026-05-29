const sizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const variants = {
  primary:
    "rounded-2xl bg-gradient-to-r from-[#5ED6A7] to-[#38B487] text-white shadow-md hover:scale-[1.02]",
  circle:
    "rounded-full bg-gradient-to-r from-[#27C4BD] to-[#38B487] text-white shadow-[0_15px_38px_rgba(39,196,189,0.32)] hover:scale-[1.04]",
  soft:
    "rounded-2xl border border-white/70 bg-white/85 text-slate-700 shadow-sm backdrop-blur-xl hover:bg-white hover:scale-[1.03]",
  ghost: "text-red-400 hover:text-red-500",
  white:
    "rounded-full bg-white text-slate-800 shadow-lg hover:scale-105",
};

function juntarClasses(...classes) {
  return classes.filter(Boolean).join(" ");
}

function IconButton({ children, label, size = "md", variant = "primary", className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={juntarClasses(
        "inline-flex shrink-0 items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size] || sizes.md,
        variants[variant] || variants.primary,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default IconButton;
