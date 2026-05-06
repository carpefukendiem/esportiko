import { AdminSignOutButton } from "./AdminSignOutButton";

export default function AdminHomePage() {
  return (
    <div className="max-w-2xl rounded-xl border border-[#2A3347] bg-[#1C2333] p-8 md:p-10">
      <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
        Admin Dashboard
      </h1>
      <p className="mt-3 font-display text-base font-semibold text-[#8A94A6] md:text-lg">
        Coming Soon
      </p>
      <p className="mt-4 font-sans text-sm leading-relaxed text-[#8A94A6] md:text-base">
        Tools coming soon. For now, form submissions route directly to GoHighLevel.
      </p>
      <div className="mt-8">
        <AdminSignOutButton />
      </div>
    </div>
  );
}
