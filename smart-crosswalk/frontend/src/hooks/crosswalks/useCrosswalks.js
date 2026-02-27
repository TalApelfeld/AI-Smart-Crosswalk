import { useCrosswalkList } from "./useCrosswalkList";
import { useCrosswalkStats } from "./useCrosswalkStats";
import { useCrosswalkMutations } from "./useCrosswalkMutations";
import { useCrosswalkLinkMutations } from "./useCrosswalkLinkMutations";

/**
 * useCrosswalks — convenience hook that combines list + stats + CRUD + link mutations.
 */
export function useCrosswalks() {
  const { crosswalks, loading, error, refetch } = useCrosswalkList();
  const { stats } = useCrosswalkStats();
  const { createCrosswalk, updateCrosswalk, deleteCrosswalk } = useCrosswalkMutations();
  const { linkCamera, unlinkCamera, linkLED, unlinkLED } = useCrosswalkLinkMutations();

  return {
    crosswalks, stats, loading, error, refetch,
    createCrosswalk, updateCrosswalk, deleteCrosswalk,
    linkCamera, unlinkCamera, linkLED, unlinkLED,
  };
}
