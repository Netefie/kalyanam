"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  BedDouble,
  Users,
  Move,
  Pencil,
  Trash2,
  Plus,
  Star,
} from "lucide-react";
import RoomFormModal from "../components/RoomFormModal";
import { api, type Room } from "@/lib/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRooms(await api.rooms.listAll());
    } catch {
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setModalOpen(true);
  };

  const handleDelete = async (room: Room) => {
    if (!window.confirm(`Delete "${room.name}"?`)) return;
    try {
      await api.rooms.remove(room._id);
      await load();
    } catch {
      alert("Could not delete the room.");
    }
  };

  const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <>
      <div className="roomsPage">

        <div className="header">
          <div>
            <h2>Room Types</h2>
            <p>Manage room categories available on your website.</p>
          </div>
          <button onClick={openCreate} className="addBtn">
            <Plus size={18} />
            Add Room Type
          </button>
        </div>

        {error && <div className="errorBox">{error}</div>}

        {loading ? (
          <p className="muted">Loading rooms…</p>
        ) : rooms.length === 0 ? (
          <p className="muted">No room types yet. Add your first one.</p>
        ) : (
          <div className="grid">
            {rooms.map((room) => (
              <div key={room._id} className={`card ${room.active ? "" : "inactive"}`}>

                <div className="image">
                  {room.image ? (
                    <Image src={room.image} alt={room.name} fill />
                  ) : (
                    <div className="noImage">No image</div>
                  )}

                  {room.featured && (
                    <div className="featured">
                      <Star size={14} fill="currentColor" />
                      Featured
                    </div>
                  )}

                  {!room.active && <div className="badgeInactive">Hidden</div>}
                </div>

                <div className="content">

                  <div className="top">
                    <h3>{room.name}</h3>
                    <span className="price">
                      {money(room.offerPrice ?? room.price)}
                    </span>
                  </div>

                  <div className="info">
                    <div><Users size={16} /> {room.maxGuests} Guests</div>
                    <div><Move size={16} /> {room.size || "—"}</div>
                    <div><BedDouble size={16} /> {room.totalRooms} Rooms</div>
                  </div>

                  <div className="availability">
                    <div>
                      <strong>{room.availableRooms}</strong>
                      Available
                    </div>
                    <div>
                      <strong>
                        {Math.max(0, room.totalRooms - room.availableRooms)}
                      </strong>
                      Occupied
                    </div>
                  </div>

                  <div className="actions">
                    <button title="Edit" onClick={() => openEdit(room)}>
                      <Pencil size={17} />
                    </button>
                    <button
                      title="Delete"
                      className="danger"
                      onClick={() => handleDelete(room)}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {modalOpen && (
        <RoomFormModal
          room={editing}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}

      <style jsx>{`
        .roomsPage{
          padding:4px;
        }

        .header{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:26px;
        }

        .header h2{
          margin:0;
          font-size:34px;
          font-family:var(--font-cormorant);
          color:#222;
        }

        .header p{
          margin-top:6px;
          color:#777;
        }

        .addBtn{
          display:flex;
          align-items:center;
          gap:10px;
          border:none;
          border-radius:12px;
          padding:14px 24px;
          background:#B68D40;
          color:#fff;
          font-weight:600;
          cursor:pointer;
          transition:.3s;
        }

        .addBtn:hover{
          background:#a57d35;
        }

        .muted{
          color:#999;
          padding:40px 0;
        }

        .errorBox{
          background:#FDECEC;
          border:1px solid #F5C6C6;
          color:#B91C1C;
          padding:16px 20px;
          border-radius:14px;
          margin-bottom:20px;
        }

        .grid{
          display:grid;
          grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
          gap:24px;
        }

        .card{
          background:#fff;
          border-radius:20px;
          overflow:hidden;
          box-shadow:0 12px 35px rgba(0,0,0,.06);
          transition:.3s;
        }

        .card.inactive{
          opacity:.75;
        }

        .image{
          position:relative;
          height:200px;
          background:#f1ece2;
        }

        .image :global(img){
          object-fit:cover;
        }

        .noImage{
          display:flex;
          align-items:center;
          justify-content:center;
          height:100%;
          color:#b6a88c;
          font-size:14px;
        }

        .featured{
          position:absolute;
          top:14px;
          left:14px;
          display:flex;
          align-items:center;
          gap:6px;
          background:#B68D40;
          color:#fff;
          padding:6px 12px;
          border-radius:999px;
          font-size:12px;
          font-weight:600;
        }

        .badgeInactive{
          position:absolute;
          top:14px;
          right:14px;
          background:#2b2b2b;
          color:#fff;
          padding:6px 12px;
          border-radius:999px;
          font-size:12px;
          font-weight:600;
        }

        .content{
          padding:22px;
        }

        .top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          margin-bottom:16px;
        }

        .top h3{
          margin:0;
          font-size:20px;
          color:#222;
        }

        .price{
          color:#B68D40;
          font-weight:700;
          font-size:18px;
        }

        .info{
          display:flex;
          flex-wrap:wrap;
          gap:14px;
          color:#666;
          font-size:14px;
          margin-bottom:18px;
        }

        .info div{
          display:flex;
          align-items:center;
          gap:7px;
        }

        .info :global(svg){
          color:#B68D40;
        }

        .availability{
          display:flex;
          gap:14px;
          margin-bottom:20px;
        }

        .availability div{
          flex:1;
          background:#faf7f2;
          border-radius:12px;
          padding:12px;
          text-align:center;
          font-size:13px;
          color:#777;
          display:flex;
          flex-direction:column;
          gap:2px;
        }

        .availability strong{
          font-size:20px;
          color:#222;
        }

        .actions{
          display:flex;
          gap:10px;
        }

        .actions button{
          flex:1;
          height:42px;
          border:none;
          border-radius:10px;
          background:#F8F5EF;
          cursor:pointer;
          transition:.3s;
          display:flex;
          align-items:center;
          justify-content:center;
          color:#555;
        }

        .actions button:hover{
          background:#B68D40;
          color:#fff;
        }

        .actions .danger:hover{
          background:#B91C1C;
        }

        @media(max-width:768px){
          .header{
            flex-direction:column;
            align-items:flex-start;
            gap:16px;
          }
        }
      `}</style>

    </>
  );
}
