import { Supplier } from "@prisma/client";
import React from "react";

export type SupplierWithCount = Supplier & {
  _count: {
    itemSupplier: number;
    orders: number;
  };
};
type Props = {
  suppliers: SupplierWithCount[];
};

export default function SuppliersTable({ suppliers }: Props) {
  const [newSupplier, setNewSupplier] = React.useState("");

  const addSupplier = async (name: string) => {
    await fetch("/api/supplier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    //refresh params
    window.location.reload();
  };
  return (
    <div>
      <input
        type="text"
        placeholder="New Supplier"
        value={newSupplier}
        onChange={(e) => setNewSupplier(e.target.value)}
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          addSupplier(newSupplier);
        }}
      >
        Add Supplier
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {suppliers?.map((supplier) => (
            <tr key={supplier.name}>
              <td>{supplier.name}</td>
              <td>
                <button
                  disabled={
                    supplier._count.itemSupplier > 0 ||
                    supplier._count.orders > 0
                  }
                  onClick={() => {
                    fetch("/api/supplier", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: supplier.name }),
                    });
                    window.location.reload();
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
