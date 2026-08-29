"use client";

import { EntityHero, type TagItem } from "@vxnus/ui-game";

interface CharacterHeroProps {
  name: string;
  subtitle: string | null;
  eyebrow: string;
  stars: number;
  description: string;
  backHref: string;
  backLabel: string;
  tags: TagItem[];
  image: string | null;
  gameVersion: string | null;
  signalLabel: string;
}

export function CharacterHero({
  name,
  subtitle,
  eyebrow,
  stars,
  description,
  backHref,
  backLabel,
  tags,
  image,
  gameVersion,
  signalLabel,
}: CharacterHeroProps) {
  return (
    <EntityHero
      name={name}
      subtitle={subtitle}
      eyebrow={eyebrow}
      stars={stars}
      description={description}
      backHref={backHref}
      backLabel={backLabel}
      tags={tags}
      image={image}
      gameVersion={gameVersion}
      signalLabel={signalLabel}
      renderImage={
        image
          ? (src, altName) => (
              <div className="w-56 h-56 sm:w-72 sm:h-72 relative flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={altName}
                  width={280}
                  height={280}
                  className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] w-full h-full"
                />
              </div>
            )
          : undefined
      }
    />
  );
}
