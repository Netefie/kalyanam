"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { api, ApiError, type Room, type RatePlan } from "@/lib/api";
import { slugify } from "@/lib/slugify";
import useScrollLock from "@/hooks/useScrollLock";
import RatePlanFields, {
  DEFAULT_RATE_PLANS,
} from "./RatePlanFields";

interface RoomFormModalProps {
  room: Room | null; // null → create, otherwise edit
  onClose: () => void;
  onSaved: () => void;
}

export default function RoomFormModal({
  room,
  onClose,
  onSaved,
}: RoomFormModalProps) {
  const isEdit = Boolean(room);

  const [form, setForm] = useState({
    name: room?.name ?? "",
    slug: room?.slug ?? "",
    description: room?.description ?? "",
    image: room?.image ?? "",
    price: room?.price ?? 0,
    offerPrice: room?.offerPrice ?? 0,
    size: room?.size ?? "",
    bed: room?.bed ?? "",
    maxGuests: room?.maxGuests ?? 2,
    totalRooms: room?.totalRooms ?? 0,
    breakfast: room?.breakfast ?? true,
    cancellation: room?.cancellation ?? true,
    featured: room?.featured ?? false,
    active: room?.active ?? true,
  });

  const [ratePlans, setRatePlans] = useState<RatePlan[]>(
    room?.ratePlans && room.ratePlans.length > 0
      ? room.ratePlans
      : DEFAULT_RATE_PLANS
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // The modal scrolls its own body; without this the page behind scrolls too
  // once the pointer leaves the panel, which reads as the whole layout
  // shifting under the overlay.
  useScrollLock(true);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.name),
      // Drop offerPrice when zero/blank so it doesn't undercut price.
      offerPrice: form.offerPrice > 0 ? form.offerPrice : undefined,
      // Drop plans left with no name — an in-progress row the admin didn't finish.
      ratePlans: ratePlans.filter((plan) => plan.name.trim()),
    };

    try {
      if (isEdit && room) {
        await api.rooms.update(room._id, payload);
      } else {
        await api.rooms.create(payload);
      }
      onSaved();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not save the room."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="roomFormTitle"
      >

        <div className="modalHead">
          <h3 id="roomFormTitle">{isEdit ? "Edit Room Type" : "Add Room Type"}</h3>
          <button type="button" onClick={onClose} className="closeBtn" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="modalBody">

            <div className="row">
              <div className="field">
                <label>Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Deluxe Room"
                />
              </div>
              <div className="field">
                <label>Slug (auto if blank)</label>
                <input
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="deluxe-room"
                />
              </div>
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>

            <div className="field">
              <label>Image path (in /public)</label>
              <input
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="/rooms/deluxe.jpg"
              />
            </div>

            <div className="row">
              <div className="field">
                <label>Base price / night (₹)</label>
                <input
                  type="number"
                  min={0}
                  required
                  value={form.price}
                  onChange={(e) => set("price", Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label>Base offer price / night (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.offerPrice}
                  onChange={(e) => set("offerPrice", Number(e.target.value))}
                />
              </div>
            </div>
            <p className="hint">
              Used as a fallback when no rate plans below are configured, and
              shown elsewhere the room is listed without a specific plan.
            </p>

            <div className="row quad">
              <div className="field">
                <label>Size</label>
                <input
                  value={form.size}
                  onChange={(e) => set("size", e.target.value)}
                  placeholder="320 sq.ft"
                />
              </div>
              <div className="field">
                <label>Bed</label>
                <input
                  value={form.bed}
                  onChange={(e) => set("bed", e.target.value)}
                  placeholder="King Bed"
                />
              </div>
              <div className="field">
                <label>Max guests</label>
                <input
                  type="number"
                  min={1}
                  value={form.maxGuests}
                  onChange={(e) => set("maxGuests", Number(e.target.value))}
                />
              </div>
              <div className="field">
                <label>Total rooms</label>
                <input
                  type="number"
                  min={0}
                  value={form.totalRooms}
                  onChange={(e) => set("totalRooms", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="field">
              <label>Rate plans</label>
              <RatePlanFields value={ratePlans} onChange={setRatePlans} />
            </div>

            <div className="checks">
              <label>
                <input
                  type="checkbox"
                  checked={form.breakfast}
                  onChange={(e) => set("breakfast", e.target.checked)}
                />
                Breakfast included
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.cancellation}
                  onChange={(e) => set("cancellation", e.target.checked)}
                />
                Free cancellation
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />
                Featured
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => set("active", e.target.checked)}
                />
                Active (visible on site)
              </label>
            </div>

            {error && <p className="error">{error}</p>}

          </div>

          <div className="modalActions">
            <button type="button" className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create room"}
            </button>
          </div>

        </form>

      </div>

      <style jsx>{`
        .overlay{
          position:fixed;
          inset:0;
          background:rgba(0,0,0,.45);
          display:flex;
          /* "safe" degrades to start-alignment once the modal is taller than the
             viewport, instead of overflowing equally off the top and bottom. */
          align-items:safe center;
          justify-content:center;
          padding:24px;
          z-index:1000;
        }

        .modal{
          background:#fff;
          border-radius:20px;
          width:100%;
          max-width:640px;
          /* 90vh plus the backdrop's 24px padding overflows the viewport; cap to
             the space actually inside the backdrop instead. */
          max-height:calc(100dvh - 48px);
          /* The panel is a flex column: head and actions stay put, only
             .modalBody scrolls. The overlay deliberately does NOT scroll —
             two nested scroll containers made the content jump. */
          display:flex;
          flex-direction:column;
          overflow:hidden;
          box-shadow:0 30px 70px rgba(0,0,0,.25);
        }

        form{
          display:flex;
          flex-direction:column;
          flex:1;
          min-height:0;
        }

        .modalBody{
          flex:1;
          min-height:0;
          overflow-y:auto;
          overscroll-behavior:contain;
          /* Reserve the scrollbar's width up front so the fields don't shift
             sideways the moment the form grows tall enough to scroll. */
          scrollbar-gutter:stable;
          padding:0 28px 4px;
        }

        .modalHead{
          display:flex;
          align-items:center;
          justify-content:space-between;
          flex-shrink:0;
          padding:28px 28px 22px;
        }

        .modalHead h3{
          margin:0;
          font-size:26px;
          font-family:var(--font-cormorant);
          color:#222;
        }

        .closeBtn{
          border:none;
          background:#f4efe6;
          width:38px;
          height:38px;
          border-radius:10px;
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          flex-shrink:0;
        }

        /* Grid, not flex: a flex item's default min-width:auto can't shrink
           below its input's intrinsic size:20 width (~180px), so the four-up
           row below demanded ~770px inside a 584px panel and forced the whole
           modal to scroll sideways. minmax(0,1fr) has no such floor. */
        .row{
          display:grid;
          grid-template-columns:repeat(2, minmax(0, 1fr));
          gap:0 16px;
        }

        .row.quad{
          grid-template-columns:repeat(4, minmax(0, 1fr));
        }

        .field{
          display:flex;
          flex-direction:column;
          gap:6px;
          min-width:0;
          margin-bottom:16px;
        }

        label{
          font-size:13px;
          font-weight:600;
          color:#666;
        }

        .hint{
          margin:-10px 0 16px;
          font-size:12px;
          color:#999;
        }

        input,
        textarea{
          border:1px solid #e2d9c8;
          border-radius:10px;
          padding:11px 14px;
          font-size:14px;
          font-family:inherit;
          outline:none;
          width:100%;
          max-width:100%;
        }

        /* Default resize:both lets the admin drag a textarea wider than the
           panel, which is the other way this form used to overflow. */
        textarea{
          resize:vertical;
        }

        input:focus,
        textarea:focus{
          border-color:#B68D40;
        }

        .checks{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin:8px 0 4px;
        }

        .checks label{
          display:flex;
          align-items:center;
          gap:10px;
          font-weight:500;
          color:#444;
          cursor:pointer;
        }

        .checks input{
          accent-color:#B68D40;
          width:auto;
        }

        .error{
          margin:12px 0 0;
          padding:10px 14px;
          border-radius:10px;
          background:#FDECEC;
          border:1px solid #F5C6C6;
          color:#B91C1C;
          font-size:14px;
        }

        .modalActions{
          display:flex;
          justify-content:flex-end;
          gap:12px;
          flex-shrink:0;
          padding:18px 28px 24px;
          border-top:1px solid #f0ebe1;
          background:#fff;
        }

        .cancel{
          padding:12px 22px;
          border-radius:12px;
          border:1px solid #ddd;
          background:#fff;
          cursor:pointer;
          font-weight:600;
        }

        .save{
          padding:12px 26px;
          border-radius:12px;
          border:none;
          background:#B68D40;
          color:#fff;
          cursor:pointer;
          font-weight:600;
        }

        .save:disabled{
          opacity:.7;
          cursor:not-allowed;
        }

        @media(max-width:640px){
          .overlay{
            padding:12px;
          }

          .modal{
            max-height:calc(100dvh - 24px);
          }

          .modalHead{
            padding:20px 20px 16px;
          }

          .modalBody{
            padding:0 20px 4px;
          }

          .modalActions{
            padding:16px 20px 20px;
          }

          .row{
            grid-template-columns:1fr;
            gap:0;
          }

          .row.quad{
            grid-template-columns:repeat(2, minmax(0, 1fr));
            gap:0 12px;
          }

          .checks{
            grid-template-columns:1fr;
          }
        }

        @media(max-width:420px){
          .row.quad{
            grid-template-columns:1fr;
          }
        }
      `}</style>

    </div>
  );
}
