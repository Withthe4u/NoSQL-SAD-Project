import { Order, Menu } from "@/server/models"
import { RiceShop } from "@/components/home/rice-shop"

export default async function Page() {
  const [menus, orders]: [Menu[], Order[]] = await Promise.all([
    fetch(`${process.env.BASE_URL}/api/menu`).then((res) => res.json()),
    fetch(`${process.env.BASE_URL}/api/order`).then((res) => res.json()),
  ])

  return (
    <main>
      <RiceShop initialMenus={menus} initialOrders={orders} />
    </main>
  )
}
