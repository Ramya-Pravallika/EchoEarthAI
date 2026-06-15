import React from "react";

export function handleKeyboardSelect(event: React.KeyboardEvent, callback: () => void) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    callback();
  }
}

export function announceToScreenReader(message: string) {
  const ariaLive = document.getElementById("aria-live-announcer");
  if (ariaLive) {
    ariaLive.innerText = message;
  }
}
