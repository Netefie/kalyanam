"use client";

import GuestForm from "./GuestForm";
import BookingSummary from "./BookingSummary";
import PolicyCard from "./PolicyCard";


export default function PersonalDetails() {
  return (
    // pb-28 clears the fixed Continue bar BookingSummary renders below `lg`,
    // so it never covers the form or the site footer.
    <section className="bg-[#faf8f4] py-6 pb-28 lg:pb-6">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="mb-6">
          <h1 className="font-cormorant text-4xl text-[#2d2d2d]">
            Guest Details
          </h1>

          <p className="mt-1 text-gray-500">
            Please enter the primary guest information to
            continue your reservation.
          </p>
        </div>

        {/* Layout */}

        <div className="grid lg:grid-cols-12 gap-10">

          {/* Left */}

          <div className="lg:col-span-8">

            <GuestForm />
            <PolicyCard />


          </div>

          {/* Right */}

          <div className="lg:col-span-4">

            <BookingSummary />

          </div>

        </div>

      </div>
    </section>
  );
}