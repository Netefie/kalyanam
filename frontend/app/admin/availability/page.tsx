"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, getDay } from "date-fns";
import { ChevronLeft, ChevronRight, Ban, Trash2, Plus } from "lucide-react";
import { api, ApiError, type Room, type RoomBlock, type AvailabilityCalendarResponse } from "@/lib/api";
import { availabilityLabel } from "@/lib/availability";

// Room-type × day calendar grid, backed by GET /rooms/availability/calendar
// (backend/src/services/availability.js#getDailyAvailability) — the live
// replacement for the old placeholder "coming soon" panel. Also the CRUD
// front-end for RoomBlock (backend/src/models/RoomBlock.js), which is what
// lets staff actually take inventory off sale for maintenance, an owner
// stay, or a group hold.
export default function AvailabilityPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [slug, setSlug] = useState("");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [calendar, setCalendar] = useState<AvailabilityCalendarResponse | null>(null);
  const [blocks, setBlocks] = useState<RoomBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showBlockForm, setShowBlockForm] = useState(false);
  const [blockFrom, setBlockFrom] = useState("");
  const [blockTo, setBlockTo] = useState("");
  const [blockRooms, setBlockRooms] = useState(1);
  const [blockReason, setBlockReason] = useState("");
  const [blockError, setBlockError] = useState("");
  const [savingBlock, setSavingBlock] = useState(false);

  // Rooms list — populates the room-type selector, and lets ?slug= (linked
  // from the Rooms page's "View live availability") preselect one.
  useEffect(() => {
    api.rooms.listAll().then((data) => {
      setRooms(data);
      if (data.length === 0) return;
      const params = new URLSearchParams(window.location.search);
      const requested = params.get("slug");
      setSlug(requested && data.some((r) => r.slug === requested) ? requested : data[0].slug);
    });
  }, []);

  const room = useMemo(() => rooms.find((r) => r.slug === slug) || null, [rooms, slug]);

  const load = useCallback(async () => {
    if (!slug || !room) return;
    setLoading(true);
    setError("");
    try {
      const from = month;
      const to = endOfMonth(month);
      const [calendarRes, blocksRes] = await Promise.all([
        api.rooms.availabilityCalendar(from.toISOString(), to.toISOString(), slug),
        api.roomBlocks.list({ roomType: room._id, from: from.toISOString(), to: to.toISOString() }),
      ]);
      setCalendar(calendarRes);
      setBlocks(blocksRes.items);
    } catch {
      setError("Failed to load availability.");
    } finally {
      setLoading(false);
    }
  }, [slug, room, month]);

  useEffect(() => {
    load();
  }, [load]);

  const days = calendar?.rooms[0]?.days ?? [];
  // Leading blanks so the 1st of the month lines up under the right
  // weekday column instead of always starting at the grid's first cell.
  const leadingBlanks = days.length > 0 ? getDay(new Date(days[0].date)) : 0;

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    setBlockError("");

    if (!blockFrom || !blockTo) {
      setBlockError("Both dates are required.");
      return;
    }
    setSavingBlock(true);
    try {
      await api.roomBlocks.create({
        roomType: room._id,
        from: blockFrom,
        to: blockTo,
        rooms: blockRooms,
        reason: blockReason.trim() || undefined,
      });
      setShowBlockForm(false);
      setBlockFrom("");
      setBlockTo("");
      setBlockRooms(1);
      setBlockReason("");
      await load();
    } catch (err) {
      setBlockError(err instanceof ApiError ? err.message : "Could not create the block.");
    } finally {
      setSavingBlock(false);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    if (!window.confirm("Remove this block? The rooms will become bookable again.")) return;
    try {
      await api.roomBlocks.remove(id);
      await load();
    } catch {
      alert("Could not remove the block.");
    }
  };

  return (
    <div className="availabilityPage">
      <div className="header">
        <div>
          <h2>Availability</h2>
          <p>Live occupancy by day, and inventory blocks for maintenance, owner stays or group holds.</p>
        </div>
      </div>

      <div className="controls">
        <select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {rooms.map((r) => (
            <option key={r.slug} value={r.slug}>
              {r.name}
            </option>
          ))}
        </select>

        <div className="monthNav">
          <button onClick={() => setMonth((m) => subMonths(m, 1))} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <span>{format(month, "MMMM yyyy")}</span>
          <button onClick={() => setMonth((m) => addMonths(m, 1))} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>

        <button className="blockBtn" onClick={() => setShowBlockForm((v) => !v)}>
          <Ban size={16} /> Block dates
        </button>
      </div>

      {showBlockForm && (
        <form className="blockForm" onSubmit={handleCreateBlock}>
          <div className="field">
            <label>From</label>
            <input type="date" value={blockFrom} onChange={(e) => setBlockFrom(e.target.value)} required />
          </div>
          <div className="field">
            <label>To</label>
            <input type="date" value={blockTo} onChange={(e) => setBlockTo(e.target.value)} required />
          </div>
          <div className="field">
            <label>Rooms</label>
            <input
              type="number"
              min={1}
              max={room?.totalRooms || 1}
              value={blockRooms}
              onChange={(e) => setBlockRooms(Number(e.target.value))}
            />
          </div>
          <div className="field grow">
            <label>Reason</label>
            <input value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Maintenance, owner stay…" />
          </div>
          <button type="submit" disabled={savingBlock} className="submitBtn">
            <Plus size={16} /> {savingBlock ? "Saving…" : "Add block"}
          </button>
          {blockError && <p className="formError">{blockError}</p>}
        </form>
      )}

      {error && <div className="errorBox">{error}</div>}

      {loading ? (
        <p className="muted">Loading…</p>
      ) : (
        <>
          <div className="legend">
            <span><i className="dot available" /> Available</span>
            <span><i className="dot low" /> Only a few left</span>
            <span><i className="dot soldOut" /> Sold out</span>
          </div>

          {/* Its own x-scroller: seven equal columns squeezed into a zoomed-in
              viewport become unreadable slivers, so below `min-width` the grid
              scrolls sideways instead of shrinking. */}
          <div className="gridScroll">
          <div className="grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="weekday">{d}</div>
            ))}

            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} className="cell blank" />
            ))}

            {days.map((day) => {
              const status = availabilityLabel(day.available, 1);
              return (
                <div key={day.date} className={`cell ${status.tone}`}>
                  <span className="dayNum">{Number(day.date.slice(-2))}</span>
                  <span className="dayCount">
                    {day.available}/{day.total}
                  </span>
                </div>
              );
            })}
          </div>
          </div>

          <div className="blockList">
            <h3>Blocks this month</h3>
            {blocks.length === 0 ? (
              <p className="muted">No blocks for this room in {format(month, "MMMM yyyy")}.</p>
            ) : (
              <ul>
                {blocks.map((b) => (
                  <li key={b._id}>
                    <span>
                      {format(new Date(b.from), "dd MMM")} – {format(new Date(b.to), "dd MMM yyyy")} ·{" "}
                      {b.rooms} room{b.rooms > 1 ? "s" : ""}
                      {b.reason ? ` · ${b.reason}` : ""}
                    </span>
                    <button onClick={() => handleDeleteBlock(b._id)} title="Remove block">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .availabilityPage {
          padding: 4px;
        }

        .header {
          margin-bottom: 22px;
        }

        .header h2 {
          margin: 0;
          font-size: 34px;
          font-family: var(--font-cormorant);
          color: #222;
        }

        .header p {
          margin-top: 6px;
          color: #777;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        select {
          border: 1px solid #e2ddd0;
          border-radius: 10px;
          padding: 10px 14px;
          font-size: 14px;
          background: #fff;
        }

        .monthNav {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          color: #222;
        }

        .monthNav button {
          border: 1px solid #e2ddd0;
          background: #fff;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .monthNav button:hover {
          background: #f3ecdd;
        }

        .blockBtn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          background: #b68d40;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .blockBtn:hover {
          background: #a57d35;
        }

        .blockForm {
          display: flex;
          align-items: flex-end;
          gap: 14px;
          flex-wrap: wrap;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          padding: 18px;
          margin-bottom: 20px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .field.grow {
          flex: 1;
          min-width: 160px;
        }

        label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        input {
          border: 1px solid #e2ddd0;
          border-radius: 8px;
          padding: 8px 10px;
          font-size: 14px;
        }

        .submitBtn {
          display: flex;
          align-items: center;
          gap: 6px;
          border: none;
          border-radius: 10px;
          padding: 10px 18px;
          background: #222;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          height: 38px;
        }

        .submitBtn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .formError {
          width: 100%;
          color: #b91c1c;
          font-size: 13px;
        }

        .errorBox {
          background: #fdecec;
          border: 1px solid #f5c6c6;
          color: #b91c1c;
          padding: 14px 18px;
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .muted {
          color: #999;
          padding: 20px 0;
        }

        .legend {
          display: flex;
          gap: 20px;
          margin-bottom: 14px;
          font-size: 13px;
          color: #666;
        }

        .legend span {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot.available {
          background: #2f9e56;
        }

        .dot.low {
          background: #d97706;
        }

        .dot.soldOut {
          background: #dc2626;
        }

        .gridScroll {
          overflow-x: auto;
          overscroll-behavior-x: contain;
          /* Room for the grid card's drop shadow, which the scroller would
             otherwise clip along the bottom edge. */
          padding-bottom: 12px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          /* Floor below which seven columns stop being readable and .gridScroll
             takes over. The mobile rules below tighten the cells for real
             phones, so the floor drops with them. */
          min-width: 640px;
          gap: 8px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          padding: 20px;
        }

        .weekday {
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          padding-bottom: 6px;
        }

        .cell {
          border-radius: 10px;
          padding: 10px 6px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 56px;
        }

        .cell.blank {
          visibility: hidden;
        }

        .cell.available {
          background: #eefbf1;
        }

        .cell.low {
          background: #fef6e7;
        }

        .cell.soldOut {
          background: #fdecec;
        }

        .cell.unknown {
          background: #f5f5f5;
        }

        .dayNum {
          font-weight: 700;
          color: #222;
          font-size: 14px;
        }

        .dayCount {
          font-size: 11px;
          color: #777;
        }

        .blockList {
          margin-top: 24px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.05);
          padding: 20px 24px;
        }

        .blockList h3 {
          margin: 0 0 12px;
          font-size: 16px;
          color: #222;
        }

        .blockList ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .blockList li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #444;
          border-bottom: 1px solid #f3f0e9;
          padding-bottom: 10px;
        }

        .blockList li:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .blockList button {
          border: none;
          background: transparent;
          color: #b91c1c;
          cursor: pointer;
          padding: 4px;
        }

        @media (max-width: 640px) {
          .grid {
            gap: 4px;
            padding: 12px;
            min-width: 260px;
          }

          .cell {
            padding: 6px 2px;
            min-height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
