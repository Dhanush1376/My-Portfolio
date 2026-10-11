import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { getServiceBySlug } from '../data/servicesData';
import { useTheme } from '../hooks/useTheme';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CustomCursor from '../components/common/CustomCursor';
import SEO from '../components/common/SEO';
import '../styles/service-detail.css';

gsap.registerPlugin(ScrollTrigger);

// Tech brand vector SVG icon definitions
const TECH_ICONS = {
  nextjs: "M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z",
  react: "M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278z",
  typescript: "M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z",
  vite: "m8.286 10.578.512-8.657a.306.306 0 0 1 .247-.282L17.377.006a.306.306 0 0 1 .353.385l-1.558 5.403a.306.306 0 0 0 .352.385l2.388-.46a.306.306 0 0 1 .332.438l-6.79 13.55-.123.19a.294.294 0 0 1-.252.14c-.177 0-.35-.152-.305-.369l1.095-5.301a.306.306 0 0 0-.388-.355l-1.433.435a.306.306 0 0 1-.389-.354l.69-3.375a.306.306 0 0 0-.37-.36l-2.32.536a.306.306 0 0 1-.374-.316zm14.976-7.926L17.284 3.74l-.544 1.887 2.077-.4a.8.8 0 0 1 .84.369.8.8 0 0 1 .034.783L12.9 19.93l-.013.025-.015.023-.122.19a.801.801 0 0 1-.672.37.826.826 0 0 1-.634-.302.8.8 0 0 1-.16-.67l1.029-4.981-1.12.34a.81.81 0 0 1-.86-.262.802.802 0 0 1-.165-.67l.63-3.08-2.027.468a.808.808 0 0 1-.768-.233.81.81 0 0 1-.217-.6l.389-6.57-7.44-1.33a.612.612 0 0 0-.64.906L11.58 23.691a.612.612 0 0 0 1.066-.004l11.26-20.135a.612.612 0 0 0-.644-.9z",
  flutter: "M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z",
  nodejs: "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z",
  postgresql: "M23.5594 14.7228a.5269.5269 0 0 0-.0563-.1191c-.139-.2632-.4768-.3418-1.0074-.2321-1.6533.3411-2.2935.1312-2.5256-.0191 1.342-2.0482 2.445-4.522 3.0411-6.8297.2714-1.0507.7982-3.5237.1222-4.7316a1.5641 1.5641 0 0 0-.1509-.235C21.6931.9086 19.8007.0248 17.5099.0005c-1.4947-.0158-2.7705.3461-3.1161.4794a9.449 9.449 0 0 0-.5159-.0816 8.044 8.044 0 0 0-1.3114-.1278c-1.1822-.0184-2.2038.2642-3.0498.8406-.8573-.3211-4.7888-1.645-7.2219.0788C.9359 2.1526.3086 3.8733.4302 6.3043c.0409.818.5069 3.334 1.2423 5.7436.4598 1.5065.9387 2.7019 1.4334 3.582.553.9942 1.1259 1.5933 1.7143 1.7895.4474.1491 1.1327.1441 1.8581-.7279.8012-.9635 1.5903-1.8258 1.9446-2.2069.4351.2355.9064.3625 1.39.3772",
  tailwindcss: "M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z",
  python: "M11.914 0C5.825 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.825H3.88S0 5.772 0 11.895c0 6.122 3.398 5.918 3.398 5.918h2.029v-2.844s-.109-3.398 3.334-3.398h5.736v-.848s.078-2.607-2.695-2.607h-3.66V6.012h5.85s4.444.17 4.444-4.25c0-4.42-3.87-1.762-6.522-1.762zm-2.09 1.458a.94.94 0 1 1 0 1.88.94.94 0 0 1 0-1.88z",
  fastapi: "M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-.92 18.033l-4.14-8.28h3.06l1.08-4.32 4.14 8.28h-3.06l-1.08 4.32z",
  figma: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981z",
  graphql: "M12.002 0a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm8.54 4.931a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm0 9.862a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277zm-8.54 4.931a2.138 2.138 0 1 0 0 4.276 2.138 2.138 0 1 0 0-4.276zm-8.542-4.93a2.138 2.138 0 1 0 0 4.276 2.138 2.138 0 1 0 0-4.277zm0-9.863a2.138 2.138 0 1 0 0 4.277 2.138 2.138 0 1 0 0-4.277z",
  stripe: "M13.976 9.15c0-.84-.71-1.32-1.92-1.32-.97 0-1.85.34-2.58.78l-.66-1.52c.98-.53 2.15-.84 3.39-.84 2.45 0 4.02 1.25 4.02 3.23 0 2.92-3.87 3.03-3.87 4.54 0 .97.87 1.34 2.14 1.34 1.13 0 2.22-.44 3.03-.98l.63 1.57c-1.1.66-2.45 1.05-3.85 1.05-2.67 0-4.25-1.35-4.25-3.34 0-3.08 3.96-3.17 3.96-4.5z",
  supabase: "M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z",
  openai: "M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zm-1.22-9.46a4.453 4.453 0 0 1 2.36-1.996V12.4a.79.79 0 0 0 .392.682l5.843 3.37-2.02 1.168a.08.08 0 0 1-.07.005l-4.84-2.794a4.504 4.504 0 0 1-1.665-6.091zm16.147 3.388-5.843-3.37 2.02-1.168a.08.08 0 0 1 .07-.005l4.84 2.795a4.504 4.504 0 0 1 1.665 6.09 4.468 4.468 0 0 1-2.36 1.997V12.914a.79.79 0 0 0-.392-.682zm2.013-3.023-.14-.085-4.784-2.759a.776.776 0 0 0-.78 0L9.193 9.734V7.402a.08.08 0 0 1 .033-.062l4.84-2.795a4.5 4.5 0 0 1 6.14 1.646 4.458 4.458 0 0 1 .535 3.014zM8.077 10.98l3.923-2.264 3.923 2.265v4.529l-3.923 2.264-3.923-2.264z",
  redis: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.64 6.72L12 9.96 6.36 6.72 12 3.48l5.64 3.24zm-11.28 2.4L11 11.5v6.52l-4.64-2.38V9.12zm11.28 0v6.52L13 18.02V11.5l4.64-2.38z",
  langchain: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.875 5.25a2.25 2.25 0 0 1 2.25 2.25v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 0-.75-.75h-2.25a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 1-1.5 0v-1.5a2.25 2.25 0 0 1 2.25-2.25h2.25zm5.625 6.75a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h7.5zm-3.75 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 0 .75.75h.75v-2.25a.75.75 0 0 1 .75-.75z",
  razorpay: "M22.436 0l-11.91 7.773-4.99 4.316 4.195 2.738 8.16-5.328-4.717 8.358 4.37 2.853L22.436 0zM1.564 24l7.158-4.673 4.99-4.316-4.195-2.738-4.708 3.073 4.717-8.358-4.37-2.853L1.564 24z",
  cloudinary: "M19.78 9.38C19.26 6.33 16.63 4 13.5 4 10.97 4 8.79 5.53 7.8 7.76 7.42 7.6 7.02 7.5 6.6 7.5 4.06 7.5 2 9.56 2 12.1c0 2.45 1.93 4.45 4.34 4.58.26.02.53.02.8.02h12.36c2.49 0 4.5-2.01 4.5-4.5 0-2.31-1.74-4.22-3.98-4.47-.08-.12-.16-.24-.24-.35z",
  zapier: "M20.25 10.5h-5.625L18 5.625l-2.625-1.5-3.375 5.25L8.625 4.125 6 5.625l3.375 4.875H3.75V13.5h5.625L6 18.375l2.625 1.5 3.375-5.25 3.375 5.25 2.625-1.5-3.375-4.875h5.625V10.5z",
  css3: "M4.192 3.143h15.615l-1.42 15.908-6.387 1.806-6.386-1.806zm13.111 3.51H6.697l.278 3.12h9.458l-.348 3.904-4.086 1.134-4.086-1.134-.176-1.95H5.161l.348 4.316 6.491 1.8 6.491-1.8z",
  lighthouse: "M12 2L8.5 7h7L12 2zm-4 7l-2 13h12l-2-13H8zm2 2h4l.3 2h-4.6l.3-2zm-.6 4h5.2l.3 2H9.1l.3-2z",
  websockets: "M16 3l5 5-5 5V9H8v4H5V7a2 2 0 0 1 2-2h9V3zm-8 18l-5-5 5-5v4h8v-4h3v6a2 2 0 0 1-2 2H8v2z",
  gsap: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  chart: "M3 3v18h18v-2H5V3H3zm4 14h2v-6H7v6zm4 0h2V9h-2v8zm4 0h2V5h-2v12z"
};

// Official brand colors & icons for all technologies
function getToolBrandMeta(toolName, isDark) {
  const norm = toolName.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (norm.includes('reactnative')) {
    return {
      color: isDark ? '#61DAFB' : '#087EA4',
      bg: isDark ? 'rgba(97, 218, 251, 0.12)' : 'rgba(8, 126, 164, 0.08)',
      icon: TECH_ICONS.react,
    };
  }
  if (norm.includes('react')) {
    return {
      color: isDark ? '#00D8FE' : '#087EA4',
      bg: isDark ? 'rgba(0, 216, 254, 0.12)' : 'rgba(8, 126, 164, 0.08)',
      icon: TECH_ICONS.react,
    };
  }
  if (norm.includes('typescript')) {
    return {
      color: isDark ? '#38BDF8' : '#3178C6',
      bg: isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(49, 120, 198, 0.08)',
      icon: TECH_ICONS.typescript,
    };
  }
  if (norm.includes('next') && norm.includes('vite')) {
    return {
      color: isDark ? '#BD34FE' : '#646CFF',
      bg: isDark ? 'rgba(189, 52, 254, 0.14)' : 'rgba(100, 108, 255, 0.08)',
      icon: TECH_ICONS.vite,
    };
  }
  if (norm.includes('next')) {
    return {
      color: isDark ? '#FFFFFF' : '#000000',
      bg: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
      icon: TECH_ICONS.nextjs,
    };
  }
  if (norm.includes('vite')) {
    return {
      color: '#646CFF',
      bg: isDark ? 'rgba(100, 108, 255, 0.14)' : 'rgba(100, 108, 255, 0.08)',
      icon: TECH_ICONS.vite,
    };
  }
  if (norm.includes('flutter')) {
    return {
      color: isDark ? '#54C5F8' : '#02569B',
      bg: isDark ? 'rgba(84, 197, 248, 0.12)' : 'rgba(2, 86, 155, 0.08)',
      icon: TECH_ICONS.flutter,
    };
  }
  if (norm.includes('node')) {
    return {
      color: isDark ? '#68A063' : '#43853D',
      bg: isDark ? 'rgba(104, 160, 99, 0.14)' : 'rgba(67, 133, 61, 0.08)',
      icon: TECH_ICONS.nodejs,
    };
  }
  if (norm.includes('fastapi')) {
    return {
      color: isDark ? '#009688' : '#059669',
      bg: isDark ? 'rgba(0, 150, 136, 0.14)' : 'rgba(5, 150, 105, 0.08)',
      icon: TECH_ICONS.fastapi,
    };
  }
  if (norm.includes('postgre') || norm.includes('sql')) {
    return {
      color: isDark ? '#4169E1' : '#336791',
      bg: isDark ? 'rgba(65, 105, 225, 0.14)' : 'rgba(51, 103, 145, 0.08)',
      icon: TECH_ICONS.postgresql,
    };
  }
  if (norm.includes('tailwind')) {
    return {
      color: isDark ? '#38BDF8' : '#06B6D4',
      bg: isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(6, 182, 212, 0.08)',
      icon: TECH_ICONS.tailwindcss,
    };
  }
  if (norm.includes('stripe')) {
    return {
      color: isDark ? '#7A73FF' : '#635BFF',
      bg: isDark ? 'rgba(122, 115, 255, 0.14)' : 'rgba(99, 91, 255, 0.08)',
      icon: TECH_ICONS.stripe,
    };
  }
  if (norm.includes('python')) {
    return {
      color: isDark ? '#4B8BBE' : '#306998',
      bg: isDark ? 'rgba(75, 139, 190, 0.14)' : 'rgba(48, 105, 152, 0.08)',
      icon: TECH_ICONS.python,
    };
  }
  if (norm.includes('langchain')) {
    return {
      color: isDark ? '#10B981' : '#047857',
      bg: isDark ? 'rgba(16, 185, 129, 0.14)' : 'rgba(4, 120, 87, 0.08)',
      icon: TECH_ICONS.langchain,
    };
  }
  if (norm.includes('llama')) {
    return {
      color: isDark ? '#A855F7' : '#7C3AED',
      bg: isDark ? 'rgba(168, 85, 247, 0.14)' : 'rgba(124, 58, 237, 0.08)',
      icon: null,
    };
  }
  if (norm.includes('chroma')) {
    return {
      color: isDark ? '#FF6B4A' : '#E64A19',
      bg: isDark ? 'rgba(255, 107, 74, 0.14)' : 'rgba(230, 74, 25, 0.08)',
      icon: null,
    };
  }
  if (norm.includes('pinecone')) {
    return {
      color: isDark ? '#22C55E' : '#15803D',
      bg: isDark ? 'rgba(34, 197, 94, 0.14)' : 'rgba(21, 128, 61, 0.08)',
      icon: null,
    };
  }
  if (norm.includes('openai') || norm.includes('claude')) {
    return {
      color: isDark ? '#10A37F' : '#0D8C6C',
      bg: isDark ? 'rgba(163, 163, 127, 0.14)' : 'rgba(13, 140, 108, 0.08)',
      icon: TECH_ICONS.openai,
    };
  }
  if (norm.includes('razorpay')) {
    return {
      color: isDark ? '#3395FF' : '#0066FF',
      bg: isDark ? 'rgba(51, 149, 255, 0.14)' : 'rgba(0, 102, 255, 0.08)',
      icon: TECH_ICONS.razorpay,
    };
  }
  if (norm.includes('cloudinary')) {
    return {
      color: isDark ? '#4353FF' : '#3448C5',
      bg: isDark ? 'rgba(67, 83, 255, 0.14)' : 'rgba(52, 72, 197, 0.08)',
      icon: TECH_ICONS.cloudinary,
    };
  }
  if (norm.includes('make') || norm.includes('zapier')) {
    return {
      color: isDark ? '#FF4A00' : '#E03E00',
      bg: isDark ? 'rgba(255, 74, 0, 0.14)' : 'rgba(224, 62, 0, 0.08)',
      icon: TECH_ICONS.zapier,
    };
  }
  if (norm.includes('webhook')) {
    return {
      color: isDark ? '#818CF8' : '#6366F1',
      bg: isDark ? 'rgba(129, 140, 248, 0.14)' : 'rgba(99, 102, 241, 0.08)',
      icon: null,
    };
  }
  if (norm.includes('redis')) {
    return {
      color: isDark ? '#FF4438' : '#DC382D',
      bg: isDark ? 'rgba(255, 68, 56, 0.14)' : 'rgba(220, 56, 45, 0.08)',
      icon: TECH_ICONS.redis,
    };
  }
  if (norm.includes('gsap') || norm.includes('scrolltrigger')) {
    return {
      color: isDark ? '#88CE02' : '#659B01',
      bg: isDark ? 'rgba(136, 206, 2, 0.14)' : 'rgba(101, 155, 1, 0.08)',
      icon: TECH_ICONS.gsap,
    };
  }
  if (norm.includes('lenis')) {
    return {
      color: isDark ? '#2DD4BF' : '#0D9488',
      bg: isDark ? 'rgba(45, 212, 191, 0.14)' : 'rgba(13, 148, 136, 0.08)',
      icon: null,
    };
  }
  if (norm.includes('vanillacss') || norm.includes('css3')) {
    return {
      color: isDark ? '#38BDF8' : '#264DE4',
      bg: isDark ? 'rgba(56, 189, 248, 0.14)' : 'rgba(38, 77, 228, 0.08)',
      icon: TECH_ICONS.css3,
    };
  }
  if (norm.includes('figma')) {
    return {
      color: isDark ? '#FF7262' : '#F24E1E',
      bg: isDark ? 'rgba(255, 114, 98, 0.14)' : 'rgba(242, 78, 30, 0.08)',
      icon: TECH_ICONS.figma,
    };
  }
  if (norm.includes('lighthouse')) {
    return {
      color: isDark ? '#FF5E57' : '#EA580C',
      bg: isDark ? 'rgba(255, 94, 87, 0.14)' : 'rgba(234, 88, 12, 0.08)',
      icon: TECH_ICONS.lighthouse,
    };
  }
  if (norm.includes('recharts') || norm.includes('chart')) {
    return {
      color: isDark ? '#22D3EE' : '#0891B2',
      bg: isDark ? 'rgba(34, 211, 238, 0.14)' : 'rgba(8, 145, 178, 0.08)',
      icon: TECH_ICONS.chart,
    };
  }
  if (norm.includes('websocket')) {
    return {
      color: isDark ? '#FBBF24' : '#D97706',
      bg: isDark ? 'rgba(251, 191, 36, 0.14)' : 'rgba(217, 119, 6, 0.08)',
      icon: TECH_ICONS.websockets,
    };
  }
  if (norm.includes('graphql')) {
    return {
      color: isDark ? '#F472B6' : '#E10098',
      bg: isDark ? 'rgba(244, 114, 182, 0.14)' : 'rgba(225, 0, 152, 0.08)',
      icon: TECH_ICONS.graphql,
    };
  }
  if (norm.includes('supabase')) {
    return {
      color: isDark ? '#3ECF8E' : '#10B981',
      bg: isDark ? 'rgba(62, 207, 142, 0.14)' : 'rgba(16, 185, 129, 0.08)',
      icon: TECH_ICONS.supabase,
    };
  }

  // Fallback
  return {
    color: isDark ? '#94A3B8' : '#64748B',
    bg: isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(100, 116, 139, 0.08)',
    icon: null,
  };
}

// Editorial highlighted overview statements matching the home page 2nd section aesthetic
const OVERVIEW_STATEMENTS = {
  'web-development': (
    <>
      &ldquo;I engineer <span className="service-accent-tag accent-resilient">high-performance web applications</span> and cross-platform mobile apps with <span className="service-accent-tag accent-ai">fluid user journeys</span>, <span className="service-accent-tag accent-utility">secure cloud architecture</span>, and <span className="service-accent-tag accent-lime">sub-second responsiveness</span>.&rdquo;
    </>
  ),
  'web-app-development': (
    <>
      &ldquo;I engineer <span className="service-accent-tag accent-resilient">high-performance web applications</span> and cross-platform mobile apps with <span className="service-accent-tag accent-ai">fluid user journeys</span>, <span className="service-accent-tag accent-utility">secure cloud architecture</span>, and <span className="service-accent-tag accent-lime">sub-second responsiveness</span>.&rdquo;
    </>
  ),
  'ai-rag-applications': (
    <>
      &ldquo;Transform proprietary documents into <span className="service-accent-tag accent-resilient">lightning-fast, production-grade AI systems</span> with <span className="service-accent-tag accent-ai">semantic vector search</span> and verified <span className="service-accent-tag accent-utility">zero-hallucination accuracy</span>.&rdquo;
    </>
  ),
  'ecommerce-development': (
    <>
      &ldquo;I build <span className="service-accent-tag accent-resilient">lightning-fast storefronts</span> with <span className="service-accent-tag accent-ai">friction-free checkouts</span>, <span className="service-accent-tag accent-utility">dynamic inventory syncing</span>, and automated funnels designed to <span className="service-accent-tag accent-lime">maximize conversion</span>.&rdquo;
    </>
  ),
  'ai-automation-integrations': (
    <>
      &ldquo;Automate repetitive operational workflows with <span className="service-accent-tag accent-resilient">intelligent pipelines</span> that connect your <span className="service-accent-tag accent-ai">CRMs, documents, and business tools 24/7</span> with <span className="service-accent-tag accent-utility">zero human error</span>.&rdquo;
    </>
  ),
  'landing-pages': (
    <>
      &ldquo;Art-directed editorial landing pages engineered with <span className="service-accent-tag accent-resilient">fluid motion physics</span> and <span className="service-accent-tag accent-ai">top-tier performance</span> to captivate visitors and <span className="service-accent-tag accent-utility">convert them into clients</span>.&rdquo;
    </>
  ),
  'business-dashboards': (
    <>
      &ldquo;Turn complex company data into <span className="service-accent-tag accent-resilient">clear, real-time executive dashboards</span> with <span className="service-accent-tag accent-ai">live telemetry</span>, <span className="service-accent-tag accent-utility">interactive charts</span>, and <span className="service-accent-tag accent-lime">actionable operational metrics</span>.&rdquo;
    </>
  ),
};

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { theme, toggleTheme, isDark } = useTheme();

  const mainRef = useRef(null);
  const topBarRef = useRef(null);
  const headerRef = useRef(null);
  const overviewRef = useRef(null);
  const buildRef = useRef(null);
  const processRef = useRef(null);
  const techRef = useRef(null);
  const ctaRef = useRef(null);
  const otherRef = useRef(null);

  const service = getServiceBySlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);

    const isTouch =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768);

    let lenis = null;
    let updateLenis = null;

    if (!isTouch) {
      // 1. Desktop-only Lenis for smooth mouse wheel inertia
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 0,
        infinite: false,
      });

      window.lenis = lenis;

      lenis.on('scroll', ScrollTrigger.update);
      updateLenis = (time) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(500, 33);
    }

    // 2. GSAP Animations in clean context
    const ctx = gsap.context(() => {
      // --- ENTRANCE ANIMATION TIMELINE ---
      const entranceTl = gsap.timeline({
        defaults: { ease: 'power3.out' }
      });

      // Top Bar: Back link slides in from left with arrow spring
      const backLink = topBarRef.current?.querySelector('.service-detail-back-link');
      const backArrow = topBarRef.current?.querySelector('.back-icon');
      if (backLink) {
        entranceTl.fromTo(
          backLink,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      }
      if (backArrow) {
        entranceTl.fromTo(
          backArrow,
          { scale: 0.6, x: -10, opacity: 0 },
          { scale: 1, x: 0, opacity: 1, duration: 0.45, ease: 'back.out(2)', clearProps: 'transform,opacity' },
          '-=0.45'
        );
      }

      // Top Bar Kicker
      const kickerBadge = topBarRef.current?.querySelector('.service-kicker-badge');
      if (kickerBadge) {
        entranceTl.fromTo(
          kickerBadge,
          { x: 30, opacity: 0, letterSpacing: '0.34em' },
          { x: 0, opacity: 1, letterSpacing: '0.22em', duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity,letterSpacing' },
          '-=0.45'
        );
      }

      // Kinetic Title Words Mask Reveal with de-blur and tilt
      const titleWords = headerRef.current?.querySelectorAll('.service-title-word-inner');
      if (titleWords && titleWords.length > 0) {
        entranceTl.fromTo(
          titleWords,
          {
            yPercent: 110,
            opacity: 0,
            rotate: 2,
            skewY: 1,
            filter: 'blur(6px)',
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            skewY: 0,
            filter: 'blur(0px)',
            duration: 0.65,
            stagger: 0.025,
            ease: 'power4.out',
            clearProps: 'transform,filter,opacity',
          },
          '-=0.35'
        );
      }

      // Hero Subtitle wipes in from right
      const subtitle = headerRef.current?.querySelector('.service-hero-subtitle');
      if (subtitle) {
        entranceTl.fromTo(
          subtitle,
          { x: 25, opacity: 0, filter: 'blur(3px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out', clearProps: 'transform,filter,opacity' },
          '-=0.45'
        );
      }

      // --- SCROLL-TRIGGERED SECTION REVEALS ---

      // 1. Overview Section: Animate entire paragraph and kicker together when opened/viewed
      if (overviewRef.current) {
        const kicker = overviewRef.current.querySelector('.service-section-kicker');
        const statement = overviewRef.current.querySelector('.service-overview-statement');
        const outcomesGrid = overviewRef.current.querySelector('.service-outcomes-grid');
        const outcomeBoxes = overviewRef.current.querySelectorAll('.service-outcome-box');

        // Kicker pops in promptly
        if (kicker) {
          gsap.fromTo(
            kicker,
            { opacity: 0, y: 14, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.8)',
              scrollTrigger: {
                trigger: kicker,
                start: 'top 88%',
                once: true,
              },
            }
          );
        }

        // Entire Paragraph: Smooth upward reveal when opened/viewed
        if (statement) {
          gsap.fromTo(
            statement,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: statement,
                start: 'top 95%',
                once: true,
              },
            }
          );
        }

        // Outcome Cards: Staggered lift triggered promptly when grid enters active zone
        if (outcomesGrid && outcomeBoxes.length > 0) {
          gsap.fromTo(
            outcomeBoxes,
            { opacity: 0, y: 40, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.08,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: outcomesGrid,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }
      }

      // 2. What We Build (Deliverables) Section
      if (buildRef.current) {
        const heading = buildRef.current.querySelector('.service-section-heading');
        const kicker = buildRef.current.querySelector('.service-section-kicker');
        const deliverGrid = buildRef.current.querySelector('.service-deliverables-grid');
        const cards = buildRef.current.querySelectorAll('.service-deliverable-card');
        const checkPills = buildRef.current.querySelectorAll('.service-check-pill');

        if (kicker) {
          gsap.fromTo(
            kicker,
            { opacity: 0, y: 14, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.8)',
              scrollTrigger: {
                trigger: kicker,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }

        if (heading) {
          gsap.fromTo(
            heading,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: heading,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }

        if (deliverGrid && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              stagger: 0.045,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: deliverGrid,
                start: 'top 80%',
                once: true,
              },
            }
          );

          gsap.fromTo(
            checkPills,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              stagger: 0.045,
              ease: 'back.out(2.2)',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: deliverGrid,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      }

      // 3. How We Work (Process) Section
      if (processRef.current) {
        const kicker = processRef.current.querySelector('.service-section-kicker');
        const processGrid = processRef.current.querySelector('.service-process-grid');
        const cards = processRef.current.querySelectorAll('.service-process-card');
        const indexes = processRef.current.querySelectorAll('.service-process-idx');

        if (kicker) {
          gsap.fromTo(
            kicker,
            { opacity: 0, y: 14, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(1.8)',
              scrollTrigger: {
                trigger: kicker,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }

        if (processGrid && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 45, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.07,
              ease: 'power4.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: processGrid,
                start: 'top 80%',
                once: true,
              },
            }
          );

          if (indexes.length > 0) {
            gsap.fromTo(
              indexes,
              { x: -12, opacity: 0 },
              {
                x: 0,
                opacity: 0.7,
                duration: 0.35,
                stagger: 0.07,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: processGrid,
                  start: 'top 80%',
                  once: true,
                },
              }
            );
          }
        }
      }

      // 4. Technology & Products Section
      if (techRef.current) {
        const leftCol = techRef.current.querySelector('.service-tech-left');
        const pillsContainer = techRef.current.querySelector('.service-tech-pills');
        const pills = techRef.current.querySelectorAll('.service-tool-pill');

        if (leftCol) {
          gsap.fromTo(
            leftCol.children,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: leftCol,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }

        if (pillsContainer && pills.length > 0) {
          gsap.fromTo(
            pills,
            { opacity: 0, scale: 0.7, y: 16 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.02,
              ease: 'back.out(2)',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: pillsContainer,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      }

      // 5. Next Step (CTA Callout Box)
      if (ctaRef.current) {
        const ctaBox = ctaRef.current;
        const ctaHeadline = ctaBox.querySelector('.service-cta-headline');
        const ctaBtn = ctaBox.querySelector('.service-cta-btn');

        gsap.fromTo(
          ctaBox,
          { opacity: 0, y: 45, scale: 0.94 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: ctaBox,
              start: 'top 80%',
              once: true,
            },
          }
        );

        if (ctaHeadline) {
          gsap.fromTo(
            ctaHeadline,
            { opacity: 0, y: 22 },
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power4.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: ctaBox,
                start: 'top 85%',
                once: true,
              },
            }
          );
        }

        if (ctaBtn) {
          gsap.fromTo(
            ctaBtn,
            { opacity: 0, scale: 0.85, y: 15 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.45,
              ease: 'back.out(2)',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: ctaBox,
                start: 'top 80%',
                once: true,
              },
            }
          );
        }
      }

      // 6. Other Services Section
      if (otherRef.current) {
        const otherGrid = otherRef.current.querySelector('.other-services-grid');
        const cards = otherRef.current.querySelectorAll('.other-service-card-link');

        if (otherGrid && cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 35, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.55,
              stagger: 0.06,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              scrollTrigger: {
                trigger: otherGrid,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }
      }

      // Refresh ScrollTrigger after entrance animations
      entranceTl.eventCallback('onComplete', () => {
        ScrollTrigger.refresh();
      });
    }, mainRef);

    let lastWidth = window.innerWidth;
    const handleResize = () => {
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        ScrollTrigger.refresh();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (updateLenis) gsap.ticker.remove(updateLenis);
      if (lenis) {
        lenis.destroy();
        window.lenis = null;
      }
      ctx.revert();
    };
  }, [slug, service]);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const currentIndex = SERVICES_DATA.findIndex(
    (s) => s.slug === service.slug || (s.aliases && s.aliases.includes(service.slug))
  );
  const totalCount = String(SERVICES_DATA.length).padStart(2, '0');
  const serviceIndexStr = String((currentIndex >= 0 ? currentIndex : 0) + 1).padStart(2, '0');

  // Other services for bottom quick switcher
  const otherServices = SERVICES_DATA.filter(
    (s) => s.slug !== service.slug && (!s.aliases || !s.aliases.includes(service.slug))
  );

  const serviceSchema = service ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `https://dhanu.me/services/${service.slug}#service`,
        "name": service.title,
        "description": service.description,
        "provider": {
          "@type": "Person",
          "@id": "https://dhanu.me/#person",
          "name": "Dhanush",
          "url": "https://dhanu.me/"
        },
        "url": `https://dhanu.me/services/${service.slug}`,
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Deliverables",
          "itemListElement": service.deliverables ? service.deliverables.map((item) => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": item
            }
          })) : []
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://dhanu.me/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Services",
            "item": "https://dhanu.me/services"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": service.title,
            "item": `https://dhanu.me/services/${service.slug}`
          }
        ]
      }
    ]
  } : null;

  return (
    <div className={`service-detail-page ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <SEO
        title={`${service.title} — Dhanush`}
        description={service.subtitle || service.description}
        canonical={`https://dhanu.me/services/${service.slug}`}
        schema={serviceSchema}
      />
      <CustomCursor />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      {/* Architectural Background Grid Overlay & Content Guidelines */}
      <div className="service-detail-grid-overlay" aria-hidden="true">
        <div className="service-detail-grid-pattern" />
        <div className="service-detail-grid-v-line v-line-left" />
        <div className="service-detail-grid-v-line v-line-right" />
      </div>

      {/* Atmospheric Top Blend Overlay */}
      <div className="service-detail-top-blend" aria-hidden="true" />

      <main className="service-detail-main" ref={mainRef}>
        {/* Top Back Navigation & Header Row (Side by side on mobile) */}
        <div className="service-detail-top-bar" ref={topBarRef}>
          <Link
            to="/services"
            className="service-detail-back-link"
            aria-label="Back to all services"
          >
            <ArrowLeft className="back-icon" />
            <span>Back to services</span>
          </Link>
          <span className="service-kicker-badge">
            <span className="service-kicker-dot" aria-hidden="true">•</span>
            SERVICE / {serviceIndexStr} — {totalCount}
          </span>
        </div>

        {/* 1. Header / Hero Section (12-Col Desktop, Stacked Mobile) */}
        <header className="service-detail-header" ref={headerRef}>
          <div className="service-detail-header-left">
            <h1 className="service-hero-title">
              {service.title.split(' ').map((word, i) => (
                <span key={i} className="service-title-word-mask">
                  <span className="service-title-word-inner">{word}&nbsp;</span>
                </span>
              ))}
            </h1>
          </div>
          <div className="service-detail-header-right">
            <p className="service-hero-subtitle">
              {service.subtitle}
            </p>
          </div>
        </header>

        {/* 2. Overview & Outcomes Section (12-Col Desktop, Stacked Mobile) */}
        <section className="service-overview-section" ref={overviewRef}>
          <div className="service-overview-left">
            <p className="service-section-kicker">
              <span className="service-kicker-dot" aria-hidden="true">•</span>
              OVERVIEW
            </p>
          </div>
          <div className="service-overview-right">
            <p className="service-overview-statement">
              {OVERVIEW_STATEMENTS[service.slug] || `\u201C${service.description}\u201D`}
            </p>

            {/* Outcomes 3-box Grid with chromatic accents */}
            {service.outcomes && service.outcomes.length > 0 && (
              <div className="service-outcomes-grid">
                {service.outcomes.map((outcome, idx) => (
                  <div key={idx} className={`service-outcome-box outcome-accent-${idx % 3}`}>
                    <span className="service-outcome-idx">0{idx + 1}</span>
                    <p className="service-outcome-text">{outcome}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. What I Build (Deliverables) Section (12-Col Desktop, Stacked Mobile) */}
        <section className="service-build-section" ref={buildRef}>
          <div className="service-build-left">
            <p className="service-section-kicker">
              <span className="service-kicker-dot" aria-hidden="true">•</span>
              WHAT I BUILD
            </p>
            <h2 className="service-section-heading">
              A clear, useful <span className="service-accent-tag accent-resilient">scope</span>.
            </h2>
          </div>
          <div className="service-build-right">
            <ul className="service-deliverables-grid">
              {service.deliverables.map((item, idx) => (
                <li key={idx} className={`service-deliverable-card deliverable-accent-${idx % 4}`}>
                  <span className="service-check-pill">
                    <Check className="service-check-icon" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4. How I Work (Process) Section (4 Inverted Contrast Cards with Chromatic Accents) */}
        <section className="service-process-section" ref={processRef}>
          <p className="service-section-kicker">
            <span className="service-kicker-dot" aria-hidden="true">•</span>
            HOW I WORK
          </p>
          <div className="service-process-grid">
            {service.process.map((step, idx) => (
              <article key={idx} className={`service-process-card process-accent-${idx % 4}`}>
                <span className="service-process-idx">0{idx + 1}</span>
                <p className="service-process-title">{step}</p>
              </article>
            ))}
          </div>
        </section>

        {/* 5. Technology & Products Section (12-Col Desktop, Stacked Mobile) */}
        <section className="service-tech-section" ref={techRef}>
          <div className="service-tech-left">
            <p className="service-section-kicker">
              <span className="service-kicker-dot" aria-hidden="true">•</span>
              TECHNOLOGY &amp; PRODUCTS
            </p>
            <h2 className="service-section-heading">
              Tools chosen for the <span className="service-accent-tag accent-ai">work</span>.
            </h2>
            <p className="service-tech-desc">
              I select the stack after discovery. These are technologies I regularly use—tailored directly to project requirements.
            </p>
          </div>
          <div className="service-tech-right">
            <div className="service-tech-pills">
              {service.tools.map((tool, idx) => {
                const brand = getToolBrandMeta(tool, isDark);
                return (
                  <span
                    key={idx}
                    className="service-tool-pill"
                    style={{
                      '--brand-color': brand.color,
                      '--brand-bg': brand.bg,
                    }}
                  >
                    {brand.icon ? (
                      <svg
                        className="service-tool-icon"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        style={{ fill: brand.color }}
                      >
                        <path d={brand.icon} />
                      </svg>
                    ) : (
                      <span
                        className="service-tool-dot"
                        style={{
                          backgroundColor: brand.color,
                        }}
                      />
                    )}
                    <span className="service-tool-name">{tool}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. Next Step (CTA Callout Box) (High Contrast Inverted Block) */}
        <section className="service-next-step-box" ref={ctaRef}>
          <div className="service-next-step-left">
            <p className="service-cta-kicker">
              <span className="service-kicker-dot" aria-hidden="true">•</span>
              NEXT STEP
            </p>
            <h2 className="service-cta-headline">
              Tell me what needs to <span className="service-accent-tag accent-resilient">change</span>.
            </h2>
            <p className="service-cta-subtext">
              I will review your requirements, recommend the right architecture and scope, and deliver high-impact results.
            </p>
          </div>
          <Link to="/contact" className="service-cta-btn">
            <span>Start a conversation</span>
            <ArrowUpRight className="cta-arrow-icon" strokeWidth={2.5} />
          </Link>
        </section>

        {/* 7. Other Services Quick-Switch Strip */}
        <section className="service-other-services" ref={otherRef}>
          <div className="other-services-header">
            <p className="service-section-kicker other-kicker">
              <span className="service-kicker-dot" aria-hidden="true">•</span>
              OTHER SERVICES
            </p>
            <Link to="/services" className="service-view-all-link">
              <span>View all</span>
              <ArrowUpRight className="view-all-arrow" size={14} />
            </Link>
          </div>
          <div className="other-services-grid">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                to={`/services/${other.slug}`}
                className="other-service-card-link"
                style={{
                  backgroundColor: other.color,
                }}
              >
                <div className="other-service-card-top">
                  <span className="other-service-num">{other.num} / {other.display}</span>
                  <ArrowUpRight className="other-service-arrow" />
                </div>
                <h3 className="other-service-title">{other.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

