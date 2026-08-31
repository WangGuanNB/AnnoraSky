import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#5d3c55",
          border: "4px solid #f6ede7",
          borderRadius: "50%",
          color: "#fff9f4",
          display: "flex",
          fontFamily: "serif",
          fontSize: 28,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-2px",
          width: "100%",
        }}
      >
        AS
      </div>
    ),
    size
  );
}
