import StatsChart from "@components/StatsChart";

export default function UserChart({ data, darkMode }) {
  return <StatsChart data={data} hideXAxisLabels darkMode={darkMode} />;
}
