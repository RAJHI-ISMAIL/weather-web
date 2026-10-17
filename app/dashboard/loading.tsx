import { WeatherLoading } from "@/components/weather/WeatherLoading";

export default function DashboardLoading() {
  return (
    <div className="relative min-h-screen bg-[#050B14] stars-bg text-[#F8FAFC] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden selection:bg-cyan-500/30">
      {/* Background ambient cosmic glow */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(34,211,238,0.12) 0%, rgba(10,22,40,0.4) 60%, #050B14 100%)",
        }}
      />
      <WeatherLoading message="Connecting to orbital constellation to calibrate your atmospheric dashboard..." />
    </div>
  );
}
