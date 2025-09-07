import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left wing */}
          <path
            d="M 20 80 Q 30 70, 50 75 L 45 80 Q 25 85, 20 95 Z"
            fill="black"
          />
          <path
            d="M 30 90 Q 40 80, 60 85 L 55 90 Q 35 95, 30 105 Z"
            fill="black"
          />
          <path
            d="M 40 100 Q 50 90, 70 95 L 65 100 Q 45 105, 40 115 Z"
            fill="black"
          />
          <path
            d="M 50 110 Q 60 100, 80 105 L 75 110 Q 55 115, 50 125 Z"
            fill="black"
          />
          
          {/* Right wing */}
          <path
            d="M 180 80 Q 170 70, 150 75 L 155 80 Q 175 85, 180 95 Z"
            fill="black"
          />
          <path
            d="M 170 90 Q 160 80, 140 85 L 145 90 Q 165 95, 170 105 Z"
            fill="black"
          />
          <path
            d="M 160 100 Q 150 90, 130 95 L 135 100 Q 155 105, 160 115 Z"
            fill="black"
          />
          <path
            d="M 150 110 Q 140 100, 120 105 L 125 110 Q 145 115, 150 125 Z"
            fill="black"
          />
          
          {/* Body */}
          <ellipse cx="100" cy="100" rx="20" ry="30" fill="black" />
          
          {/* White chest with spots */}
          <ellipse cx="100" cy="95" rx="12" ry="18" fill="white" />
          <circle cx="97" cy="88" r="2" fill="black" />
          <circle cx="103" cy="88" r="2" fill="black" />
          <circle cx="100" cy="94" r="2" fill="black" />
          <circle cx="96" cy="100" r="2" fill="black" />
          <circle cx="104" cy="100" r="2" fill="black" />
          <circle cx="100" cy="106" r="2" fill="black" />
          
          {/* Head */}
          <circle cx="100" cy="70" r="12" fill="black" />
          
          {/* Tail feathers */}
          <path
            d="M 100 125 L 95 140 L 98 138 L 100 145 L 102 138 L 105 140 Z"
            fill="black"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
