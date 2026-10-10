#!/usr/bin/env node

/*
  Builds src/components/illustrations/peeps.generated.ts from Open Peeps
  (https://www.openpeeps.com, Pablo Stanley, CC0 1.0 — public domain).

  Usage: node scripts/build-illustrations.js

  Each peep is downloaded from the official site, optimised with svgo, and its
  two colours swapped for tokens the Illustration component fills from the
  theme: black ink -> {{ink}}, white -> {{paper}}. That is the whole reason the
  set was chosen — two flat colours theme cleanly into light and dark.

  To add one: browse openpeeps.com, copy the .svg url, add a line below, run
  this, and use the new name with <Illustration />.
*/

const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");

const CDN = "https://cdn.prod.website-files.com";

const MANIFEST = {
  onboardingResume: `${CDN}/5e51c674258ffe10d286d30a/5e536266c99250fe47cebfc0_peep-standing-18.svg`,
  onboardingTracker: `${CDN}/5e51c674258ffe10d286d30a/5e5363188becbffe8c57172c_peep-standing-24.svg`,
  onboardingLetters: `${CDN}/5e51c674258ffe10d286d30a/5e535e2ce35d38156a694f11_peep-sitting-2.svg`,
  onboardingInterview: `${CDN}/5e51c674258ffe10d286d30a/5e535f96c67e7961f5994532_peep-sitting-15.svg`,
  onboardingCapture: `${CDN}/5e51c674258ffe10d286d30a/5e53622ec67e7957fc9b32e0_peep-standing-16.svg`,
  emptyNotes: `${CDN}/5e51c674258ffe10d286d30a/5e532c65d871315ee7fcae9e_peep-sitting-1.svg`,
  emptyRecordings: `${CDN}/5e51c674258ffe10d286d30a/5e53624b9b55b0127f5851cf_peep-standing-17.svg`,
  emptyResumes: `${CDN}/5e51c674258ffe10d286d30a/5e5361ccd3992383f7595afc_peep-standing-13.svg`,
  emptyApplications: `${CDN}/5e51c674258ffe10d286d30a/5e5362e2f5fa1aefa7ffe47c_peep-standing-22.svg`,
  emptyLetters: `${CDN}/5e51c674258ffe10d286d30a/5e536006c67e7976719986dc_peep-sitting-18.svg`,
  emptyNotifications: `${CDN}/5e51c674258ffe10d286d30a/5e535f438becbf2fab5619bb_peep-sitting-12.svg`,
  emptyCareerProfile: `${CDN}/5e51c674258ffe10d286d30a/5e53613f9b55b0a5a457c452_peep-standing-10.svg`,
  searchStart: `${CDN}/5e51c674258ffe10d286d30a/5e5362fa8becbf1d50570b23_peep-standing-23.svg`,
  noResults: `${CDN}/5e51c674258ffe10d286d30a/5e532a4c258ffe237b8ef2c1_peep-2.svg`,
  offline: `${CDN}/5e51c674258ffe10d286d30a/5e535e9fc992502f35cd7902_peep-sitting-6.svg`,
  error: `${CDN}/5e51c674258ffe10d286d30a/5e5359ee8becbf772f53c5d4_peep-71.svg`,
  setupProfile: `${CDN}/5e51c674258ffe10d286d30a/5e5361e9f3aa4be48230418f_peep-standing-14.svg`,
  setupNotifications: `${CDN}/5e51c674258ffe10d286d30a/5e535ef19b55b0b01256c383_peep-sitting-9.svg`,
  setupDone: `${CDN}/5e51c674258ffe10d286d30a/5e535f0d9b55b01d2056cf00_peep-sitting-10.svg`,
  paywall: `${CDN}/5e51b3b0337309d672efd94c/5e51c36e16879c45e6c0fb6f_sit-stand-walk.svg`,
  proActive: `${CDN}/5e51c674258ffe10d286d30a/5e5361abc992503993ce737e_peep-standing-12.svg`,
  practiceDone: `${CDN}/5e51c674258ffe10d286d30a/5e535f2ad39923f7d558435b_peep-sitting-11.svg`,
};

// Run from the repo root, like scripts/reset-project.js.
const OUTPUT = path.join(process.cwd(), "src", "components", "illustrations", "peeps.generated.ts");

// Downloaded markup is untrusted. These never appear in a peep, so their
// presence means the file is not what it claims to be.
const FORBIDDEN = [/<script/i, /\son[a-z]+\s*=/i, /<foreignObject/i, /(?:xlink:)?href\s*=\s*["'](?!#)/i];

const tokenize = function (name, svg) {
  for (const pattern of FORBIDDEN) {
    if (pattern.test(svg)) throw new Error(`${name}: refusing markup matching ${pattern}`);
  }

  /*
    A mask's white is not a colour: masks work by luminance, white meaning
    "show". Themed to {{paper}}, it went near-black in dark mode and hid the
    body it was masking (peep-sitting-11). Mask fills are held aside and left
    white in both themes.
  */
  const themed = svg
    .replace(/(<mask\b[^>]*\s)fill="#(?:fff|ffffff|white)"/gi, '$1fill="{{mask}}"')
    .replace(/fill="#(?:000|000000|black)"/gi, 'fill="{{ink}}"')
    .replace(/fill="#(?:fff|ffffff|white)"/gi, 'fill="{{paper}}"');

  const leftovers = [...new Set(themed.match(/(?:fill|stroke)="(?!none|\{\{)[^"]+"/g) ?? [])];
  if (leftovers.length) throw new Error(`${name}: colours outside the ink/paper palette: ${leftovers.join(", ")}`);

  return themed.replaceAll("{{mask}}", "#FFF");
};

const build = async function () {
  const entries = [];

  for (const [name, url] of Object.entries(MANIFEST)) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${name}: ${url} responded ${response.status}`);

    const { data } = optimize(await response.text(), {
      multipass: true,
      // One decimal place: indistinguishable at phone sizes, a quarter of the
      // original weight. Whole numbers visibly roughened faces.
      floatPrecision: 1,
      // svgo 4 keeps viewBox by default; 3.x crashed in convertPathData on
      // peep-standing-17, which 4 handles.
      plugins: [
        "preset-default",
        "removeDimensions",
        "removeTitle",
        "removeDesc",
      ],
    });

    entries.push([name, tokenize(name, data)]);
    console.log(`${name.padEnd(22)} ${(data.length / 1024).toFixed(1)} KB`);
  }

  const body = entries.map(([name, svg]) => `  ${name}: ${JSON.stringify(svg)},`).join("\n");
  const source = `// Generated by scripts/build-illustrations.js — do not edit by hand.
// Open Peeps by Pablo Stanley (openpeeps.com), CC0 1.0.

export const PEEPS = {
${body}
} as const;

export type PeepName = keyof typeof PEEPS;
`;

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, source);
  console.log(`\nwrote ${path.relative(process.cwd(), OUTPUT)} (${(source.length / 1024).toFixed(0)} KB, ${entries.length} illustrations)`);
};

build().catch(error => {
  console.error(error.message);
  process.exit(1);
});
