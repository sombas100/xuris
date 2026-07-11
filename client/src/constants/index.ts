export const navLinks = [
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about'},
    { name: 'FAQ', href: '/faq' },
]

import {
  BriefcaseBusiness,
  FilePenLine,
  FileSearch,
  LayoutDashboard,
  MessagesSquare,
  ScanSearch,
} from "lucide-react";

export const dashboardLinks = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Resume analysis",
    href: "/dashboard/resume-analysis",
    icon: FileSearch,
  },
  {
    name: "Job comparison",
    href: "/dashboard/job-comparison",
    icon: ScanSearch,
  },
  {
    name: "Cover letters",
    href: "/dashboard/cover-letters",
    icon: FilePenLine,
  },
  {
    name: "Interview prep",
    href: "/dashboard/interview-prep",
    icon: MessagesSquare,
  },
  {
    name: "Applications",
    href: "/dashboard/applications",
    icon: BriefcaseBusiness,
  },
];