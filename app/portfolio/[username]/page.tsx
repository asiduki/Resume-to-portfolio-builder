import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { connectToDatabase } from "@/app/lib/db";
import Portfolio from "@/models/Portfolio";
import { authOptions } from "@/app/lib/auth";

import { getTemplate } from "@/components/templates";
import OwnerToolbar from "@/components/portfolio/OwnerToolbar";

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;

  await connectToDatabase();

  const portfolio = await Portfolio.findOne({ username }).lean();

  if (!portfolio) {
    notFound();
  }

  // Ownership decides both draft visibility and the management toolbar
  const session = await getServerSession(authOptions);

  const isOwner =
    !!session?.user?.id &&
    portfolio.userId.toString() === session.user.id;

  // Unpublished portfolios are only visible to their owner
  if (!portfolio.published && !isOwner) {
    notFound();
  }

  const Template = getTemplate(portfolio.template);

  return (
    <>
      {isOwner && (
        <OwnerToolbar
          username={portfolio.username}
          name={portfolio.personal?.name || "My"}
          published={portfolio.published}
          profileImage={portfolio.personal?.profileImage}
        />
      )}

      <Template portfolio={portfolio} />
    </>
  );
}
