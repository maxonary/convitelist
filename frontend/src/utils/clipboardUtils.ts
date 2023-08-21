export const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard:", textToCopy);
      })
      .catch((error) => {
        console.error("Failed to copy to clipboard:", error);
      });
  };