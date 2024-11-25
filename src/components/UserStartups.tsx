import { client } from "@/sanity/lib/client";
import { STARTUPS_BY_AUTHOR_QUERY } from "@/sanity/lib/queries";
import StartupCard, { StartupCardType } from "./StartupCard";

interface UserStartupsProps {
  id: string;
}

export default async function UserStartups({ id }: UserStartupsProps) {
  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id });

  return (
    <>
      {startups.length > 0 ? (
        startups.map((startup: StartupCardType, idx: number) => (
          <StartupCard key={`${idx}-${startup._id}`} post={startup} />
        ))
      ) : (
        <p className="no-result">No startups yet.</p>
      )}
    </>
  );
}
