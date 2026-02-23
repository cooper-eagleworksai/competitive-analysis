import EWAI_LOGO from "../assets/logo";

export default function EWLogo({ size = 120 }) {
  return (
    <img
      src={EWAI_LOGO}
      alt="EagleWorks AI"
      style={{ height: size, width: "auto", objectFit: "contain" }}
    />
  );
}
