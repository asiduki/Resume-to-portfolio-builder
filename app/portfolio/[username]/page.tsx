import { notFound } from "next/navigation";

import { connectToDatabase } from "@/app/lib/db";
import Portfolio from "@/models/Portfolio";

import { getTemplate } from "@/components/templates";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;

  console.log("Searching username:", username);

  await connectToDatabase();

  const portfolio = await Portfolio.findOne({ username }).lean();

  console.log("Portfolio:", portfolio);

  if (!portfolio) {
    notFound();
  }

  const Template = getTemplate(portfolio.template);

  return <Template portfolio={portfolio} />;
}