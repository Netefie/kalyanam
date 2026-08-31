// Single source of truth for turning a RoomType's rate configuration into the
// list of sellable plans. Every caller (public room list, room detail,
// booking creation) goes through here so "room has no rate plans yet" is
// handled in exactly one place instead of being re-derived per controller.

// Rooms created before rate plans existed (or left blank in the admin) fall
// back to a single plan built from the room's own price/breakfast fields.
function fallbackPlan(room) {
  return {
    code: "standard",
    name: room.breakfast ? "Room with Breakfast" : "Room Only",
    label: "Standard Rate",
    price: room.price,
    offerPrice: room.offerPrice ?? room.price,
    breakfast: room.breakfast,
    refundable: Boolean(room.cancellation),
    inclusions: room.breakfast
      ? ["Inclusive of a buffet breakfast at a designated dining venue"]
      : [],
    active: true,
  };
}

// Active rate plans for a room, always non-empty.
export function resolveRatePlans(room) {
  const plans = (room.ratePlans || []).filter((plan) => plan.active !== false);
  if (plans.length === 0) return [fallbackPlan(room)];

  return plans.map((plan) => ({
    ...(plan.toObject ? plan.toObject() : plan),
    offerPrice: plan.offerPrice ?? plan.price,
  }));
}

// The plan a booking should be priced against: the requested code if it
// matches, otherwise the first resolved plan (keeps `ratePlanCode` optional).
export function findRatePlan(room, code) {
  const plans = resolveRatePlans(room);
  if (!code) return plans[0];
  return plans.find((plan) => plan.code === code) || plans[0];
}

// Shape a RoomType document/lean-object for API responses: always carries a
// populated `ratePlans` array, regardless of what's actually stored.
export function toPublicRoom(room) {
  const plain = room.toObject ? room.toObject() : room;
  // `.lean()` reads return whatever's actually in MongoDB, schema changes
  // notwithstanding — a document written before `availableRooms` was
  // removed from models/RoomType.js still has it stored. Availability is
  // always date-range-dependent and computed live (services/availability.js),
  // so this stale static number must never leak into a response as if it
  // still meant something.
  delete plain.availableRooms;
  return { ...plain, ratePlans: resolveRatePlans(room) };
}
