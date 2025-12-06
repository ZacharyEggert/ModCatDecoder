"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Decoder } from "../../../../lib/decode.mjs";

const FIELD_CONFIG = [
  { key: "model", label: "Model" },
  { key: "topWood", label: "Top Wood" },
  { key: "frets", label: "Frets" },
  { key: "topSpec", label: "Top Spec" },
  { key: "topGrade", label: "Top Grade" },
  { key: "neckWood", label: "Neck Wood" },
  { key: "neckCarve", label: "Neck Carve" },
  { key: "fingerboard", label: "Fingerboard Wood" },
  { key: "inlay", label: "Inlay" },
  { key: "bridge", label: "Bridge" },
  { key: "color", label: "Color" },
  { key: "hardware", label: "Hardware" },
  { key: "treblepu", label: "Treble Pickup" },
  { key: "middlepu", label: "Middle Pickup" },
  { key: "basspu", label: "Bass Pickup" },
  { key: "elec", label: "Electronics" },
] as const;

type FieldKey = (typeof FIELD_CONFIG)[number]["key"];

const createEmptyFields = () => {
  return FIELD_CONFIG.reduce<Record<FieldKey, string>>(
    (acc, field) => {
      acc[field.key] = "";
      return acc;
    },
    {} as Record<FieldKey, string>,
  );
};

export default function DecoderForm() {
  const decoder = useMemo(
    () =>
      new Decoder({
        resourcePath: "/codes/",
        skipLoadResources: typeof window === "undefined",
      }),
    [],
  );
  const [input, setInput] = useState("");
  const [fields, setFields] = useState(createEmptyFields);

  useEffect(() => {
    decoder.loadResources().catch((error) => {
      console.error("Error loading resources:", error);
    });
  }, [decoder]);

  const handleDecode = useCallback(() => {
    if (!input.trim()) {
      return;
    }
    decoder.decode(input);
    setFields(decoder.getFields() as typeof fields);
  }, [decoder, input]);

  return (
    <div className="mx-auto">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg dark:shadow-none dark:-outline-offset-1 dark:outline-white/10">
              <table className="relative min-w-full divide-y divide-neutral-300 dark:divide-white/15">
                <thead className="bg-neutral-50 dark:bg-neutral-950">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-neutral-900 sm:pl-6 dark:text-neutral-200"
                    >
                      Enter MODCAT:
                    </th>
                    <th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-6">
                      <input
                        id="theMODCAT"
                        size={30}
                        type="text"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        className="rounded-md border-2 border-neutral-700 px-2 py-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600 dark:bg-neutral-900 dark:text-white"
                      />
                      <input
                        id="decodeButton"
                        type="button"
                        value="Decode MODCAT"
                        onClick={handleDecode}
                        className="ml-4 cursor-pointer rounded-md bg-neutral-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-600"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 bg-white dark:divide-white/10 dark:bg-neutral-900">
                  {FIELD_CONFIG.map((field) => (
                    <tr key={field.key}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-neutral-900 sm:pl-6 dark:text-white">
                        {field.label}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                        {fields[field.key]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <p className="p-4 text-center">A sample MODCAT: 5MM2F-HVIB2_CC_NS-SK</p>
    </div>
  );
}
