"use client";

import Image from "next/image";
import Link from "next/link";

const places = [
  {
    id: 1,
    image: "/khatu-shyam.jpg",
    title: "KHATU SHYAM JI TEMPLE",
    distance: "45 KM FROM KALYANAM",
    description:
      "One of India's most revered pilgrimage destinations, welcoming millions of devotees every year. Experience the spiritual charm, vibrant local markets, and timeless traditions surrounding the sacred temple.",
    href: "#",
  },
  {
    id: 2,
    image: "/harshnath-temple.jpg",
    title: "HARSHNATH SHIV TEMPLE",
    distance: "22 KM FROM KALYANAM",
    description:
      "A magnificent 10th-century Shiva temple perched on the Aravalli hills, offering breathtaking panoramic views, ancient architecture, and a peaceful spiritual atmosphere.",
    href: "#",
  },
  {
    id: 3,
    image: "/jeen-mata.jpg",
    title: "JEEN MATA TEMPLE",
    distance: "30 KM FROM KALYANAM",
    description:
      "A famous Shakti Peeth nestled amidst the hills, known for its divine aura, scenic surroundings, and centuries-old traditions attracting visitors throughout the year.",
    href: "#",
  },
  {
    id: 4,
    image: "/laxmangarh-fort.jpg",
    title: "LAXMANGARH FORT",
    distance: "32 KM FROM KALYANAM",
    description:
      "An impressive hilltop fort showcasing the rich heritage of Shekhawati. Enjoy spectacular views, historical architecture, and stories of Rajasthan's royal past.",
    href: "#",
  },
  {
    id: 5,
    image: "/nadine-le-prince-haveli.jpg",
    title: "NADINE LE PRINCE HAVELI",
    distance: "55 KM FROM KALYANAM",
    description:
      "Explore beautifully restored fresco-painted havelis reflecting the artistic brilliance of Shekhawati, often called the world's largest open-air art gallery.",
    href: "#",
  },
  {
    id: 6,
    image: "/shyam-kund.jpg",
    title: "SHREE SHYAM KUND",
    distance: "45 KM FROM KALYANAM",
    description:
      "Located beside the Khatu Shyam Temple, this sacred kund is believed to hold immense religious significance and offers a peaceful place for reflection.",
    href: "#",
  },
  {
    id: 7,
    image: "/salasar-balaji.jpg",
    title: "SALASAR BALAJI TEMPLE",
    distance: "58 KM FROM KALYANAM",
    description:
      "One of Rajasthan's most celebrated Hanuman temples, attracting pilgrims from across the country with its remarkable devotion and vibrant spiritual ambience.",
    href: "#",
  },
];

export default function NearbyPlaces() {
  return (
    <>
      <section className="nearby-section" id="experiences">
        <div className="nearby-container">
          <span className="nearby-tag">
            DISCOVER THE DESTINATION
          </span>

          <h2 className="nearby-heading">
            Explore Nearby Attractions
          </h2>

          <p className="nearby-description">
            Beyond the comfort of your stay lies the timeless heritage of
            Shekhawati. Discover iconic temples, majestic forts, sacred
            landmarks, and cultural treasures, each offering unforgettable
            experiences just a short drive from Kalyanam Hotel & Resort.
          </p>

          <div className="places-grid">
            {places.map((place) => (
              <article className="place-card" key={place.id}>
                <div className="place-image">
                  <Image
                    src={place.image}
                    alt={place.title}
                    fill
                    className="place-img"
                  />

                  <span className="distance-badge">
                    {place.distance}
                  </span>
                </div>

                <div className="place-content">
                  <div className="title-row">
                    <span className="title-line"></span>

                    <h3>{place.title}</h3>
                  </div>

                  <p>{place.description}</p>


                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
.nearby-section{
    background:#FCF8F2;
    padding:50px 40px;
}

.nearby-container{
    max-width:1220px;
    margin:0 auto;
}

.nearby-tag{
    display:block;
    text-align:center;
    margin-bottom:12px;

    font-family:var(--font-lato);
    font-size:11px;
    font-weight:700;
    letter-spacing:.32em;
    text-transform:uppercase;
    color:#A77748;
}

.nearby-heading{
    text-align:center;
    font-family:var(--font-playfair);
    font-size:46px;
    font-weight:400;
    line-height:1.1;
    color:#3F2E1F;
    margin-bottom:18px;
}

.nearby-description{
    max-width:700px;
    margin:0 auto 60px;
    text-align:center;
    font-family:var(--font-lato);
    font-size:15px;
    line-height:1.4;
    color:#6E655E;
}

.places-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:34px;
}
.place-card{
    transition:.4s;
}

.place-image{
    position:relative;
    overflow:hidden;
    aspect-ratio:4/3;
    background:#eee;
}

.place-img{
    object-fit:cover;
    transition:transform .7s ease;
}

.place-card:hover .place-img{
    transform:scale(1.06);
}

.distance-badge{
    position:absolute;
    top:16px;
    left:16px;

    padding:7px 12px;

    background:rgba(255,255,255,.95);

    border-radius:30px;

    font-family:var(--font-lato);
    font-size:10px;
    font-weight:700;
    letter-spacing:.12em;

    color:#8A603D;
}

.place-content{
    padding-top:12px;
}

.title-row{
    display:flex;
    align-items:center;
    gap:5px;
    margin-bottom:8px;
}

.title-line{
    width:34px;
    height:1px;
    background:#9A7146;
}

.place-content h3{
    font-family:var(--font-playfair);
    font-size:21px;
    font-weight:400;
    line-height:1.3;
    color:#503823;
    text-transform:uppercase;
}

.place-content p{
    margin-left:46px;
    font-family:var(--font-lato);
    font-size:14px;
    line-height:1.4;
    color:#6B625A;
}



/* ================= Desktop Small ================= */

@media(max-width:1200px){

    .nearby-container{
        max-width:1000px;
    }

    .places-grid{
        gap:28px;
    }

    .nearby-heading{
        font-size:40px;
    }

}

/* ================= Tablet ================= */

@media(max-width:992px){

    .places-grid{
        grid-template-columns:repeat(2,1fr);
    }

    .nearby-section{
        padding:80px 30px;
    }

}

/* ================= Mobile ================= */

@media(max-width:768px){

    .nearby-section{
        padding:65px 18px;
    }

    .nearby-heading{
        font-size:32px;
    }

    .nearby-description{
        font-size:14px;
        margin-bottom:40px;
    }

    .places-grid{
        grid-template-columns:1fr;
        gap:32px;
    }

    .place-content h3{
        font-size:20px;
    }

    .place-content p{
        margin-left:42px;
        font-size:14px;
    }

    .read-more{
        margin-left:42px;
    }

}
          `}</style>
    </>
  );
}