type DashboardCardProps = {
  title: string;
  value: string;
  description: string;
};

const DashboardStatCard = ({
  title,
  value,
  description,
}: DashboardCardProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-background/50 p-6 transition-all duration-300 hover:border-primary/20 hover:bg-white/5">
      <p className="text-sm text-white/50">{title}</p>

      <h3 className="mt-4 text-4xl font-semibold text-white">{value}</h3>

      <p className="mt-2 text-sm text-white/40">{description}</p>
    </div>
  );
};

export default DashboardStatCard;
