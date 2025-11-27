export default function LawCard({ law }: any) {
return (
<div className="border p-4 rounded shadow">
<h2 className="text-xl font-bold">{law.titulo}</h2>
<p className="text-gray-600">{law.ementa}</p>
</div>
);
}