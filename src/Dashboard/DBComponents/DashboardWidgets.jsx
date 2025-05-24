import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

const data = [
  {
    label: "Product Pending",
    orders: "17,351",
    returns: "2,123",
    earnings: "+45.3%",
    earningsClass: "text-green-400",
  },
  {
    label: "Product Cancelled",
    orders: "67,356",
    returns: "3,652",
    earnings: "-14.6%",
    earningsClass: "text-red-400",
  },
  {
    label: "Product Delivered",
    orders: "67,356",
    returns: "3,652",
    earnings: "-14.6%",
    earningsClass: "text-red-400",
  },
];

export default function DashboardWidgets() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-10 gap-4">
      <Card className="bg-slate-800 col-span-1 sm:col-span-2 xl:col-span-5 border-0 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center pb-5">
            <div className="text-xl font-semibold">Sales Statistics</div>
            <div className="text-gray-400 text-sm">Today</div>
          </div>
          <div className="overflow-x-auto">
            <table className="text-gray-300 min-w-full">
              <thead className="text-sm text-gray-400 uppercase bg-slate-800">
                <tr className="text-left">
                  <th className="py-2">Order Status</th>
                  <th className="px-2 py-2">Orders</th>
                  <th className="px-2 py-2">Returns</th>
                  <th className="px-2 py-2">Earnings</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={index}
                    className="bg-slate-800 border-b text-sm border-slate-700"
                  >
                    <td className="whitespace-nowrap py-2">{item.label}</td>
                    <td className="px-2 py-2">{item.orders}</td>
                    <td className="px-2 py-2">{item.returns}</td>
                    <td className={`px-2 py-2 ${item.earningsClass}`}>
                      {item.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* </div> */}
          {/* <SalesStat
              label="Product Pending"
              orders="17,351"
              returns="2,123"
              earnings="+45.3%"
            />
            <SalesStat
              label="Product Cancelled"
              orders="67,356"
              returns="3,652"
              earnings="-14.6%"
              down
            />
            <SalesStat
              label="Product Delivered"
              orders="67,356"
              returns="3,652"
              earnings="-14.6%"
            /> */}
          {/* </div> */}
          <Button variant="outline" className="w-full bg-[#0B6D7F] mt-4">
            View More
          </Button>
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card className="bg-slate-800 col-span-1 sm:col-span-2 xl:col-span-5 border-0 text-white">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold">Top Users</div>
            <div className="text-gray-400 text-sm">Sort By: Yearly</div>
          </div>
          <div className="mt-4">
            {[
              {
                name: "Glenn Holden",
                email: "glennholden@tocly.com",
                status: "Cancel",
                amount: "$250.00",
                statusClass: "text-red-400 bg-red-900",
              },
              {
                name: "Lolita Hamill",
                email: "lolitahamill@tocly.com",
                status: "Success",
                amount: "$110.00",
                statusClass: "text-green-400 bg-green-900",
              },
              {
                name: "Robert Mercer",
                email: "robertmercer@tocly.com",
                status: "Active",
                amount: "$420.00",
                statusClass: "text-blue-400 bg-blue-900",
              },
              {
                name: "Marie Kim",
                email: "mariekim@tocly.com",
                status: "Pending",
                amount: "$120.00",
                statusClass: "text-yellow-400 bg-yellow-900",
              },
              {
                name: "Sonya Henshaw",
                email: "sonyahenshaw@tocly.com",
                status: "Active",
                amount: "$112.00",
                statusClass: "text-blue-400 bg-blue-900",
              },
            ].map((user, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b border-slate-800"
              >
                <div>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-sm text-gray-400">{user.email}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{user.amount}</div>
                  <div
                    className={`text-sm px-2 py-1 rounded-full ${user.statusClass}`}
                  >
                    {user.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SalesStat({ label, orders, returns, earnings, down = false }) {
  const arrowClass = down ? "text-red-400" : "text-green-400";
  const bgClass = down ? "bg-red-900" : "bg-green-900";
  return (
    <div className={`bg-slate-800 rounded-lg p-3`}>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-gray-300 text-sm">{orders} orders</span>
        <span className="text-gray-300 text-sm">{returns} returns</span>
      </div>
      <div
        className={`text-sm px-2 py-1 mt-2 rounded-full ${arrowClass} ${bgClass}`}
      >
        {earnings}
      </div>
    </div>
  );
}
