import SearchForm from "@/components/SearchForm";
import StartupCard, {
  StartupCardSkeleton,
  StartupCardType,
} from "@/components/StartupCard";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { Suspense } from "react";

export const experimental_ppr = true;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;
  const params = { search: query || null };

  const { data: posts } = await sanityFetch({
    query: STARTUPS_QUERY,
    params,
  });

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">
          Pitch your startup, <br />
          Connect With Entrepreneurs
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Copmpetion.
        </p>

        <SearchForm query={query} />
      </section>

      <section className="section_container">
        <Suspense fallback={<StartupCardSkeleton />}>
          <p className="text-30-semibold">
            {query ? `Search results for "${query}"` : "All Startups"}
          </p>
          <ul className="mt-7 card_grid">
            {posts?.length > 0 ? (
              posts.map((post: StartupCardType, index: number) => (
                <StartupCard key={post._id + index} post={post} />
              ))
            ) : (
              <p className="no-results">No Starups found</p>
            )}
          </ul>
        </Suspense>
      </section>
      <SanityLive />
    </>
  );
}
