"use client";

import {
  Icon,
  BrandMark,
  Topbar as BaseTopbar,
  Sidebar as BaseSidebar,
  MobileBottomNav as BaseMobileBottomNav,
  type IconName,
  type NavItem,
  type DrawerSection,
  type TopbarProps,
  type SidebarProps,
  type MobileBottomNavProps,
} from "@vxnus/ui-game";
import { KnowledgeStatus } from "./knowledge-status";

export { Icon, BrandMark };
export type { IconName, NavItem, DrawerSection };

export const navigation: NavItem[] = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Characters", icon: "users", href: "/database/characters/" },
  { label: "Light Cones", icon: "sword", href: "/database/light-cones/" },
  { label: "Relics", icon: "artifact", href: "/database/relics/" },
  { label: "Enemies", icon: "enemy", href: "/database/enemies/" },
  { label: "Warps", icon: "calendar", href: "/database/banners/" },
  { label: "Lore Engine", icon: "sparkles", href: "/lore-engine/" },
  { label: "Knowledge", icon: "quest", href: "/knowledge/" },
  { label: "Explore", icon: "map", href: "/explore/" },
  { label: "API Docs", icon: "code", href: "/docs/" },
];

export const drawerDirectory: DrawerSection[] = [
  {
    category: "Database Archive",
    items: [
      { label: "Characters", href: "/database/characters/", icon: "users", desc: "Paths, traces & ascensions" },
      { label: "Light Cones", href: "/database/light-cones/", icon: "sword", desc: "Cone stats & superimpositions" },
      { label: "Relics", href: "/database/relics/", icon: "artifact", desc: "Relic sets & Planar Ornaments" },
      { label: "Materials", href: "/database/materials/", icon: "sparkles", desc: "Calyx & Stagnant Shadow drops" },
      { label: "Enemies", href: "/database/enemies/", icon: "enemy", desc: "Bosses & material drop tables" },
      { label: "Calyx & Domains", href: "/database/domains/", icon: "map", desc: "Buds of Memories & Echoes of War" },
    ],
  },
  {
    category: "Warp Intelligence",
    items: [
      { label: "Active Warps", href: "/database/banners/", icon: "calendar", desc: "Current Phase warp lineup" },
      { label: "Rotation Archive", href: "/database/banners/rotation/", icon: "clock", desc: "1.0 to current warp timeline" },
      { label: "Rerun Pressure", href: "/database/banners/rerun-pressure/", icon: "chevron", desc: "Historical warp forecasting" },
    ],
  },
  {
    category: "AI & Graph System",
    items: [
      { label: "Lore Engine", href: "/lore-engine/", icon: "sparkles", desc: "Books, readable curios & relic lore" },
      { label: "Knowledge Retrieval", href: "/knowledge/", icon: "quest", desc: "Trace entities & Astral facts" },
      { label: "Graph Explorer", href: "/explore/", icon: "map", desc: "Explore Star Rail graph entities" },
      { label: "API Documentation", href: "/docs/", icon: "code", desc: "Public endpoints & AI tool schemas" },
    ],
  },
  {
    category: "System",
    items: [
      { label: "Admin Console", href: "/admin/", icon: "grid", desc: "Dataset revisions & assets" },
    ],
  },
];

export const primaryMobileNavItems: NavItem[] = [
  { label: "Home", icon: "home", href: "/" },
  { label: "Characters", icon: "users", href: "/database/characters/" },
  { label: "Warps", icon: "calendar", href: "/database/banners/" },
  { label: "Knowledge", icon: "quest", href: "/knowledge/" },
];

export function Topbar(props: Partial<TopbarProps>) {
  return (
    <BaseTopbar
      brandName="E-Akivili"
      brandSubtext={
        <>
          by{" "}
          <a href="https://vxnus.xyz" target="_blank" rel="noopener noreferrer">
            VXNUS
          </a>
        </>
      }
      homeHref="/"
      brandLogo={<BrandMark />}
      statusSlot={<KnowledgeStatus />}
      homeAriaLabel="E-Akivili home"
      {...props}
    />
  );
}

export function Sidebar(props: Partial<SidebarProps>) {
  return <BaseSidebar items={navigation} statusTitle="Astral Archive online" {...props} />;
}

export function MobileBottomNav(props: Partial<MobileBottomNavProps>) {
  return (
    <BaseMobileBottomNav
      primaryItems={primaryMobileNavItems}
      drawerSections={drawerDirectory}
      drawerTitle="Navigation & Directory"
      drawerSubtext="Browse all E-Akivili knowledge archives"
      {...props}
    />
  );
}
