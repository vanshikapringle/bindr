import { CheckCircle2, Circle } from "lucide-react";

const STATUSES = [
  "requested",
  "approved",
  "picked_up",
  "currently_reading",
  "returned",
  "exchange_completed"
];

export default function LendingStatusFlow({ currentStatus }: { currentStatus: string }) {
  const currentIndex = STATUSES.indexOf(currentStatus);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-border -z-10 -translate-y-1/2"></div>
        
        {/* Active Line */}
        <div 
          className="absolute left-0 top-1/2 h-0.5 bg-accent -z-10 -translate-y-1/2 transition-all duration-500" 
          style={{ width: `${currentIndex > 0 ? (currentIndex / (STATUSES.length - 1)) * 100 : 0}%` }}
        ></div>

        {STATUSES.map((status, index) => {
          const isCompleted = index <= currentIndex;
          const isActive = index === currentIndex;
          const label = status.replace('_', ' ');

          return (
            <div key={status} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`transition-colors duration-300 ${isCompleted ? 'text-accent' : 'text-border'}`}>
                {isCompleted ? (
                  <CheckCircle2 size={24} className="fill-current bg-white rounded-full" />
                ) : (
                  <Circle size={24} className="bg-white rounded-full" />
                )}
              </div>
              <span className={`text-[10px] uppercase tracking-wider font-medium max-w-[60px] text-center leading-tight ${isActive ? 'text-accent font-bold' : 'text-muted'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
