"use client";

import {
  useBookingContext,
  validateGuestDetails,
  type GuestDetails,
} from "./context/BookingContext";

export default function GuestForm() {
  const { booking, setBooking, guestErrors, setGuestErrors } =
    useBookingContext();

  const updateGuest = (
    field: keyof GuestDetails,
    value: string
  ) => {
    setBooking((prev) => ({
      ...prev,
      guest: {
        ...prev.guest,
        [field]: value,
      },
    }));

    // Clear this field's error while the user is editing it.
    setGuestErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Validate a single field when the user leaves it.
  const handleBlur = (field: keyof GuestDetails) => {
    const errors = validateGuestDetails(booking.guest);
    setGuestErrors((prev) => {
      const next = { ...prev };
      if (errors[field]) next[field] = errors[field]!;
      else delete next[field];
      return next;
    });
  };

  const inputClass = (field: keyof GuestDetails) =>
    `w-full rounded-30px border p-2 outline-none transition-colors ${
      guestErrors[field]
        ? "border-red-500 focus:border-red-500"
        : "border-[#B68D40]"
    }`;

  const FieldError = ({ field }: { field: keyof GuestDetails }) =>
    guestErrors[field] ? (
      <p className="mt-1 text-sm text-red-600">{guestErrors[field]}</p>
    ) : null;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">

      <div className="p-8 space-y-8">

        {/* First + Last */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              First Name <span className="text-red-500">*</span>
            </label>

            <input
              value={booking.guest.firstName}
              onChange={(e) => updateGuest("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              className={inputClass("firstName")}
              placeholder="First Name"
            />
            <FieldError field="firstName" />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Last Name
            </label>

            <input
              value={booking.guest.lastName}
              onChange={(e) => updateGuest("lastName", e.target.value)}
              className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
              placeholder="Last Name"
            />
          </div>

        </div>

        {/* Email */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            Email Address <span className="text-red-500">*</span>
          </label>

          <input
            type="email"
            value={booking.guest.email}
            onChange={(e) => updateGuest("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={inputClass("email")}
            placeholder="example@email.com"
          />
          <FieldError field="email" />

        </div>

        {/* Phone */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            Mobile Number <span className="text-red-500">*</span>
          </label>

          <input
            inputMode="tel"
            value={booking.guest.phone}
            onChange={(e) => updateGuest("phone", e.target.value)}
            onBlur={() => handleBlur("phone")}
            className={inputClass("phone")}
            placeholder="+91 9876543210"
          />
          <FieldError field="phone" />

        </div>

        {/* GST */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            GST Number (Optional)
          </label>

          <input
            value={booking.guest.gstNumber}
            onChange={(e) =>
              updateGuest("gstNumber", e.target.value.toUpperCase())
            }
            onBlur={() => handleBlur("gstNumber")}
            className={inputClass("gstNumber")}
            placeholder="Enter GST Number"
          />
          <FieldError field="gstNumber" />

        </div>

        {/* Special Request */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            Special Request
          </label>

          <textarea
            rows={5}
            value={booking.guest.specialRequest}
            onChange={(e) =>
              updateGuest("specialRequest", e.target.value)
            }
            className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
            placeholder="Any special request..."
          />

        </div>

      </div>

    </div>
  );
}
