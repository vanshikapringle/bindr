import { Calendar, Clock } from "lucide-react";

export default function ReturnTracker({ borrowDate, returnDate }: { borrowDate: string, returnDate: string }) {
  if (!borrowDate || !returnDate) return null;

  const start = new Date(borrowDate);
  const end = new Date(returnDate);
  const now = new Date();

  // Calculate days remaining
  const timeDiff = end.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const isOverdue = daysRemaining < 0;

  return (
    <div className="bg-[var(--background)] border border-border rounded-xl p-5 mt-4">
      <h5 className="font-serif font-bold text-foreground mb-4">Exchange Details</h5>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex gap-3 items-start">
          <div className="p-2 bg-white rounded-lg border border-border shrink-0">
            <Calendar size={16} className="text-muted" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Borrowed On</p>
            <p className="text-sm font-medium text-foreground">
              {start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="p-2 bg-white rounded-lg border border-border shrink-0">
            <Clock size={16} className={isOverdue ? 'text-red-500' : 'text-accent'} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Expected Return</p>
            <p className="text-sm font-medium text-foreground">
              {end.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
        <span className="text-sm text-muted">Status</span>
        {isOverdue ? (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
            {Math.abs(daysRemaining)} Days Overdue
          </span>
        ) : (
          <span className="bg-[var(--accent)] text-accent px-3 py-1 rounded-full text-xs font-bold">
            {daysRemaining} Days Remaining
          </span>
        )}
      </div>
    </div>
  );
}
