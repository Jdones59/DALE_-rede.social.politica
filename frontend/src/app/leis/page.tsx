'use client';
import { useEffect, useState } from "react";
import { getLaws } from "@/services/laws.service";
import LawCard from "@/components/LawCard";


export default function Leis() {
const [laws, setLaws] = useState([]);


useEffect(() => {
getLaws().then(res => setLaws(res));
}, []);


return (
<div>
<h1 className="text-3xl font-bold">Leis</h1>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
{laws.map((law: any) => (
<LawCard key={law._id} law={law} />
))}
</div>
</div>
);
}