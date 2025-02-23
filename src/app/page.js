"use client";

import {
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetOrdersQuery,
  useGetUsersQuery,
} from "@/lib/service/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const { role, isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || role !== "admin") {
      router.push("/auth/login");
    }
  }, [isAuthenticated, role, router]);

  const { data: products } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const { data: orders } = useGetOrdersQuery();
  const { data: users } = useGetUsersQuery();

  const stats = [
    {
      title: "Products",
      value: products?.length || 0,
      color: "rgb(255, 0, 0)",
    },
    {
      title: "Categories",
      value: categories?.length || 0,
      color: "rgb(55, 156, 103)",
    },
    { title: "Orders", value: orders?.length || 0, color: "rgb(255, 239, 88)" },
    { title: "Users", value: users?.length || 0, color: "rgb(0, 123, 255)" },
  ];

  const chartData = {
    labels: stats.map((stat) => stat.title),
    datasets: [
      {
        label: "Statistics",
        data: stats.map((stat) => stat.value),
        backgroundColor: stats.map((stat) => stat.color),
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Statistics Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <Bar data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
}
