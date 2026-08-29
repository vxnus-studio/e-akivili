import { NextResponse } from "next/server";

export async function GET() {
  const days: Record<number, { dayName: string; chars: any[]; weapons: any[] }> = {
    0: {
      dayName: "Sunday",
      chars: [
        { name: "Acheron", slug: "acheron", element: "Lightning", path: "Nihility", rarity: 5, talentBook: "Fiery Spirit", nation: "Penacony" },
        { name: "Firefly", slug: "firefly", element: "Fire", path: "Destruction", rarity: 5, talentBook: "Borisin Teeth", nation: "Penacony" },
        { name: "Robin", slug: "robin", element: "Physical", path: "Harmony", rarity: 5, talentBook: "Heavenly Melody", nation: "Penacony" },
        { name: "Aventurine", slug: "aventurine", element: "Imaginary", path: "Preservation", rarity: 5, talentBook: "Amber", nation: "IPC" },
        { name: "Kafka", slug: "kafka", element: "Lightning", path: "Nihility", rarity: 5, talentBook: "Obsidian", nation: "Stellaron Hunters" },
        { name: "Feixiao", slug: "feixiao", element: "Wind", path: "The Hunt", rarity: 5, talentBook: "Meteoric Bullet", nation: "Xianzhou Yaoqing" },
      ],
      weapons: [
        { name: "Along the Passing Shore", slug: "along-the-passing-shore", type: "Nihility", rarity: 5, material: "Fiery Spirit", nation: "Penacony" },
        { name: "Whereabouts Should Dreams Rest", slug: "whereabouts-should-dreams-rest", type: "Destruction", rarity: 5, material: "Borisin Teeth", nation: "Penacony" },
        { name: "Flowing Nightglow", slug: "flowing-nightglow", type: "Harmony", rarity: 5, material: "Heavenly Melody", nation: "Penacony" },
        { name: "Inherently Unjust Destiny", slug: "inherently-unjust-destiny", type: "Preservation", rarity: 5, material: "Amber", nation: "IPC" },
        { name: "Patience Is All You Need", slug: "patience-is-all-you-need", type: "Nihility", rarity: 5, material: "Obsidian", nation: "Stellaron Hunters" },
        { name: "I Venture Forth to Hunt", slug: "i-venture-forth-to-hunt", type: "The Hunt", rarity: 5, material: "Meteoric Bullet", nation: "Xianzhou" },
      ],
    },
    1: {
      dayName: "Monday",
      chars: [
        { name: "Acheron", slug: "acheron", element: "Lightning", path: "Nihility", rarity: 5, talentBook: "Fiery Spirit", nation: "Penacony" },
        { name: "Feixiao", slug: "feixiao", element: "Wind", path: "The Hunt", rarity: 5, talentBook: "Meteoric Bullet", nation: "Xianzhou Yaoqing" },
        { name: "March 7th (Hunt)", slug: "march-7th-hunt", element: "Imaginary", path: "The Hunt", rarity: 4, talentBook: "Meteoric Bullet", nation: "Astral Express" },
        { name: "Jiaoqiu", slug: "jiaoqiu", element: "Fire", path: "Nihility", rarity: 5, talentBook: "Fiery Spirit", nation: "Xianzhou Yaoqing" },
        { name: "Black Swan", slug: "black-swan", element: "Wind", path: "Nihility", rarity: 5, talentBook: "Fiery Spirit", nation: "Garden of Recollection" },
        { name: "Boothill", slug: "boothill", element: "Physical", path: "The Hunt", rarity: 5, talentBook: "Meteoric Bullet", nation: "Galaxy Rangers" },
      ],
      weapons: [
        { name: "Along the Passing Shore", slug: "along-the-passing-shore", type: "Nihility", rarity: 5, material: "Fiery Spirit", nation: "Penacony" },
        { name: "I Venture Forth to Hunt", slug: "i-venture-forth-to-hunt", type: "The Hunt", rarity: 5, material: "Meteoric Bullet", nation: "Xianzhou" },
        { name: "Those Many Springs", slug: "those-many-springs", type: "Nihility", rarity: 5, material: "Fiery Spirit", nation: "Xianzhou" },
        { name: "Sailing Towards a Second Life", slug: "sailing-towards-a-second-life", type: "The Hunt", rarity: 5, material: "Meteoric Bullet", nation: "Galaxy Rangers" },
      ],
    },
    2: {
      dayName: "Tuesday",
      chars: [
        { name: "Firefly", slug: "firefly", element: "Fire", path: "Destruction", rarity: 5, talentBook: "Borisin Teeth", nation: "Penacony" },
        { name: "Aventurine", slug: "aventurine", element: "Imaginary", path: "Preservation", rarity: 5, talentBook: "Amber", nation: "IPC" },
        { name: "Yunli", slug: "yunli", element: "Physical", path: "Destruction", rarity: 5, talentBook: "Borisin Teeth", nation: "Xianzhou Zhurong" },
        { name: "Jingliu", slug: "jingliu", element: "Ice", path: "Destruction", rarity: 5, talentBook: "Shattered Blade", nation: "Xianzhou Luofu" },
        { name: "Dan Heng IL", slug: "dan-heng-il", element: "Imaginary", path: "Destruction", rarity: 5, talentBook: "Shattered Blade", nation: "Astral Express" },
        { name: "Fu Xuan", slug: "fu-xuan", element: "Quantum", path: "Preservation", rarity: 5, talentBook: "Bronze", nation: "Xianzhou Luofu" },
      ],
      weapons: [
        { name: "Whereabouts Should Dreams Rest", slug: "whereabouts-should-dreams-rest", type: "Destruction", rarity: 5, material: "Borisin Teeth", nation: "Penacony" },
        { name: "Inherently Unjust Destiny", slug: "inherently-unjust-destiny", type: "Preservation", rarity: 5, material: "Amber", nation: "IPC" },
        { name: "Dance at Sunset", slug: "dance-at-sunset", type: "Destruction", rarity: 5, material: "Borisin Teeth", nation: "Xianzhou" },
        { name: "I Shall Be My Own Sword", slug: "i-shall-be-my-own-sword", type: "Destruction", rarity: 5, material: "Shattered Blade", nation: "Xianzhou" },
      ],
    },
    3: {
      dayName: "Wednesday",
      chars: [
        { name: "Robin", slug: "robin", element: "Physical", path: "Harmony", rarity: 5, talentBook: "Heavenly Melody", nation: "Penacony" },
        { name: "Sparkle", slug: "sparkle", element: "Quantum", path: "Harmony", rarity: 5, talentBook: "Heavenly Melody", nation: "Masked Fools" },
        { name: "Ruan Mei", slug: "ruan-mei", element: "Ice", path: "Harmony", rarity: 5, talentBook: "Harmonic Tune", nation: "Genius Society" },
        { name: "Sunday", slug: "sunday", element: "Imaginary", path: "Harmony", rarity: 5, talentBook: "Heavenly Melody", nation: "The Family" },
        { name: "Tingyun", slug: "tingyun", element: "Lightning", path: "Harmony", rarity: 4, talentBook: "Harmonic Tune", nation: "Xianzhou Luofu" },
        { name: "Fugue", slug: "fugue", element: "Fire", path: "Nihility", rarity: 5, talentBook: "Fiery Spirit", nation: "Xianzhou Luofu" },
      ],
      weapons: [
        { name: "Flowing Nightglow", slug: "flowing-nightglow", type: "Harmony", rarity: 5, material: "Heavenly Melody", nation: "Penacony" },
        { name: "Earthly Escapade", slug: "earthly-escapade", type: "Harmony", rarity: 5, material: "Heavenly Melody", nation: "Masked Fools" },
        { name: "Past Self in Mirror", slug: "past-self-in-mirror", type: "Harmony", rarity: 5, material: "Harmonic Tune", nation: "Genius Society" },
        { name: "A Grounded Ascent", slug: "a-grounded-ascent", type: "Harmony", rarity: 5, material: "Heavenly Melody", nation: "The Family" },
      ],
    },
    4: {
      dayName: "Thursday",
      chars: [
        { name: "Acheron", slug: "acheron", element: "Lightning", path: "Nihility", rarity: 5, talentBook: "Fiery Spirit", nation: "Penacony" },
        { name: "Feixiao", slug: "feixiao", element: "Wind", path: "The Hunt", rarity: 5, talentBook: "Meteoric Bullet", nation: "Xianzhou Yaoqing" },
        { name: "Topaz & Numby", slug: "topaz-and-numby", element: "Fire", path: "The Hunt", rarity: 5, talentBook: "Arrow of the Beast Hunter", nation: "IPC" },
        { name: "Dr. Ratio", slug: "dr-ratio", element: "Imaginary", path: "The Hunt", rarity: 5, talentBook: "Arrow of the Beast Hunter", nation: "Intelligentsia Guild" },
        { name: "Silver Wolf", slug: "silver-wolf", element: "Quantum", path: "Nihility", rarity: 5, talentBook: "Obsidian", nation: "Stellaron Hunters" },
        { name: "Moze", slug: "moze", element: "Lightning", path: "The Hunt", rarity: 4, talentBook: "Meteoric Bullet", nation: "Xianzhou Yaoqing" },
      ],
      weapons: [
        { name: "Along the Passing Shore", slug: "along-the-passing-shore", type: "Nihility", rarity: 5, material: "Fiery Spirit", nation: "Penacony" },
        { name: "I Venture Forth to Hunt", slug: "i-venture-forth-to-hunt", type: "The Hunt", rarity: 5, material: "Meteoric Bullet", nation: "Xianzhou" },
        { name: "Worrisome, Blissful", slug: "worrisome-blissful", type: "The Hunt", rarity: 5, material: "Arrow of the Beast Hunter", nation: "IPC" },
        { name: "Baptism of Pure Thought", slug: "baptism-of-pure-thought", type: "The Hunt", rarity: 5, material: "Arrow of the Beast Hunter", nation: "Intelligentsia Guild" },
      ],
    },
    5: {
      dayName: "Friday",
      chars: [
        { name: "Firefly", slug: "firefly", element: "Fire", path: "Destruction", rarity: 5, talentBook: "Borisin Teeth", nation: "Penacony" },
        { name: "Aventurine", slug: "aventurine", element: "Imaginary", path: "Preservation", rarity: 5, talentBook: "Amber", nation: "IPC" },
        { name: "Blade", slug: "blade", element: "Wind", path: "Destruction", rarity: 5, talentBook: "Shattered Blade", nation: "Stellaron Hunters" },
        { name: "Clara", slug: "clara", element: "Physical", path: "Destruction", rarity: 5, talentBook: "Shattered Blade", nation: "Belobog" },
        { name: "Gepard", slug: "gepard", element: "Ice", path: "Preservation", rarity: 5, talentBook: "Bronze", nation: "Belobog" },
        { name: "Gallagher", slug: "gallagher", element: "Fire", path: "Abundance", rarity: 4, talentBook: "Alien Tree Seed", nation: "Penacony" },
      ],
      weapons: [
        { name: "Whereabouts Should Dreams Rest", slug: "whereabouts-should-dreams-rest", type: "Destruction", rarity: 5, material: "Borisin Teeth", nation: "Penacony" },
        { name: "Inherently Unjust Destiny", slug: "inherently-unjust-destiny", type: "Preservation", rarity: 5, material: "Amber", nation: "IPC" },
        { name: "The Unreachable Side", slug: "the-unreachable-side", type: "Destruction", rarity: 5, material: "Shattered Blade", nation: "Stellaron Hunters" },
        { name: "Moment of Victory", slug: "moment-of-victory", type: "Preservation", rarity: 5, material: "Bronze", nation: "Belobog" },
      ],
    },
    6: {
      dayName: "Saturday",
      chars: [
        { name: "Robin", slug: "robin", element: "Physical", path: "Harmony", rarity: 5, talentBook: "Heavenly Melody", nation: "Penacony" },
        { name: "Lingsha", slug: "lingsha", element: "Fire", path: "Abundance", rarity: 5, talentBook: "Alien Tree Seed", nation: "Xianzhou Luofu" },
        { name: "Huo Huo", slug: "huohuo", element: "Wind", path: "Abundance", rarity: 5, talentBook: "Seed of Abundance", nation: "Xianzhou Luofu" },
        { name: "Luocha", slug: "luocha", element: "Imaginary", path: "Abundance", rarity: 5, talentBook: "Seed of Abundance", nation: "Outsider" },
        { name: "Jade", slug: "jade", element: "Quantum", path: "Erudition", rarity: 5, talentBook: "Rough Sketch", nation: "IPC" },
        { name: "The Herta", slug: "the-herta", element: "Ice", path: "Erudition", rarity: 5, talentBook: "Rough Sketch", nation: "Genius Society" },
      ],
      weapons: [
        { name: "Flowing Nightglow", slug: "flowing-nightglow", type: "Harmony", rarity: 5, material: "Heavenly Melody", nation: "Penacony" },
        { name: "Scent Alone Stays True", slug: "scent-alone-stays-true", type: "Abundance", rarity: 5, material: "Alien Tree Seed", nation: "Xianzhou" },
        { name: "Night of Fright", slug: "night-of-fright", type: "Abundance", rarity: 5, material: "Seed of Abundance", nation: "Xianzhou" },
        { name: "Echoes of the Coffin", slug: "echoes-of-the-coffin", type: "Abundance", rarity: 5, material: "Seed of Abundance", nation: "Outsider" },
      ],
    },
  };

  return NextResponse.json({ days });
}
