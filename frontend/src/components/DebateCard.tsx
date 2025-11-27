export default function DebateCard({ debate }: any) {
return (
<div className="border p-4 rounded shadow">
<h2 className="text-xl font-bold">{debate.titulo}</h2>
<p className="text-gray-600">{debate.descricao}</p>
</div>
);
}