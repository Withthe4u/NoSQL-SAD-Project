import mongoose, { Schema } from "mongoose";

const MenuCollectionSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});
const OrderItemCollectionSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 1 },
    pricePerItem: { type: Number, required: true },
    note: String,
  },
  { _id: false }
);
const OrderCollectionSchema = new Schema({
  customerName: String,
  items: [OrderItemCollectionSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

export const MenuCollection =
  mongoose.models.Menu || mongoose.model("Menu", MenuCollectionSchema);
export const OrderCollection =
  mongoose.models.Order || mongoose.model("Order", OrderCollectionSchema);
