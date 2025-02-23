import { Cloud, Lock, Zap } from "lucide-react";

interface Tier {
  name: string
  price: number
  period: string
  description: string
  productId: string
  features: string[]
  icon: React.ElementType
  color: string
}

export const tiers: Tier[] = [
  {
    name: "Hobby",
    price: 0.000,
    period: "forever",
    description: "For individuals and small projects",
    productId: "Product ID: Hobby",
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
    icon: Cloud,
    color: "text-blue-500",
  },
  {
    name: "Pro",
    price: 199.000,
    period: "/month",
    description: "For growing businesses and teams",
    productId: "Product ID: Pro",
    features: ["Unlimited projects", "Advanced analytics", "Priority support", "Team collaboration"],
    icon: Zap,
    color: "text-yellow-500",
  },
  {
    name: "Enterprise",
    price: 399.000,
    period: "/month",
    description: "For large-scale operations and custom needs",
    productId: "Product ID: Enterprise",
    features: ["Custom solutions", "Dedicated account manager", "24/7 premium support", "Advanced security features"],
    icon: Lock,
    color: "text-purple-500",
  },
]
