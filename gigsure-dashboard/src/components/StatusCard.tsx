import { cn } from "@/lib/utils";

interface StatusCardProps {
  label: string;
  value: string;
  status?: 'neutral' | 'alert' | 'success';
  icon?: React.ReactNode;
}

const StatusCard = ({ label, value, status = 'neutral', icon }: StatusCardProps) => (
  <div className="bg-card p-4 rounded-xl shadow-card flex flex-col gap-1">
    <div className="flex items-center gap-1.5">
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-lg font-semibold text-foreground">{value}</span>
      <div className={cn(
        "h-2 w-2 rounded-full",
        status === 'success' && "bg-success animate-pulse-dot",
        status === 'alert' && "bg-warning",
        status === 'neutral' && "bg-muted-foreground/30"
      )} />
    </div>
  </div>
);

export default StatusCard;
