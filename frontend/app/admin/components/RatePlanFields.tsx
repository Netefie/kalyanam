"use client";

import { Plus, Trash2 } from "lucide-react";
import type { RatePlan } from "@/lib/api";
import { slugify } from "@/lib/slugify";

interface Props {
  value: RatePlan[];
  onChange: (plans: RatePlan[]) => void;
}

function emptyPlan(): RatePlan {
  return {
    code: "",
    name: "",
    label: "Standard Rate",
    price: 0,
    offerPrice: 0,
    breakfast: false,
    refundable: true,
    inclusions: [],
  };
}

// The two rates every new room starts with — matches what the public site
// expects to show (Room Only / Room with Breakfast) so an admin filling in a
// brand-new room isn't staring at an empty list.
export const DEFAULT_RATE_PLANS: RatePlan[] = [
  {
    code: "room-only",
    name: "Room Only",
    label: "Standard Rate",
    price: 0,
    offerPrice: 0,
    breakfast: false,
    refundable: false,
    inclusions: ["Non-Refundable"],
  },
  {
    code: "room-with-breakfast",
    name: "Room with Breakfast",
    label: "Standard Rate",
    price: 0,
    offerPrice: 0,
    breakfast: true,
    refundable: true,
    inclusions: [
      "Inclusive of a buffet breakfast at a designated dining venue",
      "Free cancellation",
    ],
  },
];

// Repeatable editor for a room's sellable rates (Room Only, Room with
// Breakfast, ...). Renders inline inside RoomFormModal's form, so it's a
// controlled list rather than owning its own submit.
export default function RatePlanFields({ value, onChange }: Props) {
  const updatePlan = <K extends keyof RatePlan>(
    index: number,
    key: K,
    planValue: RatePlan[K]
  ) => {
    const next = value.map((plan, i) =>
      i === index ? { ...plan, [key]: planValue } : plan
    );
    onChange(next);
  };

  const updateName = (index: number, name: string) => {
    const plan = value[index];
    const next = value.map((p, i) =>
      i === index
        ? {
            ...p,
            name,
            // Keep the code in sync with the name until the admin edits it
            // directly — mirrors how the room's own slug field behaves.
            code: plan.code === slugify(plan.name) ? slugify(name) : p.code,
          }
        : p
    );
    onChange(next);
  };

  const updateInclusions = (index: number, text: string) => {
    updatePlan(
      index,
      "inclusions",
      text.split("\n").map((line) => line.trim()).filter(Boolean)
    );
  };

  const addPlan = () => onChange([...value, emptyPlan()]);
  const removePlan = (index: number) =>
    onChange(value.filter((_, i) => i !== index));

  return (
    <div className="ratePlans">
      {value.map((plan, index) => (
        <div key={index} className="planRow">
          <div className="planRowHead">
            <span>Plan {index + 1}</span>
            <button
              type="button"
              className="removePlan"
              onClick={() => removePlan(index)}
              aria-label="Remove rate plan"
            >
              <Trash2 size={15} />
            </button>
          </div>

          <div className="row">
            <div className="field">
              <label>Name</label>
              <input
                required
                value={plan.name}
                onChange={(e) => updateName(index, e.target.value)}
                placeholder="Room with Breakfast"
              />
            </div>
            <div className="field">
              <label>Code (auto if blank)</label>
              <input
                value={plan.code}
                onChange={(e) => updatePlan(index, "code", e.target.value)}
                placeholder="room-with-breakfast"
              />
            </div>
          </div>

          <div className="row">
            <div className="field">
              <label>Price / night (₹)</label>
              <input
                type="number"
                min={0}
                required
                value={plan.price}
                onChange={(e) =>
                  updatePlan(index, "price", Number(e.target.value))
                }
              />
            </div>
            <div className="field">
              <label>Offer price / night (₹)</label>
              <input
                type="number"
                min={0}
                value={plan.offerPrice ?? 0}
                onChange={(e) =>
                  updatePlan(index, "offerPrice", Number(e.target.value))
                }
              />
            </div>
          </div>

          <div className="field">
            <label>Inclusions (one per line)</label>
            <textarea
              rows={2}
              value={plan.inclusions.join("\n")}
              onChange={(e) => updateInclusions(index, e.target.value)}
              placeholder="Inclusive of a buffet breakfast at a designated dining venue"
            />
          </div>

          <div className="planChecks">
            <label>
              <input
                type="checkbox"
                checked={plan.breakfast}
                onChange={(e) =>
                  updatePlan(index, "breakfast", e.target.checked)
                }
              />
              Breakfast included
            </label>
            <label>
              <input
                type="checkbox"
                checked={plan.refundable}
                onChange={(e) =>
                  updatePlan(index, "refundable", e.target.checked)
                }
              />
              Refundable
            </label>
          </div>
        </div>
      ))}

      <button type="button" className="addPlan" onClick={addPlan}>
        <Plus size={16} />
        Add rate plan
      </button>

      <style jsx>{`
        .ratePlans {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .planRow {
          border: 1px solid #e2d9c8;
          border-radius: 12px;
          padding: 14px 16px 6px;
          background: #fbfaf7;
        }

        .planRowHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #b68d40;
        }

        .removePlan {
          border: none;
          background: transparent;
          color: #b91c1c;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        /* Grid rather than flex — a flex item can't shrink below its input's
           intrinsic size:20 width, which pushed these rows wider than the
           modal that hosts them. */
        .planRow .row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 16px;
        }

        .planRow .field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 0;
          margin-bottom: 12px;
        }

        .planRow label {
          font-size: 12px;
          font-weight: 600;
          color: #666;
        }

        .planRow input,
        .planRow textarea {
          border: 1px solid #e2d9c8;
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13px;
          font-family: inherit;
          outline: none;
          background: #fff;
          width: 100%;
          max-width: 100%;
        }

        .planRow textarea {
          resize: vertical;
        }

        .planRow input:focus,
        .planRow textarea:focus {
          border-color: #b68d40;
        }

        .planChecks {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 18px;
          margin-bottom: 10px;
        }

        .planChecks label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #444;
          cursor: pointer;
        }

        .planChecks input {
          accent-color: #b68d40;
          width: auto;
        }

        .addPlan {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          border: 1px dashed #b68d40;
          border-radius: 10px;
          padding: 10px;
          background: transparent;
          color: #b68d40;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }

        .addPlan:hover {
          background: #f4efe6;
        }

        @media (max-width: 640px) {
          .planRow .row {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }
      `}</style>
    </div>
  );
}
