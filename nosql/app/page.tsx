export default async function page() {
  const [menus, orders] = await Promise.all([
    fetch(`${process.env.BASE_URL}/api/menu`).then((res) => res.json()),
    fetch(`${process.env.BASE_URL}/api/order`).then((res) => res.json()),
  ]);

  console.log(menus, orders);
  return <div>page</div>;
}
