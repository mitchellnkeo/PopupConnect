import QRCode from "qrcode";

export async function qrDataUrl(value: string) {
  return QRCode.toDataURL(value, {
    width: 360,
    margin: 1,
    color: {
      dark: "#172e50",
      light: "#ffffff",
    },
  });
}

export function downloadDataUrl(filename: string, dataUrl: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
