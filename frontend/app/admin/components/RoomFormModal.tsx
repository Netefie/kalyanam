"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { api, ApiError, type Room } from "@/lib/api";

interface RoomFormModalProps {
  room: Room | null; // null → create, otherwise edit
  onClose: () => void;
  onSaved: () => void;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
    availableRooms: room?.availableRooms ?? 0,
    breakfast: room?.breakfast ?? true,
    cancellation: room?.cancellation ?? true,
    featured: room?.featured ?? false,
    active: room?.active ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <div className="modalHead">
          <h3>{isEdit ? "Edit Room Type" : "Add Room Type"}</h3>
          <button type="button" onClick={onClose} className="closeBtn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>

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
              placeholder="/rooms/deluxe.png"
            />
          </div>

          <div className="row">
            <div className="field">
              <label>Price / night (₹)</label>
              <input
                type="number"
                min={0}
                required
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Offer price / night (₹)</label>
              <input
                type="number"
                min={0}
                value={form.offerPrice}
                onChange={(e) => set("offerPrice", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="row">
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
          </div>

          <div className="row">
            <div className="field">
              <label>Total rooms</label>
              <input
                type="number"
                min={0}
                value={form.totalRooms}
                onChange={(e) => set("totalRooms", Number(e.target.value))}
              />
            </div>
            <div className="field">
              <label>Available rooms</label>
              <input
                type="number"
                min={0}
                value={form.availableRooms}
                onChange={(e) => set("availableRooms", Number(e.target.value))}
              />
            </div>
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
          align-items:center;
          justify-content:center;
          padding:24px;
          z-index:1000;
        }

        .modal{
          background:#fff;
          border-radius:20px;
          width:100%;
          max-width:640px;
          max-height:90vh;
          overflow-y:auto;
          padding:28px;
          box-shadow:0 30px 70px rgba(0,0,0,.25);
        }

        .modalHead{
          display:flex;
          align-items:center;
          justify-content:space-between;
          margin-bottom:22px;
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
        }

        .row{
          display:flex;
          gap:16px;
        }

        .row .field{
          flex:1;
        }

        .field{
          display:flex;
          flex-direction:column;
          gap:6px;
          margin-bottom:16px;
        }

        label{
          font-size:13px;
          font-weight:600;
          color:#666;
        }

        input,
        textarea{
          border:1px solid #e2d9c8;
          border-radius:10px;
          padding:11px 14px;
          font-size:14px;
          font-family:inherit;
          outline:none;
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
          margin-top:22px;
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
          .row{
            flex-direction:column;
            gap:0;
          }

          .checks{
            grid-template-columns:1fr;
          }
        }
      `}</style>

    </div>
  );
}
