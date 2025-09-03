import * as React from "react";
import { SVGProps } from "react";

interface LogoLoaderProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  width?: number;
  height?: number;
}

export function LogoLoader({
  size = 24,
  width,
  height,
  ...props
}: LogoLoaderProps) {
  const svgWidth = size || width || 48;
  const svgHeight = size || height || 48;

  return (
    <svg
      height={svgHeight}
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      width={svgWidth}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="gooey"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="1.5" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            result="gooey"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          />
        </filter>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="shadow"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feDropShadow
            dx={0}
            dy={0}
            floodColor="#f97316"
            floodOpacity="0.5"
            stdDeviation="0.5"
          />
        </filter>
        <linearGradient id="orangeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9736" />
          <stop offset="100%" stopColor="#f05d14" />
        </linearGradient>
      </defs>
      <style
        dangerouslySetInnerHTML={{
          __html: `
              @keyframes morphSquare {
                0%, 5% { d: path('M7,7 h10 v10 h-10 z'); }
                15%, 20% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(45deg) scale(0.9); }
                30% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(90deg) scale(1.1); }
                40%, 100% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(90deg) scale(1); }
              }
              
              @keyframes blob1Appear {
                0%, 30% { transform: translate(0, 0) scale(0); opacity: 0; }
                40% { transform: translate(-2px, -2px) scale(0.7); opacity: 1; filter: blur(1px); }
                50% { transform: translate(-1px, -1px) scale(1.2); opacity: 1; filter: blur(0); }
                60%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
              }
              
              @keyframes blob2Appear {
                0%, 35% { transform: translate(0, 0) scale(0); opacity: 0; }
                45% { transform: translate(2px, -2px) scale(0.7); opacity: 1; filter: blur(1px); }
                55% { transform: translate(1px, -1px) scale(1.2); opacity: 1; filter: blur(0); }
                65%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
              }
              
              @keyframes blob3Appear {
                0%, 40% { transform: translate(0, 0) scale(0); opacity: 0; }
                50% { transform: translate(2px, 2px) scale(0.7); opacity: 1; filter: blur(1px); }
                60% { transform: translate(1px, 1px) scale(1.2); opacity: 1; filter: blur(0); }
                70%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
              }
              
              @keyframes blob4Appear {
                0%, 45% { transform: translate(0, 0) scale(0); opacity: 0; }
                55% { transform: translate(-2px, 2px) scale(0.7); opacity: 1; filter: blur(1px); }
                65% { transform: translate(-1px, 1px) scale(1.2); opacity: 1; filter: blur(0); }
                75%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
              }
              
              @keyframes finalRotateAndSplash {
                0%, 70% { transform: rotate(0deg) scale(1); }
                75% { transform: rotate(90deg) scale(1.05); }
                80% { transform: rotate(180deg) scale(0.95); }
                85% { transform: rotate(270deg) scale(1.02); }
                90%, 100% { transform: rotate(360deg) scale(1); }
              }
              
              @keyframes pulse {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.2); }
              }
              
              @keyframes restart {
                0%, 95% { opacity: 1; }
                97.5% { opacity: 0.7; }
                100% { opacity: 1; }
              }
              
              :root {
                --animation-duration: 2.2s;
              }
              
              .container {
                animation: restart var(--animation-duration) infinite;
                filter: url(#gooey);
              }
              
              .square {
                fill: url(#orangeGradient);
                transform-origin: 12px 12px;
                animation: morphSquare var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) infinite, 
                           pulse var(--animation-duration) ease-in-out infinite;
                filter: url(#shadow);
              }
              
              .blob {
                fill: url(#orangeGradient);
                transform-origin: 12px 12px;
                filter: url(#shadow);
              }
              
              #blob1 {
                animation: blob1Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
                transform-origin: 6px 6px;
              }
              
              #blob2 {
                animation: blob2Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
                transform-origin: 18px 6px;
              }
              
              #blob3 {
                animation: blob3Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
                transform-origin: 18px 18px;
              }
              
              #blob4 {
                animation: blob4Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
                transform-origin: 6px 18px;
              }
              
              #finalShape {
                transform-origin: 12px 12px;
                animation: finalRotateAndSplash var(--animation-duration) cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
              }
            `,
        }}
      />
      {/* Main container with gooey filter */}
      <g className="container">
        {/* Morphing square */}
        <path className="square" d="M7,7 h10 v10 h-10 z" />
        {/* Liquid blobs appearing as corners */}
        <g id="finalShape">
          <path className="blob" d="M8 5a3 3 0 1 0-3 3h3v-3z" id="blob1">
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
              values="M8 5a3 3 0 1 0-3 3h3v-3z;
                       M8 5a3 3 0 1 0-3 3h3c0.5,-1 0,-2 0,-3z;
                       M8 5a3 3 0 1 0-3 3h3v-3z"
            />
          </path>
          <path className="blob" d="M16 8h3a3 3 0 1 0-3-3v3z" id="blob2">
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
              values="M16 8h3a3 3 0 1 0-3-3v3z;
                       M16 8h3a3 3 0 1 0-3-3c-1,0.5 -2,0 -3,0 h3z;
                       M16 8h3a3 3 0 1 0-3-3v3z"
            />
          </path>
          <path className="blob" d="M16 16h3a3 3 0 1 1-3 3v-3z" id="blob3">
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
              values="M16 16h3a3 3 0 1 1-3 3v-3z;
                       M16 16h3a3 3 0 1 1-3 3c-1,-0.5 -2,0 -3,0 h3z;
                       M16 16h3a3 3 0 1 1-3 3v-3z"
            />
          </path>
          <path className="blob" d="M5 16a3 3 0 1 0 3 3v-3H5z" id="blob4">
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
              values="M5 16a3 3 0 1 0 3 3v-3H5z;
                       M5 16a3 3 0 1 0 3 3c0.5,-1 0,-2 0,-3H5z;
                       M5 16a3 3 0 1 0 3 3v-3H5z"
            />
          </path>
        </g>
      </g>
    </svg>
  );
}

export function SuccessLoader(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="gooey-check"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="1.5" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            result="gooey"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          />
        </filter>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="shadow-check"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feDropShadow
            dx={0}
            dy={0}
            floodColor="#f97316"
            floodOpacity="0.5"
            stdDeviation="0.5"
          />
        </filter>
        <linearGradient
          id="orangeGradient-check"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ff9736" />
          <stop offset="100%" stopColor="#f05d14" />
        </linearGradient>
      </defs>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes morphToCheck {
            0%, 5% { d: path('M7,7 h10 v10 h-10 z'); }
            15%, 20% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(45deg) scale(0.9); }
            30% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(90deg) scale(1.1); }
            40% { d: path('M9,9 h6 v6 h-6 z'); transform: rotate(0deg) scale(1); }
            45% { d: path('M9,9 l6,6'); transform: scale(1); }
            50% { d: path('M9,13 l3,3'); transform: scale(1); opacity: 0.7; }
            55% { d: path('M8,13 l4,4 l5,-8'); transform: scale(1); opacity: 0.8; }
            60%, 70% { d: path('M7,13 l5,5 l6,-10'); transform: scale(1.05); opacity: 1; }
            80%, 100% { d: path('M7,13 l5,5 l6,-10'); transform: scale(1); opacity: 1; }
          }
          
          @keyframes finalPulse {
            0%, 70% { transform: translate(0, 0); }
            72% { transform: translate(-0.5px, 0.5px); }
            74% { transform: translate(1px, -0.5px); }
            76% { transform: translate(-1px, -0.5px); }
            78% { transform: translate(0.5px, 1px); }
            80% { transform: translate(-0.5px, -1px); }
            82% { transform: translate(1px, 0.5px); }
            84% { transform: translate(-0.5px, 0.5px); }
            86% { transform: translate(0.5px, -0.5px); }
            88%, 100% { transform: translate(0, 0); }
          }
  
          @keyframes blobAnimation {
            0%, 20% { r: 0; opacity: 0; }
            30% { r: 1.5; opacity: 0.2; }
            40% { r: 1; opacity: 0.4; }
            50% { r: 0.5; opacity: 0.6; }
            60%, 100% { r: 0; opacity: 0; }
          }
          
          :root {
            --animation-duration: 2.2s;
          }
          
          svg {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }
  
          .container-check {
            filter: url(#gooey-check);
          }
          
          .checkmark {
            fill: none;
            stroke: url(#orangeGradient-check);
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            transform-origin: 12px 12px;
            animation: morphToCheck var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            filter: url(#shadow-check);
          }
          
          #check-finalShape {
            transform-origin: 12px 12px;
            animation: finalPulse var(--animation-duration) cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
          }
  
          .blob-effect {
            fill: url(#orangeGradient-check);
            filter: url(#shadow-check);
          }
        `,
        }}
      />
      {/* Container with gooey filter */}
      <g className="container-check">
        <g id="check-finalShape">
          {/* Morphing square to check */}
          <path className="checkmark" d="M7,7 h10 v10 h-10 z" />

          {/* Small blob effects that appear briefly during the animation */}
          <circle className="blob-effect" cx="7" cy="7" r="0">
            <animate
              attributeName="r"
              begin="0s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;1.5;1;0.5;0"
            />
            <animate
              attributeName="opacity"
              begin="0s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;0.2;0.4;0.6;0"
            />
          </circle>

          <circle className="blob-effect" cx="17" cy="7" r="0">
            <animate
              attributeName="r"
              begin="0.1s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;1.5;1;0.5;0"
            />
            <animate
              attributeName="opacity"
              begin="0.1s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;0.2;0.4;0.6;0"
            />
          </circle>

          <circle className="blob-effect" cx="17" cy="17" r="0">
            <animate
              attributeName="r"
              begin="0.2s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;1.5;1;0.5;0"
            />
            <animate
              attributeName="opacity"
              begin="0.2s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;0.2;0.4;0.6;0"
            />
          </circle>

          <circle className="blob-effect" cx="7" cy="17" r="0">
            <animate
              attributeName="r"
              begin="0.3s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;1.5;1;0.5;0"
            />
            <animate
              attributeName="opacity"
              begin="0.3s"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1; 0.4 0 0.2 1"
              keyTimes="0;0.3;0.4;0.5;0.6"
              values="0;0.2;0.4;0.6;0"
            />
          </circle>
        </g>
      </g>
    </svg>
  );
}

export function FailLoader(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
  
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      height='10px'
  width='10px'
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="gooey-fail"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="1.5" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            result="gooey"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          />
        </filter>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="shadow-fail"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feDropShadow
            dx={0}
            dy={0}
            floodColor="#f97316"
            floodOpacity="0.5"
            stdDeviation="0.5"
          />
        </filter>
        <linearGradient
          id="orangeGradient-fail"
          x1="0%"
          x2="100%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ff9736" />
          <stop offset="100%" stopColor="#f05d14" />
        </linearGradient>
      </defs>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes morphToX {
            0%, 5% { d: path('M7,7 h10 v10 h-10 z'); }
            15%, 20% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(45deg) scale(0.9); }
            30% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(90deg) scale(1.1); }
            40% { d: path('M9,9 h6 v6 h-6 z'); transform: rotate(0deg) scale(1); }
            45% { d: path('M9,9 l6,6'); transform: scale(1); }
            50% { d: path('M9,9 l6,6 m0,0 l-6,-6'); transform: scale(1); opacity: 0.7; }
            55% { d: path('M8,8 l8,8 m0,-8 l-8,8'); transform: scale(1); opacity: 0.8; }
            60%, 70% { d: path('M8,8 l8,8 m0,-8 l-8,8'); transform: scale(1.05); opacity: 1; }
            80%, 100% { d: path('M8,8 l8,8 m0,-8 l-8,8'); transform: scale(1); opacity: 1; }
          }
          
          @keyframes blob1Appear {
            0%, 30% { transform: translate(0, 0) scale(0); opacity: 0; }
            40% { transform: translate(-2px, -2px) scale(0.7); opacity: 1; filter: blur(1px); }
            50% { transform: translate(-1px, -1px) scale(1.2); opacity: 1; filter: blur(0); }
            60%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          
          @keyframes blob2Appear {
            0%, 35% { transform: translate(0, 0) scale(0); opacity: 0; }
            45% { transform: translate(2px, -2px) scale(0.7); opacity: 1; filter: blur(1px); }
            55% { transform: translate(1px, -1px) scale(1.2); opacity: 1; filter: blur(0); }
            65%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          
          @keyframes blob3Appear {
            0%, 40% { transform: translate(0, 0) scale(0); opacity: 0; }
            50% { transform: translate(2px, 2px) scale(0.7); opacity: 1; filter: blur(1px); }
            60% { transform: translate(1px, 1px) scale(1.2); opacity: 1; filter: blur(0); }
            70%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          
          @keyframes blob4Appear {
            0%, 45% { transform: translate(0, 0) scale(0); opacity: 0; }
            55% { transform: translate(-2px, 2px) scale(0.7); opacity: 1; filter: blur(1px); }
            65% { transform: translate(-1px, 1px) scale(1.2); opacity: 1; filter: blur(0); }
            75%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          
          @keyframes finalShake {
            0%, 70% { transform: translate(0, 0); }
            72% { transform: translate(-0.5px, 0.5px); }
            74% { transform: translate(1px, -0.5px); }
            76% { transform: translate(-1px, -0.5px); }
            78% { transform: translate(0.5px, 1px); }
            80% { transform: translate(-0.5px, -1px); }
            82% { transform: translate(1px, 0.5px); }
            84% { transform: translate(-0.5px, 0.5px); }
            86% { transform: translate(0.5px, -0.5px); }
            88%, 100% { transform: translate(0, 0); }
          }
          
          @keyframes pulse {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.2); }
          }
          
          @keyframes restart {
            0%, 95% { opacity: 1; }
            97.5% { opacity: 0.7; }
            100% { opacity: 1; }
          }
          
          :root {
            --animation-duration: 2.2s;
          }
          
          svg {
            width: 100%;
            height: 100%;
            max-width: 100%;
            max-height: 100%;
          }
          
          .container-fail {
            filter: url(#gooey-fail);
          }
          
          .xmark {
            fill: none;
            stroke: url(#orangeGradient-fail);
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
            transform-origin: 12px 12px;
            animation: morphToX var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            filter: url(#shadow-fail);
          }
          
          .blob-fail {
            fill: url(#orangeGradient-fail);
            transform-origin: 12px 12px;
            filter: url(#shadow-fail);
          }
          
          #fail-blob1 {
            animation: blob1Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transform-origin: 6px 6px;
          }
          
          #fail-blob2 {
            animation: blob2Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transform-origin: 18px 6px;
          }
          
          #fail-blob3 {
            animation: blob3Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transform-origin: 18px 18px;
          }
          
          #fail-blob4 {
            animation: blob4Appear var(--animation-duration) cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            transform-origin: 6px 18px;
          }
          
          #fail-finalShape {
            transform-origin: 12px 12px;
            animation: finalShake var(--animation-duration) cubic-bezier(0.45, 0.05, 0.55, 0.95) forwards;
          }
        `,
        }}
      />
      {/* Main container with gooey filter */}
      <g className="container-fail">
        {/* Morphing square to X */}
        <path className="xmark" d="M7,7 h10 v10 h-10 z" />
        {/* Liquid blobs appearing as corners */}
        <g id="fail-finalShape">
          <path
            className="blob-fail"
            d="M8 5a3 3 0 1 0-3 3h3v-3z"
            id="fail-blob1"
          >
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              fill="freeze"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              values="M8 5a3 3 0 1 0-3 3h3v-3z;
                       M8 5a3 3 0 1 0-3 3h3c0.5,-1 0,-2 0,-3z;
                       M8 5a3 3 0 1 0-3 3h3v-3z"
            />
          </path>
          <path
            className="blob-fail"
            d="M16 8h3a3 3 0 1 0-3-3v3z"
            id="fail-blob2"
          >
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
              values="M16 8h3a3 3 0 1 0-3-3v3z;
                       M16 8h3a3 3 0 1 0-3-3c-1,0.5 -2,0 -3,0 h3z;
                       M16 8h3a3 3 0 1 0-3-3v3z"
            />
          </path>
          <path
            className="blob-fail"
            d="M16 16h3a3 3 0 1 1-3 3v-3z"
            id="fail-blob3"
          >
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
              values="M16 16h3a3 3 0 1 1-3 3v-3z;
                       M16 16h3a3 3 0 1 1-3 3c-1,-0.5 -2,0 -3,0 h3z;
                       M16 16h3a3 3 0 1 1-3 3v-3z"
            />
          </path>
          <path
            className="blob-fail"
            d="M5 16a3 3 0 1 0 3 3v-3H5z"
            id="fail-blob4"
          >
            <animate
              attributeName="d"
              calcMode="spline"
              dur="2.2s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
              values="M5 16a3 3 0 1 0 3 3v-3H5z;
                       M5 16a3 3 0 1 0 3 3c0.5,-1 0,-2 0,-3H5z;
                       M5 16a3 3 0 1 0 3 3v-3H5z"
            />
          </path>
        </g>
      </g>
    </svg>
  );
}

export function LogoMappr(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="gooey"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="1.5" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            result="gooey"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
          />
        </filter>
        <filter
          filterUnits="userSpaceOnUse"
          height="200%"
          id="shadow"
          width="200%"
          x="-50%"
          y="-50%"
        >
          <feDropShadow
            dx={0}
            dy={0}
            floodColor="#f97316"
            floodOpacity="0.5"
            stdDeviation="0.5"
          />
        </filter>
        <linearGradient id="orangeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ff9736" />
          <stop offset="100%" stopColor="#f05d14" />
        </linearGradient>
      </defs>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n    @keyframes morphSquare {\n      0%, 5% { d: path('M7,7 h10 v10 h-10 z'); }\n      15%, 20% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(45deg) scale(0.9); }\n      30% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(90deg) scale(1.1); }\n      40%, 100% { d: path('M7,7 h10 v10 h-10 z'); transform: rotate(90deg) scale(1); }\n    }\n    \n    @keyframes blob1Appear {\n      0%, 30% { transform: translate(0, 0) scale(0); opacity: 0; }\n      40% { transform: translate(-2px, -2px) scale(0.7); opacity: 1; filter: blur(1px); }\n      50% { transform: translate(-1px, -1px) scale(1.2); opacity: 1; filter: blur(0); }\n      60%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }\n    }\n    \n    @keyframes blob2Appear {\n      0%, 35% { transform: translate(0, 0) scale(0); opacity: 0; }\n      45% { transform: translate(2px, -2px) scale(0.7); opacity: 1; filter: blur(1px); }\n      55% { transform: translate(1px, -1px) scale(1.2); opacity: 1; filter: blur(0); }\n      65%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }\n    }\n    \n    @keyframes blob3Appear {\n      0%, 40% { transform: translate(0, 0) scale(0); opacity: 0; }\n      50% { transform: translate(2px, 2px) scale(0.7); opacity: 1; filter: blur(1px); }\n      60% { transform: translate(1px, 1px) scale(1.2); opacity: 1; filter: blur(0); }\n      70%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }\n    }\n    \n    @keyframes blob4Appear {\n      0%, 45% { transform: translate(0, 0) scale(0); opacity: 0; }\n      55% { transform: translate(-2px, 2px) scale(0.7); opacity: 1; filter: blur(1px); }\n      65% { transform: translate(-1px, 1px) scale(1.2); opacity: 1; filter: blur(0); }\n      75%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }\n    }\n    \n    @keyframes finalRotateAndSplash {\n      0%, 70% { transform: rotate(0deg) scale(1); }\n      75% { transform: rotate(90deg) scale(1.05); }\n      80% { transform: rotate(180deg) scale(0.95); }\n      85% { transform: rotate(270deg) scale(1.02); }\n      90%, 100% { transform: rotate(360deg) scale(1); }\n    }\n    \n    @keyframes pulse {\n      0%, 100% { filter: brightness(1); }\n      50% { filter: brightness(1.2); }\n    }\n    \n    @keyframes restart {\n      0%, 95% { opacity: 1; }\n      97.5% { opacity: 0.7; }\n      100% { opacity: 1; }\n    }\n    \n    :root {\n       }\n        .container {\n           filter: url(#gooey);\n    }\n      .square {\n      fill: url(#orangeGradient);\n      transform-origin: 12px 12px;\n   }\n     .blob {\n      fill: url(#orangeGradient);\n      transform-origin: 12px 12px;\n      filter: url(#shadow);\n    }  ",
        }}
      />
      {/* Main container with gooey filter */}
      <g className="container">
        {/* Morphing square */}
        <path className="square" d="M7,7 h10 v10 h-10 z" />
        {/* Liquid blobs appearing as corners */}
        <g id="finalShape">
          <path className="blob" d="M8 5a3 3 0 1 0-3 3h3v-3z" id="blob1" />
          <path className="blob" d="M16 8h3a3 3 0 1 0-3-3v3z" id="blob2" />
          <path className="blob" d="M16 16h3a3 3 0 1 1-3 3v-3z" id="blob3" />
          <path className="blob" d="M5 16a3 3 0 1 0 3 3v-3H5z" id="blob4" />
        </g>
      </g>
    </svg>
  );
}


export function GameIconsUpgrade(props: React.SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="m256 29.816l-231 154v106.368l231-154l231 154V183.816zm0 128.043L105 259.783v90.283l151-101.925l151 101.925v-90.283zm0 112l-87 58.725v67.6l87-58l87 58v-67.6zm0 89.957l-87 58v64.368l87-58l87 58v-64.368z"></path></svg>);
}


export function StashBell(props: React.SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" d="M18.161 8.905A6.19 6.19 0 0 0 13.5 3.434V3a1.5 1.5 0 0 0-3 0v.434a6.19 6.19 0 0 0-4.661 5.47l-.253 2.033l-.001.015a4.34 4.34 0 0 1-1.357 2.807l-.014.012c-.244.23-.544.51-.73 1.058c-.17.496-.234 1.17-.234 2.186c0 .372.067.731.254 1.044c.193.324.472.524.76.646c.271.115.564.167.822.2c.174.022.372.039.562.055l.25.022q.345.033.742.065a.75.75 0 0 0-.3.777a3.7 3.7 0 0 0 .865 1.676A3.74 3.74 0 0 0 10 22.75c1.11 0 2.11-.484 2.795-1.25a.75.75 0 1 0-1.118-1c-.413.461-1.01.75-1.677.75a2.24 2.24 0 0 1-2.07-1.366a2 2 0 0 1-.125-.389a.75.75 0 0 0-.217-.38c1.213.077 2.696.135 4.412.135c2.622 0 4.703-.136 6.101-.268l.25-.022c.191-.016.389-.033.563-.055c.258-.033.55-.085.822-.2c.288-.122.567-.322.76-.646c.187-.313.254-.672.254-1.044c0-1.017-.064-1.69-.233-2.186c-.187-.548-.487-.829-.73-1.058l-.015-.012a4.34 4.34 0 0 1-1.357-2.807l-.001-.015zm-10.83.155l.001-.015a4.684 4.684 0 0 1 9.336 0l.001.015l.253 2.032a5.84 5.84 0 0 0 1.825 3.76c.226.213.288.279.35.46c.083.245.153.705.153 1.703c0 .201-.037.267-.041.274l-.003.004l-.002.002a.2.2 0 0 1-.054.03a1.7 1.7 0 0 1-.424.091c-.145.019-.292.031-.463.046l-.302.027c-1.357.127-3.39.261-5.961.261c-2.57 0-4.604-.134-5.96-.261l-.303-.027c-.171-.015-.318-.027-.463-.046a1.7 1.7 0 0 1-.424-.092a.2.2 0 0 1-.054-.029l-.005-.006c-.004-.007-.041-.073-.041-.274c0-.998.07-1.458.153-1.702c.062-.182.124-.248.35-.46a5.84 5.84 0 0 0 1.825-3.76z"></path></svg>);
}

export function PhUser(props: React.SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={256} height={256} viewBox="0 0 256 256" {...props}><path fill="currentColor" d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8M72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56"></path></svg>);
}


export function LetsIconsSettingLineDuotone(props: React.SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" {...props}><path fill="currentColor" fillOpacity={0.25} fillRule="evenodd" d="M14.136 3.361c-.043-.433-.065-.65-.152-.82a1 1 0 0 0-.521-.47C13.286 2 13.068 2 12.632 2h-1.264c-.436 0-.654 0-.83.07a1 1 0 0 0-.522.472c-.087.169-.109.386-.152.82c-.082.82-.123 1.23-.295 1.455a1 1 0 0 1-.929.385c-.28-.038-.6-.299-1.238-.821c-.337-.276-.506-.414-.687-.472a1 1 0 0 0-.702.035c-.175.075-.33.23-.637.538l-.894.893c-.308.308-.462.463-.538.637a1 1 0 0 0-.035.702c.058.182.196.35.472.688c.523.639.784.958.822 1.239a1 1 0 0 1-.385.928c-.225.172-.635.213-1.456.295c-.434.043-.651.065-.82.152a1 1 0 0 0-.472.521c-.07.177-.07.395-.07.831v1.264c0 .436 0 .654.07.83a1 1 0 0 0 .472.522c.169.087.386.109.82.152c.82.082 1.23.123 1.456.295a1 1 0 0 1 .384.928c-.037.281-.298.6-.82 1.239c-.277.337-.415.506-.473.687a1 1 0 0 0 .035.702c.076.175.23.33.538.637l.894.894c.308.308.462.462.637.538a1 1 0 0 0 .702.035c.181-.058.35-.196.687-.472c.639-.523.958-.784 1.239-.822a1 1 0 0 1 .928.385c.172.225.213.636.295 1.457c.043.433.065.65.152.82a1 1 0 0 0 .521.47c.177.071.395.071.831.071h1.264c.436 0 .654 0 .83-.07a1 1 0 0 0 .522-.471c.087-.17.109-.387.152-.82c.082-.822.123-1.232.295-1.457a1 1 0 0 1 .929-.385c.28.038.6.299 1.238.821c.337.276.506.414.687.472a1 1 0 0 0 .702-.035c.175-.075.33-.23.637-.538l.894-.893c.308-.308.462-.462.538-.637a1 1 0 0 0 .035-.702c-.058-.182-.196-.35-.472-.687c-.522-.639-.783-.958-.821-1.238a1 1 0 0 1 .385-.93c.225-.17.635-.212 1.456-.294c.433-.043.65-.065.82-.152a1 1 0 0 0 .471-.521c.07-.177.07-.395.07-.831v-1.264c0-.436 0-.654-.07-.83a1 1 0 0 0-.472-.522c-.169-.087-.386-.109-.82-.152c-.82-.082-1.23-.123-1.456-.295a1 1 0 0 1-.384-.928c.037-.281.298-.6.82-1.239c.277-.337.415-.506.473-.687a1 1 0 0 0-.035-.702c-.076-.175-.23-.33-.538-.637l-.894-.894c-.308-.308-.462-.462-.637-.538a1 1 0 0 0-.702-.035c-.181.058-.35.196-.687.472c-.639.523-.958.784-1.238.821a1 1 0 0 1-.929-.384c-.172-.225-.213-.636-.295-1.457" clipRule="evenodd"></path><circle cx={12} cy={12} r={3} fill="currentColor"></circle></svg>);
}


export function IconParkTwotoneSettingTwo(props: React.SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><defs><mask id="SVGjtLwKbIn"><g fill="#555555" stroke="#fff" strokeLinejoin="round" strokeWidth={4}><path d="M18.284 43.171a20 20 0 0 1-8.696-5.304a6 6 0 0 0-5.182-9.838A20 20 0 0 1 4 24c0-2.09.32-4.106.916-6H5a6 6 0 0 0 5.385-8.65a20 20 0 0 1 8.267-4.627A6 6 0 0 0 24 8a6 6 0 0 0 5.348-3.277a20 20 0 0 1 8.267 4.627A6 6 0 0 0 43.084 18A20 20 0 0 1 44 24c0 1.38-.14 2.728-.406 4.03a6 6 0 0 0-5.182 9.838a20 20 0 0 1-8.696 5.303a6.003 6.003 0 0 0-11.432 0Z"></path><path d="M24 31a7 7 0 1 0 0-14a7 7 0 0 0 0 14Z"></path></g></mask></defs><path fill="currentColor" d="M0 0h48v48H0z" mask="url(#SVGjtLwKbIn)"></path></svg>);
}


export function IconParkOutlineSettingTwo(props: React.SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 48 48" {...props}><g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth={4}><path d="M18.284 43.171a20 20 0 0 1-8.696-5.304a6 6 0 0 0-5.182-9.838A20 20 0 0 1 4 24c0-2.09.32-4.106.916-6H5a6 6 0 0 0 5.385-8.65a20 20 0 0 1 8.267-4.627A6 6 0 0 0 24 8a6 6 0 0 0 5.348-3.277a20 20 0 0 1 8.267 4.627A6 6 0 0 0 43.084 18A20 20 0 0 1 44 24c0 1.38-.14 2.728-.406 4.03a6 6 0 0 0-5.182 9.838a20 20 0 0 1-8.696 5.303a6.003 6.003 0 0 0-11.432 0Z"></path><path d="M24 31a7 7 0 1 0 0-14a7 7 0 0 0 0 14Z"></path></g></svg>);
}


export function LogosGoogleIcon(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={256} height={262} viewBox="0 0 256 262" {...props}><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>);
}

export function Fa7BrandsGithub(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={512} height={512} viewBox="0 0 512 512" {...props}><path fill="currentColor" d="M173.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6m-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3m44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9M252.8 8C114.1 8 8 113.3 8 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C436.2 457.8 504 362.9 504 252C504 113.3 391.5 8 252.8 8M105.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1m-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7m32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1m-11.4-14.7c-1.6 1-1.6 3.6 0 5.9s4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2"></path></svg>);
}

export function FluentPanelLeftExpand28Filled(props: SVGProps<SVGSVGElement>) {
	return (<svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} viewBox="0 0 28 28" {...props}><path fill="currentColor" d="M17.72 11.53a.75.75 0 1 1 1.06-1.06l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72h-5.69a.75.75 0 0 1 0-1.5h5.69zM22.25 4A3.75 3.75 0 0 1 26 7.75v12.5A3.75 3.75 0 0 1 22.25 24H5.755a3.75 3.75 0 0 1-3.75-3.75V7.75A3.75 3.75 0 0 1 5.754 4zm2.25 3.75a2.25 2.25 0 0 0-2.25-2.25H11.006v17H22.25a2.25 2.25 0 0 0 2.25-2.25z"></path></svg>);
}