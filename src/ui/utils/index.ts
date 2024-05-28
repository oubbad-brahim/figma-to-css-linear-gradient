export const writeTextToClipboard = (text: string) => {
  const prevActive = document.activeElement as HTMLElement;
  const textArea = document.createElement("textarea");

  textArea.value = text;

  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  return new Promise<void>((res, rej) => {
    document.execCommand("copy") ? res() : rej();
    textArea.remove();
    prevActive.focus();
  });
};

export const showToast = (message: string) => {
  parent.postMessage(
    { pluginMessage: { type: "toast-message", message } },
    "*"
  );
};
