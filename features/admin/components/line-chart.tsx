import { cn } from "@/lib/utils";

type LineChartProps = {
  data: number[];
  tone: "gold" | "red";
  className?: string;
};

const W = 560;
const H = 170;
const PAD = 12;

const toneStroke = { gold: "stroke-gold", red: "stroke-red" } as const;
const toneFill = { gold: "fill-gold/20", red: "fill-red/20" } as const;

/** LineChart — dependency-free SVG area+line sparkline for the dashboard trends. */
export function LineChart({ data, tone, className }: LineChartProps) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - PAD - ((v - min) / span) * (H - PAD * 2);
    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10] as const;
  });

  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `M0,${H} L${pts.map((p) => p.join(",")).join(" L")} L${W},${H} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Grafik tren"
      className={cn("block h-auto w-full", className)}
    >
      {[42, 84, 126].map((y) => (
        <line key={y} x1={0} y1={y} x2={W} y2={y} className="stroke-border" strokeWidth={1} />
      ))}
      <path d={area} className={toneFill[tone]} />
      <polyline
        points={line}
        fill="none"
        className={toneStroke[tone]}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
