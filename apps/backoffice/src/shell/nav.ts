import {
  Boxes,
  Building2,
  Calculator,
  ChartNoAxesColumn,
  Clock,
  Download,
  FileDown,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Shapes,
  Shield,
  ShoppingBag,
  Tag,
  Truck,
  Undo2,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  readonly label: string;
  readonly icon: LucideIcon;
  /** True when the section is structural only and not implemented in this preview. */
  readonly stub: boolean;
}

export interface NavGroup {
  readonly label: string;
  readonly items: readonly NavItem[];
}

/** Navigation model copied from the approved Reporting reference. Only Reports is live. */
export const NAV: readonly NavGroup[] = [
  { label: "Dashboard", items: [{ label: "Dashboard", icon: LayoutDashboard, stub: true }] },
  {
    label: "MASTERS",
    items: [
      { label: "Products", icon: Package, stub: true },
      { label: "Categories", icon: Shapes, stub: true },
      { label: "Brands", icon: Tag, stub: true },
      { label: "Suppliers", icon: Truck, stub: true },
      { label: "Customers", icon: Users, stub: true },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { label: "Purchases", icon: ShoppingBag, stub: true },
      { label: "Inventory", icon: Boxes, stub: true },
      { label: "Sales", icon: Receipt, stub: true },
      { label: "Returns", icon: Undo2, stub: true },
      { label: "Cash & Shifts", icon: Clock, stub: true },
    ],
  },
  { label: "FINANCE", items: [{ label: "Accounting", icon: Calculator, stub: true }] },
  {
    label: "MANAGEMENT",
    items: [{ label: "Reports", icon: ChartNoAxesColumn, stub: false }],
  },
  {
    label: "TOOLS",
    items: [
      { label: "Import Center", icon: FileDown, stub: true },
      { label: "Export Center", icon: Download, stub: true },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { label: "Users & Access", icon: Shield, stub: true },
      { label: "Organization", icon: Building2, stub: true },
      { label: "Settings", icon: Settings, stub: true },
    ],
  },
];
