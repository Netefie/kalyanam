"use client";

import Image from "next/image";

const awards = [
  "/award1.svg",
  "/award2.svg",
  "/award3.svg",
  "/award4.svg",
];

export default function AwardsSection() {
  return (
    <>
      <section className="awards-section">
        <div className="awards-container">

          <span className="section-title">
            RECOGNIZED FOR EXCELLENCE
          </span>

          <div className="awards-grid">
            {awards.map((icon, index) => (
              <div
                key={index}
                className="award-item"
              >
                <Image
                  src={icon}
                  alt={`Award ${index + 1}`}
                  width={170}
                  height={170}
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      <style>{`
      .awards-section{
  padding:50px 0;
  background:#faf7f2;
}

.awards-container{
  width:min(1400px,92%);
  margin:auto;
}

.section-title{
  display:block;
  text-align:center;

  margin-bottom:50px;

  color:#b78943;

  font-size:14px;
  font-weight:600;

  letter-spacing:4px;

  text-transform:uppercase;
}

.awards-grid{

  display:grid;

  grid-template-columns:repeat(4,1fr);

  align-items:center;

  gap:20px;

}

.award-item{

  position:relative;

  display:flex;

  justify-content:center;

  align-items:center;

  padding:10px 30px;

}

.award-item img{

  width:170px;

  height:auto;

  object-fit:contain;

  transition:.35s;

}

.award-item:hover img{

  transform:scale(1.05);

}

.award-item:not(:last-child)::after{

  content:"";

  position:absolute;

  right:-10px;

  top:50%;

  transform:translateY(-50%);

  width:1px;

  height:90px;

  background:#e2d4bf;

}

/* Tablet */

@media(max-width:992px){

.awards-grid{

grid-template-columns:repeat(2,1fr);

row-gap:50px;

}

.award-item:nth-child(2)::after{

display:none;

}

}

/* Mobile */

@media(max-width:576px){

.awards-section{

padding:60px 0;

}

.section-title{

font-size:13px;

margin-bottom:35px;

}

.awards-grid{

grid-template-columns:repeat(2,1fr);

gap:30px;

}

.award-item{

padding:0;

}

.award-item img{

width:120px;

}

.award-item::after{

display:none;

}

}
      `}</style>
    </>
  );
}