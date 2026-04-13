"use client";

import { useState } from "react";
import type { Order, Menu } from "@/server/models";

interface CartItem {
  menuId: string;
  name: string;
  qty: number;
  pricePerItem: number;
  note?: string;
}

interface Props {
  initialMenus: Menu[];
  initialOrders: Order[];
}

export function RiceShop({ initialMenus, initialOrders }: Props) {
  const [tab, setTab] = useState<"order" | "orders">("order");
  const [menus, setMenus] = useState<Menu[]>(initialMenus);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");

  const [itemQty, setItemQty] = useState<Record<string, number>>({});
  const [itemNote, setItemNote] = useState<Record<string, string>>({});

  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuPrice, setNewMenuPrice] = useState("");
  const [editingPrice, setEditingPrice] = useState<Record<string, number>>({});

  const getId = (obj: any) => obj?.id || obj?._id;
  const getMenuId = (menu: any) => menu?.id || menu?._id;

  const addToCart = (menu: Menu, key: string) => {
    const qty = itemQty[key] || 1;
    const note = itemNote[key]?.trim() || "";

    setCart((prev) => [
      ...prev,
      {
        menuId: getMenuId(menu),
        name: menu.name,
        qty,
        pricePerItem: menu.price,
        note,
      },
    ]);

    setItemQty((prev) => ({ ...prev, [key]: 1 }));
    setItemNote((prev) => ({ ...prev, [key]: "" }));
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.qty * item.pricePerItem,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) return;

    const newOrder = {
      customerName: customerName || null,
      items: cart.map(({ name, qty, pricePerItem, note }) => ({
        name,
        qty,
        pricePerItem,
        note,
      })),
      totalPrice: cartTotal,
    };

    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    if (res.ok) {
      const created = await res.json();
      setOrders((prev) => [created, ...prev]);
      setCart([]);
      setCustomerName("");
    }
  };

  const completeOrder = async (order: any) => {
    const id = getId(order);
    if (!id) return;

    await fetch(`/api/order/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Completed" }),
    });

    setOrders((prev) =>
      prev.map((o) =>
        getId(o) === id ? { ...o, status: "Completed" as const } : o
      )
    );
  };

  const cancelOrder = async (order: any) => {
    const id = getId(order);
    if (!id) return;

    await fetch(`/api/order/${id}`, {
      method: "DELETE",
    });

    setOrders((prev) => prev.filter((o) => getId(o) !== id));
  };

  const addMenu = async () => {
    if (!newMenuName || !newMenuPrice) return;

    const res = await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menus: [
          {
            name: newMenuName,
            price: Number(newMenuPrice) || 0,
          },
        ],
      }),
    });

    if (res.ok) {
      const created = await res.json();
      setMenus((prev) => [...prev, ...created]);
      setNewMenuName("");
      setNewMenuPrice("");
    }
  };

  const updateMenuPrice = async (menu: any) => {
    const id = getMenuId(menu);
    if (!id) return;

    const newPrice = editingPrice[id];
    if (newPrice == null) return;

    await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: newPrice }),
    });

    setMenus((prev) =>
      prev.map((m) =>
        getMenuId(m) === id ? { ...m, price: newPrice } : m
      )
    );
  };

  const deleteMenu = async (menu: any) => {
    const id = getMenuId(menu);
    if (!id) return;

    await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });

    setMenus((prev) => prev.filter((m) => getMenuId(m) !== id));
    setCart((prev) => prev.filter((i) => i.menuId !== id));
  };

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const completedOrders = orders.filter((o) => o.status === "Completed");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Rice Shop</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("order")}
          className={`px-4 py-2 rounded ${tab === "order" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
            }`}
        >
          Order
        </button>

        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded ${tab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
            }`}
        >
          Orders
        </button>
      </div>

      {tab === "order" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Menu</h2>

          <div className="flex gap-2 mb-4">
            <input
              value={newMenuName}
              onChange={(e) => setNewMenuName(e.target.value)}
              className="border px-3 py-2 rounded"
              placeholder="Menu name"
            />

            <input
              value={newMenuPrice}
              onChange={(e) => setNewMenuPrice(e.target.value)}
              className="border px-3 py-2 rounded w-24"
              placeholder="Price"
            />

            <button
              onClick={addMenu}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Menu
            </button>
          </div>

          <table className="w-full border-collapse border mb-6">
            <tbody>
              {menus.map((menu, idx) => {
                const id = getMenuId(menu);
                const key = id || `menu-${idx}`;

                return (
                  <tr key={key}>
                    <td className="border p-2">{menu.name}</td>

                    <td className="border p-2">
                      <input
                        type="number"
                        value={editingPrice[id] ?? menu.price}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setEditingPrice((prev) => ({
                            ...prev,
                            [id]: Number.isNaN(v) ? 0 : v,
                          }));
                        }}
                        className="border px-2 py-1 rounded w-20"
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        type="number"
                        min="1"
                        value={itemQty[key] ?? 1}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          setItemQty((prev) => ({
                            ...prev,
                            [key]: v > 0 ? v : 1,
                          }));
                        }}
                        className="border px-2 py-1 rounded w-16"
                      />
                    </td>

                    <td className="border p-2">
                      <input
                        value={itemNote[key] ?? ""}
                        onChange={(e) =>
                          setItemNote((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="border px-2 py-1 rounded w-28"
                      />
                    </td>

                    <td className="border p-2">
                      <button
                        onClick={() => addToCart(menu, key)}
                        className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Add
                      </button>

                      <button
                        onClick={() => updateMenuPrice(menu)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => deleteMenu(menu)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mb-3">Cart</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Empty</p>
          ) : (
            <>
              <table className="w-full border-collapse border mb-4">
                <tbody>
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2">{item.qty}</td>
                      <td className="border p-2">
                        {item.qty * item.pricePerItem}
                      </td>
                      <td className="border p-2">{item.note || "-"}</td>
                      <td className="border p-2">
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="font-semibold mb-3">Total: {cartTotal}</p>

              <div className="flex gap-2">
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="border px-3 py-2 rounded"
                  placeholder="Customer name"
                />

                <button
                  onClick={placeOrder}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Place Order
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Pending Orders ({pendingOrders.length})
          </h2>

          <table className="w-full border-collapse border mb-6">
            <tbody>
              {pendingOrders.map((order) => {
                const id = getId(order);

                return (
                  <tr key={id}>
                    <td className="border p-2">
                      {order.customerName || "Guest"}
                    </td>
                    <td className="border p-2">
                      <div className="space-y-1">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="text-sm">
                            {item.name} x{item.qty} @ {item.pricePerItem} ={" "}
                            {item.qty * item.pricePerItem}
                            {item.note && (
                              <span className="text-gray-500">
                                {" "}
                                ({item.note})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="border p-2">{order.totalPrice}</td>

                    <td className="border p-2">
                      <button
                        onClick={() => completeOrder(order)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => cancelOrder(order)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mb-3">
            Completed Orders ({completedOrders.length})
          </h2>

          <table className="w-full border-collapse border">
            <tbody>
              {completedOrders.map((order) => (
                <tr key={getId(order)}>
                  <td className="border p-2">
                    {order.customerName || "Guest"}
                  </td>
                  <td className="border p-2">
                    <div className="space-y-1">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="text-sm">
                          {item.name} x{item.qty} @ {item.pricePerItem} ={" "}
                          {item.qty * item.pricePerItem}
                          {item.note && (
                            <span className="text-gray-500">
                              {" "}
                              ({item.note})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td className="border p-2">{order.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}