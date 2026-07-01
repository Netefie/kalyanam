"use client";

import { useBookingContext } from "./context/BookingContext";

export default function GuestForm() {
  const { booking, setBooking } = useBookingContext();

  const updateGuest = (
    field: keyof typeof booking.guest,
    value: string
  ) => {
    setBooking((prev) => ({
      ...prev,
      guest: {
        ...prev.guest,
        [field]: value,
      },
    }));
  };

  return (
    <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">

      {/* Header */}

      

      <div className="p-8 space-y-8">

        {/* First + Last */}

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="block mb-2 text-sm font-medium">
              First Name
            </label>

            <input
              value={booking.guest.firstName}
              onChange={(e) =>
                updateGuest(
                  "firstName",
                  e.target.value
                )
              }
              className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
              placeholder="First Name"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Last Name
            </label>

            <input
              value={booking.guest.lastName}
              onChange={(e) =>
                updateGuest(
                  "lastName",
                  e.target.value
                )
              }
              className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
              placeholder="Last Name"
            />
          </div>

        </div>

        {/* Email */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            Email Address
          </label>

          <input
            type="email"
            value={booking.guest.email}
            onChange={(e) =>
              updateGuest("email", e.target.value)
            }
            className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
            placeholder="example@email.com"
          />

        </div>

        {/* Phone */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            Mobile Number
          </label>

          <input
            value={booking.guest.phone}
            onChange={(e) =>
              updateGuest("phone", e.target.value)
            }
            className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
            placeholder="+91 9876543210"
          />

        </div>

        {/* GST */}

        <div>

          <label className="block mb-2 text-sm font-medium">
            GST Number (Optional)
          </label>

          <input
            value={booking.guest.gstNumber}
            onChange={(e) =>
              updateGuest(
                "gstNumber",
                e.target.value
              )
            }
            className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
            placeholder="Enter GST Number"
          />

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
              updateGuest(
                "specialRequest",
                e.target.value
              )
            }
            className="w-full rounded-30px border p-2 outline-none border-[#B68D40]"
            placeholder="Any special request..."
          />

        </div>

      </div>

    </div>
  );
}