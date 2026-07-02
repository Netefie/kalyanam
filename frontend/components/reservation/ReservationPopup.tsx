"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { buildAccommodationsUrl } from "@/lib/reservation";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ReservationPopup({
  open,
  onClose,
}: Props) {
  const popupRef = useRef<HTMLDivElement>(null);

  const [roomType, setRoomType] =
    useState("deluxe-room");

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [rooms, setRooms] = useState(1);

const [adults, setAdults] = useState(2);

const [children, setChildren] = useState(0);

const [error, setError] = useState("");

const router = useRouter();

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        popupRef.current &&
        !popupRef.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open, onClose]);

  if (!open) return null;

function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();
  setError("");

  if (!checkIn || !checkOut) {
    setError("Please select your check-in and check-out dates.");
    return;
  }

  // Carry the selection to the accommodations page, which prefills
  // "PLAN YOUR STAY" and runs the search automatically.
  onClose();
  router.push(
    buildAccommodationsUrl({
      roomType,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
    })
  );
}

  return (
    <>
      <div
        ref={popupRef}
        className="reservation-popup"
      >
        <form>

          <div className="field">

            <label>
              Select Room Type
            </label>

            <select
              value={roomType}
              onChange={(e) =>
                setRoomType(
                  e.target.value
                )
              }
            >
              <option value="deluxe-room">
                Deluxe
              </option>

              <option value="super-deluxe-room">
                Super Deluxe
              </option>

            </select>

          </div>

<div className="date-row">

  <div className="field">

    <label>
      Check In
    </label>

    <input
      type="date"
      value={checkIn}
      onChange={(e) =>
        setCheckIn(e.target.value)
      }
    />

  </div>

  <div className="field">

    <label>
      Check Out
    </label>

    <input
      type="date"
      value={checkOut}
      onChange={(e) =>
        setCheckOut(e.target.value)
      }
    />

  </div>

</div>

          {/* Guests */}
<div className="guest-section">

  <label className="guest-label">
    ROOMS & GUESTS
  </label>

  <p className="guest-summary">
    {rooms} Room, {adults} Adult, {children} Children
  </p>

  <div className="guest-box">

    <div className="guest-item">

      <span>Rooms</span>
<div className="counter">

  <button
    type="button"
    onClick={() => setRooms(Math.max(1, rooms - 1))}
  >
    −
  </button>

  <div className="count-value">
    {rooms}
  </div>

  <button
    type="button"
    onClick={() => setRooms(rooms + 1)}
  >
    +
  </button>

</div>
    </div>

    <div className="guest-item">

      <span>Adults</span>

<div className="counter">

  <button
    type="button"
    onClick={() => setAdults(Math.max(1, adults - 1))}
  >
    −
  </button>

  <div className="count-value">
    {adults}
  </div>

  <button
    type="button"
    onClick={() => setAdults(adults + 1)}
  >
    +
  </button>

</div>

    </div>

    <div className="guest-item">

      <span>Children</span>

<div className="counter">

  <button
    type="button"
    onClick={() => setChildren(Math.max(0, children - 1))}
  >
    −
  </button>

  <div className="count-value">
    {children}
  </div>

  <button
    type="button"
    onClick={() => setChildren(children + 1)}
  >
    +
  </button>

</div>

    </div>

  </div>

</div>
{error && (
  <p className="popup-feedback error">{error}</p>
)}

<button
  type="button"
  className="check-btn"
  onClick={handleSubmit}
>
  CHECK AVAILABILITY
</button>

        </form>
      </div>

      <style jsx>{`
     .reservation-popup {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;

  width: 470px;

  background: #fff;

  border-radius: 4px;

  padding: 24px;

  box-shadow: 0 15px 45px rgba(0,0,0,.15);

  z-index: 9999;

  animation: popupAnimation .35s ease;
}

.reservation-popup form{
  display:flex;
  flex-direction:column;
}

/* ---------- Labels ---------- */

.field{
  display:flex;
  flex-direction:column;
  margin-bottom:12px;
}

.field label{

  margin-bottom:2px;

  font-family:var(--font-lato);

  font-size:10px;

  font-weight:600;

  color:#888;

  text-transform:uppercase;

  letter-spacing:.08em;

}

/* ---------- Room Type ---------- */

.field select{

  width:100%;

  height:36px;

  padding:0 14px;

  border:1px solid #D8D8D8;

  outline:none;

  background:#fff;

  font-family:var(--font-lato);

  font-size:14px;

  appearance:none;
  -webkit-appearance:none;
  -moz-appearance:none;

  cursor:pointer;

  transition:.3s;

  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='%23777777' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 5h10L8 11z'/%3E%3C/svg%3E");

  background-repeat:no-repeat;

  background-position:right 14px center;

}

/* ---------- Date Row ---------- */

.date-row{

  display:flex;

  gap:16px;

  margin-bottom:2px;

}

.date-row .field{

  flex:1;

  margin-bottom:0;

}

.date-row input{

  width:100%;

  height:36px;

  padding:0 14px;

  border:1px solid #D8D8D8;

  outline:none;

  background:#fff;

  font-family:var(--font-lato);

  font-size:14px;

  transition:.3s;

}

/* ---------- Focus ---------- */

.field select:focus,
.date-row input:focus{

  border-color:#A57347;

}

/* ---------- Button ---------- */

.check-btn{

  width:100%;

  height:38px;

  margin-top:12px;

  border:none;

  background:#A57347;

  color:#fff;

  cursor:pointer;

  font-family:var(--font-playfair);

  font-size:14px;

  font-weight:600;

  letter-spacing:.05em;

  transition:.35s;

}

.check-btn:hover{

  background:#8D603A;

}

.check-btn:disabled{
  opacity:.75;
  cursor:not-allowed;
}

.popup-feedback{
  margin:12px 0 0;
  padding:10px 12px;
  border-radius:4px;
  font-family:var(--font-lato);
  font-size:13px;
}

.popup-feedback.error{
  background:#FDECEC;
  border:1px solid #F5C6C6;
  color:#B91C1C;
}

.popup-feedback.success{
  background:#E9F7EF;
  border:1px solid #BFE6CF;
  color:#1B7A44;
}

/* ---------- Animation ---------- */

@keyframes popupAnimation {

  from{
    opacity:0;
    transform:translateY(-20px);
  }

  to{
    opacity:1;
    transform:translateY(0);
  }

}

.guest-section{
  margin-top:8px;
}

.guest-label{
  display:block;

  margin-bottom:2px;

  font-family:var(--font-lato);

  font-size:12px;

  font-weight:600;

  color:#888;

  text-transform:uppercase;

  letter-spacing:.08em;
}

.guest-summary{

  margin:0 0 10px;

  font-family:var(--font-lato);

  font-size:12px;

  color:#555;

}

.guest-box{

  border:1px solid #D8D8D8;

  background:#fff;

}

.guest-item{

  display:flex;

  align-items:center;

  justify-content:space-between;

  padding:8px 18px;

  border-bottom:1px solid #ECECEC;

}

.guest-item:last-child{

  border-bottom:none;

}

.guest-item > span{
  font-family:var(--font-lato);

  font-size:15px;

  color:#222;

}

.counter{

  display:flex;

  align-items:center;

  gap:14px;

}

.counter button{

  width:32px;

  height:32px;

  border-radius:50%;

  border:none;

  background:#D6B15D;

  color:white;

  font-size:20px;

  cursor:pointer;

  transition:.3s;
}

.counter button:hover{

  background:#B88A39;

}

.counter span{

  width:18px;

  text-align:center;

  font-size:17px;

  font-weight:600;

}

/* ---------- Tablet ---------- */

@media(max-width:992px){

.reservation-popup{

  width:420px;

}

}

/* ---------- Mobile ---------- */

@media(max-width:768px){

.reservation-popup{

  width:340px;

  right:-20px;

  padding:20px;

}

.date-row{

  flex-direction:column;

  gap:18px;

}

.check-btn{

  height:46px;

}

}
            `}</style>
    </>
  );
}