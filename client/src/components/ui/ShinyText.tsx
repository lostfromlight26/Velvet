interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-300 to-white bg-[length:200%_100%] ${
        disabled ? "" : "animate-shiny-sweep"
      } ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
}
