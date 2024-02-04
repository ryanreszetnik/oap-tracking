import React from "react";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import CapacityReport, {
  CapacityReportProps,
} from "../components/CapacityReport";
import prisma from "../lib/prisma";
import DashboardAction from "../components/DashboardAction";

export const getStaticProps: GetStaticProps = async () => {
  const latestCapacityReport = await prisma.capacityReport.findFirst({
    orderBy: {
      timestamp: "desc",
    },
  });
  console.log(latestCapacityReport);
  return {
    props: { latestCapacityReport },
    revalidate: 10,
  };
};

type Props = {
  latestCapacityReport?: CapacityReportProps;
};
const Tracking: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <main>
          <DashboardAction action="Report Capacity" href="/reports/capacity" />
          <DashboardAction action="Checkout Item" href="/reports/checkout" />
          <DashboardAction action="Report Stock" href="/reports/stock" />
          <DashboardAction action="Order" href="/reports/order" />
          <DashboardAction action="Profits" href="/reports/profit" />
          <CapacityReport capacityReport={props.latestCapacityReport} />
        </main>
      </div>
    </Layout>
  );
};

export default Tracking;
