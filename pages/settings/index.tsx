import React from "react";
import Layout from "../../components/Layout";
import EventsTable from "./EventsTable";
import { GetStaticProps } from "next";
import prisma from "../../lib/prisma";
import Router from "next/router";
import SuppliersTable, { SupplierWithCount } from "./SuppliersTable";
import ItemsTable from "./ItemsTable";
import AuthorizedUsers from "./AuthorizedUsers";
import ProductssTable from "./ProductsTable";
import { AuthorizedUser, Prisma, Product, Event } from "@prisma/client";
export const getStaticProps: GetStaticProps = async () => {
  const events = await prisma.event.findMany();
  const authorizedUsers = await prisma.authorizedUser.findMany();
  const items = await prisma.item.findMany({
    include: {
      suppliers: {
        include: {
          suppliedUnit: true,
          supplier: true,
        },
      },
      units: true,
    },
  });
  const products = await prisma.product.findMany({
    include: {
      components: {
        include: {
          options: {
            include: {
              item: true,
              unit: true,
            },
          },
        },
      },
    },
  });
  const suppliers = await prisma.supplier.findMany({
    select: {
      name: true,
      _count: {
        select: {
          itemSupplier: true,
          orders: true,
        },
      },
    },
  });
  console.log("suppliers", suppliers);
  return {
    props: { events, suppliers, items, authorizedUsers, products },
    revalidate: 5,
  };
};

type Props = {
  events: Event[];
  suppliers: SupplierWithCount[];
  items: Prisma.ItemGetPayload<{
    include: {
      suppliers: {
        include: {
          suppliedUnit: true;
          supplier: true;
        };
      };
      units: true;
    };
  }>[];
  authorizedUsers: AuthorizedUser[];
  products: Prisma.ProductGetPayload<{
    include: {
      components: {
        include: {
          options: {
            include: {
              item: true;
              unit: true;
            };
          };
        };
      };
    };
  }>[];
};

export default function Settings({
  events,
  suppliers,
  items,
  authorizedUsers,
  products,
}: Props) {
  return (
    <Layout>
      <div className="page">
        <main>
          <h1>Settings</h1>
          <h1>Events</h1>
          <button
            onClick={() => {
              Router.push("/settings/create-event");
            }}
          >
            Create Event
          </button>
          <EventsTable events={events} />
          <h1>Suppliers</h1>
          <SuppliersTable suppliers={suppliers} />
          <h1>Items</h1>
          <button
            onClick={() => {
              Router.push("/settings/create-item");
            }}
          >
            Create Item
          </button>
          <ItemsTable items={items} />

          <h1>Products</h1>
          <button
            onClick={() => {
              Router.push("/settings/create-product");
            }}
          >
            Create Product
          </button>
          <ProductssTable products={products} />

          <h1>Authorized Users</h1>
          <AuthorizedUsers users={authorizedUsers} />
        </main>
      </div>
    </Layout>
  );
}
