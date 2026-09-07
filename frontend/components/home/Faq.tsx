"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import { categories, faqData } from "@/lib/faq";

export default function Faq() {
  const [activeTab, setActiveTab] = useState("Stay");
  const [openIndex, setOpenIndex] = useState(0);

  const faqs =
    faqData[activeTab];
      return (
    <>
      <section
  id="faq"
  className="faq-section"
>

        <div className="faq-container">

          {/* Heading */}

          <div className="faq-header">

            <h2>
              FAQs
            </h2>

            <p>
              Find answers to your frequently asked questions
            </p>

          </div>

          {/* Category Tabs */}

          <div className="faq-tabs">

            {categories.map((category) => (

              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveTab(category);
                  setOpenIndex(0);
                }}
                className={`faq-tab ${
                  activeTab === category
                    ? "active"
                    : ""
                }`}
              >
                {category}
              </button>

            ))}

          </div>

          {/* Accordion */}

          <div className="faq-list">

            {faqs.map((item, index) => {

              const isOpen = index === openIndex;

              return (

                <div
                  key={index}
                  className={`faq-item ${
                    isOpen ? "open" : ""
                  }`}
                >

                  <button
                    className="faq-question"
                    onClick={() =>
                      setOpenIndex(
                        isOpen ? -1 : index
                      )
                    }
                  >

                    <span>
                      {item.question}
                    </span>

                    <ChevronDown
                      className={`faq-icon ${
                        isOpen
                          ? "rotate"
                          : ""
                      }`}
                    />

                  </button>

                  <div
                    className={`faq-answer ${
                      isOpen
                        ? "show"
                        : ""
                    }`}
                  >

                    <div className="faq-answer-inner">

                      <p>
                        {item.answer}
                      </p>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        </div>

      </section>

      <style jsx>{`

.faq-section {
  width: 90%;
  background: #FCF7F1;
  padding: 50px 0;
  margin: 0 auto; /* Centers the section horizontally */
  display: flex;
  justify-content: center; /* Centers child elements horizontally */
}

      .faq-container{

        width:min(1400px,92%);
        margin:auto;

      }

      .faq-header{
        margin-bottom:10px;

      }

      .faq-header h2{

        font-size:48px;
        font-weight:300;
        font-family:"Cormorant Garamond",serif;
        color:#17304b;
        margin-bottom:0px;

      }

      .faq-header p{

        font-size:16px;
        color:#555;

      }

      .faq-tabs{

        display:flex;
        flex-wrap:wrap;
        gap:16px;
        margin-bottom:20px;

      }

      .faq-tab{

        padding:5px 15px;
        border-radius:999px;
        border:1px solid #c59b2b;
        background:white;
        color:#000;
        font-size:16px;
        cursor:pointer;
        transition:.3s;

      }

      .faq-tab.active{

        background:#bf9122;
        color:white;

      }

      .faq-tab:hover{

        background:#bf9122;
        color:white;

      }

      .faq-list{

        display:flex;
        flex-direction:column;
        gap:10px;

      }

      .faq-item{

        background:white;
        border:1px solid #ece7dd;
        box-shadow:0 4px 10px rgba(0,0,0,.04);

      }

      .faq-question{

        width:100%;
        border:none;
        background:none;
        padding:6px 20px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        cursor:pointer;

      }
        .faq-question span{

  font-size:20px;
  font-family:"Cormorant Garamond",serif;
  color:#17304b;
  text-align:left;
  line-height:1.5;
  width:calc(100% - 50px);

}

.faq-icon{

  width:24px;
  height:24px;
  color:#222;
  transition:.35s ease;

}

.faq-icon.rotate{

  transform:rotate(180deg);

}

.faq-answer{

  max-height:0;
  overflow:hidden;
  transition:
    max-height .45s ease,
    opacity .35s ease;

  opacity:0;

}

.faq-answer.show{

  max-height:500px;
  opacity:1;

}

.faq-answer-inner{

  padding:0 20px 10px;

}

.faq-answer-inner p{

  font-size:16px;
  color:#555;
  line-height:1.4;

}

/* Hover */

.faq-item:hover{

  box-shadow:
  0 10px 30px rgba(0,0,0,.08);

}

/* Tablet */

@media(max-width:1024px){

.faq-section{

padding:70px 0;

}

.faq-header h2{

font-size:48px;

}

.faq-header p{

font-size:20px;

}

.faq-question{

padding:24px;

}

.faq-question span{

font-size:18px;

}

.faq-tab{

padding:12px 28px;
font-size:18px;

}

}

/* Mobile */

@media(max-width:768px){

.faq-section{

padding:60px 0;

}

.faq-container{

width:94%;

}

.faq-header{

text-align:center;

}

.faq-header h2{

font-size:42px;

}

.faq-header p{

font-size:18px;

}

.faq-tabs{

justify-content:center;
gap:12px;

}

.faq-tab{

font-size:16px;
padding:10px 22px;

}

.faq-question{

padding:20px;

}

.faq-question span{

font-size:17px;

}

.faq-answer-inner{

padding:0 20px 22px;

}

.faq-answer-inner p{

font-size:16px;

}

}

/* Small Mobile */

@media(max-width:480px){

.faq-header h2{

font-size:34px;

}

.faq-header p{

font-size:16px;

}

.faq-tab{

width:100%;
text-align:center;

}

.faq-question{

padding:18px;

}

.faq-question span{

font-size:16px;
line-height:1.6;

}

.faq-icon{

width:20px;
height:20px;

}

.faq-answer-inner p{

font-size:15px;
line-height:1.8;

}

}

      `}</style>
    </>
  );
}