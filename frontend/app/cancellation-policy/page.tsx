export default function CancellationPolicyPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#b3a394] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="mt-10 text-sm uppercase tracking-[0.35em] text-[#B78D4A] font-semibold">
            Legal
          </p>

          <h1 className="mt-4 text-5xl md:text-6xl font-serif text-[#1E1E1E]">
            Cancellation Policy
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
            This Cancellation Policy explains the terms under which guests may
            cancel or modify their reservations at Kalyanam Hotel & Resort. We
            recommend reviewing this policy carefully before confirming your
            booking.
          </p>

          <p className="mt-6 text-sm text-gray-500">
            Effective Date: June 30, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="space-y-14 text-gray-700 leading-8">

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              1. General Cancellation Policy
            </h2>

            <p>
              Guests may request cancellation of their reservation in accordance
              with the terms applicable to their booking. Cancellation
              eligibility depends on the room type, booking package,
              promotional offers, and the cancellation conditions accepted at
              the time of reservation.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              2. Cancellation Request
            </h2>

            <p className="mb-4">
              Cancellation requests can be made through:
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>Our official website (if applicable).</li>
              <li>Our reservation team via phone or email.</li>
              <li>The booking platform through which the reservation was made.</li>
            </ul>

            <p className="mt-4">
              A cancellation request is considered valid only after receiving a
              confirmation from Kalyanam Hotel & Resort.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              3. Cancellation Charges
            </h2>

            <p className="mb-4">
              Cancellation charges, if any, depend on the booking conditions
              applicable at the time of reservation.
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>Some bookings may qualify for free cancellation within the permitted period.</li>
              <li>Late cancellations may attract cancellation charges.</li>
              <li>Non-refundable bookings cannot be cancelled for a refund.</li>
              <li>Special promotional, festive, wedding, or event packages may have separate cancellation terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              4. No-Show Policy
            </h2>

            <p>
              If a guest fails to arrive on the scheduled check-in date without
              prior cancellation, the reservation will be treated as a
              <strong> No-Show</strong>. In such cases, cancellation charges or
              the full booking amount may apply as per the reservation terms.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              5. Modification of Reservations
            </h2>

            <p>
              Requests to modify reservation dates, guest details, room
              categories, or stay duration are subject to availability and may
              result in revised room tariffs or additional charges.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              6. Group Bookings & Event Reservations
            </h2>

            <p>
              Group bookings, banquet reservations, wedding events, conferences,
              and special occasions may have separate cancellation terms
              outlined in the booking agreement. Guests are advised to review
              those conditions before confirming such reservations.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              7. Force Majeure
            </h2>

            <p>
              Cancellation requests resulting from circumstances beyond the
              reasonable control of either party—including natural disasters,
              government restrictions, public emergencies, pandemics, civil
              unrest, or other force majeure events—will be evaluated on a
              case-by-case basis in accordance with applicable laws and hotel
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              8. Refund After Cancellation
            </h2>

            <p>
              Where a cancellation qualifies for a refund, the refund will be
              processed in accordance with our Refund Policy. Refunds, if
              applicable, will generally be credited to the original payment
              method within the standard processing period.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              9. Changes to This Policy
            </h2>

            <p>
              Kalyanam Hotel & Resort reserves the right to modify or update
              this Cancellation Policy at any time without prior notice. The
              latest version will always be available on this page.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              10. Contact Us
            </h2>

            <div className="rounded-2xl bg-[#F8F5F0] border border-[#E6DCCB] p-8">
              <h3 className="text-2xl font-semibold text-[#1E1E1E] mb-4">
                Kalyanam Hotel & Resort
              </h3>

              <div className="space-y-2 text-gray-700">
                <p>Email: info@kalyanamhotel.com</p>
                <p>Phone: +91 XXXXX XXXXX</p>
                <p>Website: www.kalyanamhotel.com</p>
              </div>
            </div>
          </section>

        </div>
      </section>
    </main>
  );
}