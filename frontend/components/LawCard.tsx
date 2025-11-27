export default function LawCard({ law }: any) {
  return (
    <div style={{ padding: 15, border: "1px solid #ccc", marginBottom: 10 }}>
      <h3>{law.title}</h3>
      <p>{law.description}</p>
    </div>
  );
}
