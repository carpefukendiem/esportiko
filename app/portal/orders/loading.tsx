export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 animate-pulse">
      <div className="h-10 w-48 rounded-lg bg-[#1C2333]" />
      <div className="h-12 w-full rounded-lg bg-[#1C2333]" />
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 rounded-xl border border-[#2A3347] bg-[#1C2333]" />
      ))}
    </div>
  );
}
