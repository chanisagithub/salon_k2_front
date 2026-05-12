"use client";

export default function SuccessStep() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-primary text-primary mb-8">
        <span className="material-symbols-outlined text-4xl">done_all</span>
      </div>
      <h2 className="font-serif text-3xl text-on-surface mb-4 uppercase tracking-wider">
        Your Ritual is Set
      </h2>
      <p className="text-base leading-relaxed text-on-surface-variant mb-10 italic">
        We look forward to seeing you at 2KCUT.
      </p>
      <button
        onClick={() => window.parent.postMessage("closeBooking", "*")}
        className="bg-primary-container px-12 py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black hover:bg-primary transition-all"
      >
        Return to Salon
      </button>
    </div>
  );
}
