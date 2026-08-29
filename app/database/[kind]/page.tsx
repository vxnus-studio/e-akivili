import { notFound } from "next/navigation";
import { DatabaseShell } from "../../_components/database-shell";
import { EntityExplorer } from "../../_components/entity-explorer";

const pages = {
  characters: {
    eyebrow: "Character index",
    title: "Characters",
    description:
      "Paths, combat types, traces, ascension materials, and connected gameplay records.",
  },
  "light-cones": {
    eyebrow: "Equipment index",
    title: "Light Cones",
    description:
      "Light Cone abilities, base stats, ascension materials, and recommended paths.",
  },
  weapons: {
    eyebrow: "Equipment index",
    title: "Light Cones",
    description:
      "Light Cone abilities, base stats, ascension materials, and recommended paths.",
  },
  materials: {
    eyebrow: "Resource index",
    title: "Materials",
    description:
      "A normalized inventory of upgrade materials connected to Calyxes, Stagnant Shadows, Echoes of War, and synthesizers.",
  },
  domains: {
    eyebrow: "Farming index",
    title: "Calyx & Domains",
    description:
      "Buds of Memories, Buds of Aether, Stagnant Shadows, Caverns of Corrosion, and Echoes of War.",
  },
  relics: {
    eyebrow: "Equipment index",
    title: "Relics & Planar Ornaments",
    description:
      "Cavern Relics and Planar Ornament sets, set bonuses, and farming sources.",
  },
  artifacts: {
    eyebrow: "Equipment index",
    title: "Relics & Planar Ornaments",
    description:
      "Cavern Relics and Planar Ornament sets, set bonuses, and farming sources.",
  },
  enemies: {
    eyebrow: "Enemy index",
    title: "Enemies & Bosses",
    description:
      "Enemy records connected to material drops, weaknesses, elemental resistances, and weekly boss mechanics.",
  },
} as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages).map((kind) => ({ kind }));
}

export default async function DatabaseKindPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = await params;
  const page = pages[kind as keyof typeof pages];
  if (!page) notFound();

  return (
    <DatabaseShell {...page}>
      <EntityExplorer kind={kind} />
    </DatabaseShell>
  );
}
