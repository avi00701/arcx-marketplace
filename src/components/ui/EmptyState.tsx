"use client";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 rounded-[48px] border border-white/5 bg-white/[0.02] text-center max-w-2xl mx-auto glass shadow-2xl animate-slide-up">
      <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-inner group transition-all duration-500 hover:scale-110 hover:border-accent/40">
        <div className="text-muted group-hover:text-accent transition-colors duration-500 scale-125">
           {icon || (
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
             </svg>
           )}
        </div>
      </div>
      
      <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">{title}</h3>
      {description && (
        <p className="text-muted text-sm font-bold max-w-md mx-auto leading-relaxed mb-8 opacity-60">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
