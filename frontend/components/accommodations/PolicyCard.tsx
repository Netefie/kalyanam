"use client";

import { ShieldCheck, Info } from "lucide-react";

import { useSettings } from "@/components/SettingsProvider";

export default function PolicyCard() {
  const { cancellationWindowHours, policies } = useSettings();

  return (
    <div className="mt-8 space-y-6">

      {/* Cancellation Policy */}

      <div className="rounded-2xl border border-gray-200 bg-white p-8">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F3E8]">
            <ShieldCheck
              size={22}
              className="text-[#B68D40]"
            />
          </div>

          <div className="flex-1">

            <h3 className="text-xl font-semibold text-[#222]">
              Cancellation Policy
            </h3>

            {/* The window is the same number bookingController.js enforces on
                a self-cancellation, so this can't drift from what the guest
                will actually be allowed to do. */}
            <p className="mt-3 whitespace-pre-line text-gray-600 leading-7">
              {policies.cancellation ||
                `Free cancellation is available up to ${cancellationWindowHours} hours before your scheduled check-in. Cancellations made within ${cancellationWindowHours} hours of arrival may incur one night's retention charge.`}
            </p>

          </div>

        </div>

      </div>

      {/* Guarantee Policy */}

      <div className="rounded-2xl border border-gray-200 bg-white p-8">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8F3E8]">
            <Info
              size={22}
              className="text-[#B68D40]"
            />
          </div>

          <div className="flex-1">

            <h3 className="text-xl font-semibold text-[#222]">
              Guarantee Policy
            </h3>

            <p className="mt-3 text-gray-600 leading-7">
              Reservations are confirmed only after successful
              payment. Guests are requested to present a valid
              government-issued photo identification during
              check-in.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}