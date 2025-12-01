// lightweight in-memory vote store for law votes (temporary store)
const votesStore = new Map<string, Map<string, boolean>>(); // lawId -> (userId -> vote)

export const vote = async (lawId: string, userId: string, voteValue: boolean) => {
  if (!votesStore.has(lawId)) votesStore.set(lawId, new Map());
  const map = votesStore.get(lawId)!;
  if (map.has(userId)) throw new Error('Already voted');
  map.set(userId, !!voteValue);
  return { lawId, userId, vote: !!voteValue };
};

export const getVoteCounts = async (lawId: string) => {
  const map = votesStore.get(lawId) || new Map();
  let forVotes = 0;
  let againstVotes = 0;
  for (const v of map.values()) {
    if (v) forVotes++;
    else againstVotes++;
  }
  return { for: forVotes, against: againstVotes };
};