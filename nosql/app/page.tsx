import { Order, Menu } from "@/server/models"
import { RiceShop } from "@/components/home/rice-shop"

export default async function Page() {
  const [menus, orders]: [Menu[], Order[]] = await Promise.all([
    fetch(`${process.env.BASE_URL}/api/menu`).then((res) => res.json()),
    fetch(`${process.env.BASE_URL}/api/order`).then((res) => res.json()),
  ]
)

console.log("Menus data:", JSON.stringify(menus, null, 2));
console.log("Orders data:", JSON.stringify(orders, null, 2));

console.log("STEP 5: Data ready for UI rendering");


  return (
    <main>
      <RiceShop initialMenus={menus} initialOrders={orders} />
    </main>
  )
}
