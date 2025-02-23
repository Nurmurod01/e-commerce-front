"use client";
import { useState } from "react";
import { useGetOrdersQuery, useUpdateOrderMutation } from "@/lib/service/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/Loading";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [updatingId, setUpdatingId] = useState(null);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateOrder({ id, status }).unwrap(); // unwrap() bilan aniq natijani olish
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error loading orders.</div>;
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().replace("T", " ").split(".")[0];
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {orders?.map((order) => (
          <Card key={order.id} className="p-4 w-full">
            <CardContent className="space-y-3">
              <p>
                <strong>Username:</strong> {order.user.name}
              </p>
              <p>
                <strong>Email:</strong> {order.user.email}
              </p>
              <p>
                <strong>Total Price:</strong> ${order.totalPrice}
              </p>
              <p className="capitalize">
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Order date:</strong> {formatDate(order.createdAt)}
              </p>

              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    handleUpdateStatus(
                      order.id,
                      order.status === "approved" ? "pending" : "approved"
                    )
                  }
                  disabled={updatingId === order.id}
                  className={`${
                    order.status === "approved"
                      ? "bg-yellow-500 hover:bg-yellow-400"
                      : "bg-blue-500 hover:bg-blue-400"
                  }  text-white`}
                >
                  {order.status === "approved" ? "Set Pending" : "Approve"}
                </Button>

                <Button
                  onClick={() =>
                    handleUpdateStatus(
                      order.id,
                      order.status === "rejected" ? "pending" : "rejected"
                    )
                  }
                  disabled={updatingId === order.id}
                  className={`${
                    order.status === "rejected"
                      ? "bg-yellow-500 hover:bg-yellow-400"
                      : "bg-red-500 hover:bg-red-400"
                  } text-white`}
                >
                  {order.status === "rejected" ? "Set Pending" : "Reject"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
