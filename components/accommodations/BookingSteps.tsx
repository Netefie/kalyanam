"use client";

import Image from "next/image";

interface BookingStepsProps {
  currentStep: number;
}

const steps = [
  {
    id: 1,
    title: "Select Room",
    icon: "/select.svg",
  },
  {
    id: 2,
    title: "Personal Details",
    icon: "/detail.svg",
  },
  {
    id: 3,
    title: "Payment Confirmation",
    icon: "/payment.svg",
  },
];

export default function BookingSteps({
  currentStep,
}: BookingStepsProps) {
  return (
    <>
      <section className="bookingSteps">
        <div className="container">

          <div className="heading">

            <div className="line" />

            <h2>PLAN YOUR STAY</h2>

            <div className="line" />

          </div>

          <div className="steps">

            {steps.map((step, index) => {
              const active = currentStep === step.id;
              const completed = currentStep > step.id;

              return (
                <div
                  key={step.id}
                  className="stepWrapper"
                >
                  <div className="step">

                    <div
                      className={`iconCircle ${
                        active
                          ? "active"
                          : completed
                          ? "completed"
                          : ""
                      }`}
                    >
                      <Image
                        src={step.icon}
                        alt={step.title}
                        width={30}
                        height={30}
                        className={`stepIcon ${
                          active || completed
                            ? "iconActive"
                            : ""
                        }`}
                      />
                    </div>

                    <h3
                      className={
                        active || completed
                          ? "title activeTitle"
                          : "title"
                      }
                    >
                      {step.title}
                    </h3>
                  </div>

                  {index !== steps.length - 1 && (
                    <div
                      className={`connector ${
                        completed
                          ? "connectorActive"
                          : ""
                      }`}
                    />
                  )}
                </div>
              );
            })}

          </div>

        </div>
      </section>

      <style jsx>{`
        .bookingSteps {
          width: 100%;
          background: #fbfaf7;
          border-bottom: 1px solid #ece8df;
          padding: 30px 0;
        }

        .container {
          max-width: 1280px;
          margin: auto;
          padding: 0 14px;
        }

        .heading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
          margin-bottom: 20px;
        }

        .line {
          width: 72px;
          height: 1px;
          background: #b18d53;
        }

        h2 {
          font-family: "Cormorant Garamond";
          font-size: 38px;
          font-weight: 300;
          color: #2d2d2d;
          margin: 0;
        }

        .steps {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;   /* Adjust this value */
}

        .stepWrapper {
          display: flex;
          align-items: center;
        }

        .step {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .iconCircle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid #d8d8d8;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: 0.3s;
          background: white;
        }

        .iconCircle.active {
          border-color: #b18d53;
          box-shadow: 0 10px 30px rgba(177, 141, 83, 0.15);
        }

        .iconCircle.completed {
          border-color: #b18d53;
          background: #b18d53;
        }

        .stepIcon {
          opacity: 0.45;
          transition: 0.3s;
        }

        .iconActive {
          opacity: 1;
        }

        .completed .stepIcon {
          filter: brightness(0) invert(1);
        }

        .title {
          margin-top: 10px;
          font-family: "Lato";
          font-size: 16px;
          font-weight: 700;
          color: #a9a9a9;
          transition: 0.3s;
        }

        .activeTitle {
          color: #222;
        }

        .connector {
    width: 90px;
    height: 1px;
    margin: 0 20px;
    background: #d8d8d8;
    transition: .3s;
}

        .connectorActive {
          background: #b18d53;
        }

        @media (max-width: 992px) {
          h2 {
            font-size: 42px;
          }

          .iconCircle {
            width: 70px;
            height: 70px;
          }

          .title {
            font-size: 16px;
          }
        }

        @media (max-width:768px){

  .bookingSteps{
    padding:30px 0;
  }

  .heading{
    gap:4px;
    margin-bottom:30px;
  }

  .line{
    width:35px;
  }

  h2{
    font-size:18px;
    line-height:1.2;
  }

  .steps{
    justify-content:space-between;
    gap:0;
  }

  .step{
    min-width:auto;
    width:90px;
  }

  .iconCircle{
    width:42px;
    height:42px;
  }

  .stepIcon{
    width:22px !important;
    height:22px !important;
  }

  .connector{
    width:25px;
    margin:0 6px;
  }

  .title{
    font-size:13px;
    line-height:18px;
  }

}

/* ========================= */
/* Mobile */
/* ========================= */

@media (max-width:576px){

  .bookingSteps{
    padding:24px 0;
  }

  .container{
    padding:0 12px;
  }

  .heading{
    gap:10px;
    margin-bottom:24px;
  }

  .line{
    width:24px;
  }

  h2{
    font-size:14px;
  }

  .steps{
    align-items:flex-start;
  }

  .step{
    width:82px;
  }

  .iconCircle{
    width:38px;
    height:38px;
  }

  .stepIcon{
    width:20px !important;
    height:20px !important;
  }

  .connector{
    width:18px;
    margin:0 4px;
  }

  .title{
    margin-top:8px;
    font-size:12px;
    line-height:16px;
  }

}

/* ========================= */
/* Small Mobile */
/* ========================= */

@media (max-width:390px){

  h2{
    font-size:20px;
  }

  .line{
    width:18px;
  }

  .step{
    width:70px;
  }

  .iconCircle{
    width:34px;
    height:34px;
  }

  .stepIcon{
    width:14px !important;
    height:14px !important;
  }

  .connector{
    width:12px;
  }

  .title{
    font-size:10px;
  }

}
      `}</style>
    </>
  );
}