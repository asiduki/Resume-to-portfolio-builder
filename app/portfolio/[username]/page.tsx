import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";

import { connectToDatabase } from "@/app/lib/db";
import Portfolio from "@/models/Portfolio";
import User from "@/models/usermodel";
import { authOptions } from "@/app/lib/auth";

import { getTemplate } from "@/components/templates";
import OwnerToolbar from "@/components/portfolio/OwnerToolbar";
import { normalizePortfolioUrls } from "@/app/lib/url";

interface Props {
  params: Promise<{
    username: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
}

export default async function PortfolioPage({ params, searchParams }: Props) {
  const { username } = await params;

  const { preview } = await searchParams;

  await connectToDatabase();

  const portfolio = await Portfolio.findOne({ username }).lean();

  if (!portfolio) {
    notFound();
  }

  const session = await getServerSession(authOptions);

  const isOwner =
    !!session?.user?.id &&
    portfolio.userId.toString() === session.user.id;

  if (!portfolio.published && !isOwner) {
    notFound();
  }

  if (!portfolio.personal?.profileImage) {
    const owner = await User.findById(portfolio.userId)
      .select("image")
      .lean();

    if (owner?.image?.startsWith("http") && portfolio.personal) {
      portfolio.personal.profileImage = owner.image;
    }
  }

  normalizePortfolioUrls(portfolio);

  const Template = getTemplate(portfolio.template);

  return (
    <>
      {isOwner && !preview && (
        <OwnerToolbar
          username={portfolio.username}
          name={portfolio.personal?.name || "My"}
          published={portfolio.published}
          profileImage={portfolio.personal?.profileImage}
        />
      )}

      {isOwner && !portfolio.published && !preview && (
        <div className="sticky top-0 z-40 bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950">
          Draft — only you can see this page. Visitors get a 404 until you
          publish.
        </div>
      )}

      <Template portfolio={portfolio} />
    </>
  );
}
