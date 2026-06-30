export default function RefundPolicyPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#b3a394] border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="mt-10 text-sm uppercase tracking-[0.35em] text-[#B78D4A] font-semibold">
            Legal
          </p>

          <h1 className="mt-4 text-5xl md:text-6xl font-serif text-[#1E1E1E]">
            Refund Policy
          </h1>

          <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-600 leading-8">
            At Kalyanam Hotel & Resort, we strive to provide a transparent and
            hassle-free booking experience. This Refund Policy outlines the
            circumstances under which refunds may be processed for reservations
            made through our website or directly with our reservation team.
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
              1. General Policy
            </h2>

            <p>
              Refund eligibility depends on the booking type, cancellation
              timing, promotional offers, and the applicable reservation terms
              at the time of booking. Certain promotional or discounted
              bookings may be non-refundable.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              2. Eligible Refunds
            </h2>

            <p className="mb-4">
              Refunds may be considered in the following situations:
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>Eligible cancellations made within the permitted cancellation period.</li>
              <li>Duplicate or accidental payments.</li>
              <li>Failed bookings where payment was deducted but the reservation was not confirmed.</li>
              <li>Cancellation initiated by Kalyanam Hotel & Resort due to operational reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              3. Non-Refundable Situations
            </h2>

            <p className="mb-4">
              Refunds will generally not be provided in the following cases:
            </p>

            <ul className="list-disc pl-6 space-y-3">
              <li>No-show at the hotel without prior cancellation.</li>
              <li>Early departure after check-in.</li>
              <li>Bookings marked as Non-Refundable during reservation.</li>
              <li>Unused hotel services after check-in.</li>
              <li>Promotional, festive, event, or discounted packages specifically marked as non-refundable.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              4. Refund Process
            </h2>

            <p>
              Once a refund request is approved, the refund will be initiated
              using the original payment method wherever possible. Depending on
              your bank or payment provider, the amount may take approximately
              <strong> 7–14 business days </strong>
              to reflect in your account.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              5. Payment Gateway Delays
            </h2>

            <p>
              Refund processing times may vary depending on banks, credit card
              companies, UPI providers, or payment gateways. Kalyanam Hotel &
              Resort is not responsible for delays caused by third-party payment
              processors after the refund has been initiated.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              6. Partial Refunds
            </h2>

            <p>
              In certain circumstances, only a partial refund may be applicable,
              such as when cancellation charges, administrative fees, or
              partially utilized services apply. The refund amount will be
              communicated to the guest before processing.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              7. Force Majeure
            </h2>

            <p>
              Refund requests arising due to circumstances beyond reasonable
              control—including natural disasters, government restrictions,
              pandemics, civil disturbances, or other force majeure events—will
              be reviewed on a case-by-case basis in accordance with applicable
              laws and operational feasibility.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              8. Incorrect Booking Information
            </h2>

            <p>
              Guests are responsible for verifying all booking details before
              confirming a reservation. Refunds may not be granted for booking
              errors resulting from incorrect information provided by the guest.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              9. Changes to This Policy
            </h2>

            <p>
              Kalyanam Hotel & Resort reserves the right to amend or update this
              Refund Policy at any time. The latest version will always be
              available on this page.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold text-[#1E1E1E] mb-5">
              10. Contact Us
            </h2>

            <div className="rounded-2xl bg-[#F8F5F0] p-8 border border-[#E6DCCB]">
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