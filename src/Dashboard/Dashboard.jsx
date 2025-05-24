import {
  ArrowDownRight,
  ArrowUpRight,
  Users,
  DollarSign,
  ShoppingCart,
  CreditCard,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import DashboardCharts from "./DBComponents/DashboardCharts";
import DashboardWidgets from "./DBComponents/DashboardWidgets";

export default function Dashboard() {
  return (
    <div className="p-1 pt-0 grid md:gap-4 grid-cols-1 xl:grid-cols-4">
      {/* Top Metrics */}
      <Card className="border-0 col-span-1 xl:col-span-4 bg-slate-900 text-white">
        <CardContent className="px-0 md:px-0 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <MetricBox
            icon={<DollarSign />}
            title="Total Earnings"
            value="$34,123.20 USD"
            change="+7.2%"
            up
          />
          <MetricBox
            icon={<ShoppingCart />}
            title="Total Orders"
            value="63,234 NOU"
            change="-7.2%"
          />
          <MetricBox
            icon={<Users />}
            title="Today Visitor"
            value="425,234 KDU"
            change="+2.4%"
            up
          />
          <MetricBox
            icon={<CreditCard />}
            title="Total Expense"
            value="$26,482.46 USD"
            change="+2.2%"
            up
          />
        </CardContent>
      </Card>
      {/* Charts */}
      <div className="col-span-1 xl:col-span-4">
        <DashboardCharts />
      </div>
      {/* Widgets */}
      <div className="col-span-1 xl:col-span-4">
        <DashboardWidgets />
      </div>
    </div>
  );
}

function MetricBox({ icon, title, value, change, up = false }) {
  const ArrowIcon = up ? ArrowUpRight : ArrowDownRight;
  const arrowClass = up ? "text-green-400" : "text-red-400";

  const showDropdown = title === "Total Earnings" || title === "Total Orders";

  return (
    <div className="bg-slate-800 rounded-xl p-3 md:p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-400">{title}</div>
        <div className="text-gray-300">{icon}</div>
      </div>
      <div className="text-base md:text-2xl font-bold">{value}</div>
      <div className="flex justify-between items-center gap-1">
        <div className={`flex items-center gap-1 text-sm ${arrowClass}`}>
          <ArrowIcon className="w-4 h-4" />
          {change}
        </div>
        {showDropdown && (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-300 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem className="text-gray-300 hover:bg-slate-700 cursor-pointer">
                Yearly
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-slate-700 cursor-pointer">
                Monthly
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-slate-700 cursor-pointer">
                Weekly
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-slate-700 cursor-pointer">
                Today
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
