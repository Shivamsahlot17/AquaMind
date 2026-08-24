import "../styles/metricCard.css";

type Props = {
  title: string;
  value: string;
};

function MetricCard({ title, value }: Props) {
  return (
    <div
      className="metric-card"
      style={{
        transition: "0.3s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <h3>{title}</h3>

      <h1
        style={{
          marginTop: 10,
          color: "#0f4c81",
          fontSize: "2rem",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default MetricCard;