import { useEffect, useState, useRef } from "react";
import api from "../services/api";

// Textarea with automatic change detection and submission
export default function SyncInput({
  className,
  method,
  url,
  apiData, // Additional object with relavent request data
  fieldName,
  valueHook = useState,
  placeholder,
  isEditable = true,
}) {
  const [unsavedFlag, setUnsavedFlag] = useState(false);
  const [lineCount, setLineCount] = useState(0);
  const textAlign = lineCount <= 1 ? "text-center" : "text-start";
  const textBox = useRef(null);
  const [value, setValue] = valueHook();

  // Auto growth/shrinking of the textbox
  useEffect(() => {
    const box = textBox.current;
    box.style.height = "0px";
    box.style.height = box.scrollHeight + "px";
    const boxStyle = window.getComputedStyle(box);
    // Counting actual lines in the textbox
    setLineCount(
      Math.round(parseInt(boxStyle.height) / parseInt(boxStyle.lineHeight) - 1)
    );
  }, [value]);

  function handleInputChange() {
    const box = textBox.current;
    setUnsavedFlag(box.value != value);
    setValue(box.value);
  }

  async function handleInputSubmit() {
    if (!unsavedFlag) return;
    let updatedData = apiData;
    updatedData[fieldName] = value;
    const result = await api(method, url, updatedData);
    console.log(`SYNC INPUT UPDATE (${fieldName}):\n`, updatedData);
    setUnsavedFlag(false);
  }

  return (
    <textarea
      ref={textBox}
      readOnly={!isEditable}
      disabled={!isEditable}
      className={`overflow-auto resize-none ${textAlign} ${className}`}
      value={value}
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()}
      onChange={() => handleInputChange()}
      onBlur={async () => await handleInputSubmit()}
    />
  );
}
