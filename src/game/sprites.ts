import Phaser from "phaser";
import { sheetTexture, stampTexture, canvasTexture, type Palette } from "./pixel";
import { TILE } from "./constants";
import { buildFont } from "./font";

const DAD: Palette = {
  H: "#2a221c",
  h: "#3d3328",
  S: "#e8b896",
  s: "#d49a78",
  B: "#9a9a96",
  b: "#7e7e7a",
  E: "#1a1410",
  W: "#f4f4f0",
  J: "#24344f",
  j: "#1a2740",
  P: "#4a6d92",
  p: "#3a5878",
  O: "#3a2a1c",
  o: "#2a1c12",
  N: "#c47868",
};

const BOY: Palette = {
  H: "#6b3d22",
  h: "#5a3018",
  S: "#f0c4a0",
  s: "#e0a880",
  E: "#1a1410",
  G: "#6d7380",
  g: "#545a68",
  K: "#4a5060",
  W: "#ece8e0",
  P: "#3a3a48",
  O: "#2a2a2a",
  N: "#c47868",
};

const dadIdle = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHSSHHH....",
  "....HSSSSSSH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HBBBBBSH....",
  ".....BBBBBB.....",
  ".....bBBBBb.....",
  ".....JJWWJJ.....",
  "....JJJWWJJJ....",
  "...JJJJWWJJJJ...",
  "...JJJJWWJJJJ...",
  "...J.JJWWJJ.J...",
  "...J.JWWWWJ.J...",
  "....JJWWWWJJ....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  ".....PP..PP.....",
  ".....Pp..Pp.....",
  ".....PP..PP.....",
  ".....OO..OO.....",
  ".....Oo..Oo.....",
  "................",
];

const dadBlink = dadIdle.map((r, i) => (i === 4 ? "....HS----SH...." : r)).map((r) => r.replace(/-/g, "S"));
dadBlink[4] = "....HSssssSH....";

const dadWalkA = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHSSHHH....",
  "....HSSSSSSH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HBBBBBSH....",
  ".....BBBBBB.....",
  ".....bBBBBb.....",
  ".....JJWWJJ.....",
  "....JJJWWJJJ....",
  "...JJJJWWJJJJ...",
  "..J.JJJWWJJJ.J..",
  "..J..JWWWWJ..J..",
  "....JJWWWWJJ....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  "....PP....PP....",
  "...PP......PP...",
  "...PP......PP...",
  "..OO........OO..",
  "..Oo........Oo..",
  "................",
  "................",
];

const dadWalkB = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHSSHHH....",
  "....HSSSSSSH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HBBBBBSH....",
  ".....BBBBBB.....",
  ".....bBBBBb.....",
  ".....JJWWJJ.....",
  "....JJJWWJJJ....",
  "...JJJJWWJJJJ...",
  "...JJJJWWJJJJ...",
  "....JJWWWWJJ....",
  "....JJWWWWJJ....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  "......PPPP......",
  "......PPPP......",
  "......P..P......",
  ".....OO..OO.....",
  ".....Oo..Oo.....",
  "................",
  "................",
];

const dadJump = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHSSHHH....",
  "....HSSSSSSH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HBBBBBSH....",
  ".....BBBBBB.....",
  ".....bBBBBb.....",
  "....JJJWWJJJ....",
  "...JJJJWWJJJJ...",
  "..J.JJJWWJJJ.J..",
  "..J.JJWWWWJJ.J..",
  "....JJWWWWJJ....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  "....PP....PP....",
  "...PP......PP...",
  "...OO......OO...",
  "...Oo......Oo...",
  "................",
  "................",
  "................",
  "................",
];

const dadThrow = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHSSHHH....",
  "....HSSSSSSH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HBBBBBSH....",
  ".....BBBBBB.....",
  ".....bBBBBb.....",
  ".....JJWWJJ.....",
  "....JJJWWJJJ....",
  "...JJJJWWJJJJJ..",
  "...JJJJWWJJ..J..",
  "...J.JWWWW...J..",
  "....JJWWWW......",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  ".....PP..PP.....",
  ".....Pp..Pp.....",
  ".....PP..PP.....",
  ".....OO..OO.....",
  ".....Oo..Oo.....",
  "................",
  "................",
];

const boyIdle = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHHHHHH....",
  "....HHSSSSHH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HSSSSSSH....",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GGGGGGGGGG...",
  "...GGGKKKKGGG...",
  "...GGGGGGGGGG...",
  "...G.GGGGGG.G...",
  "....GGGGGGGG....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  ".....PP..PP.....",
  ".....PP..PP.....",
  ".....OO..OO.....",
  ".....OO..OO.....",
  "................",
  "................",
  "................",
  "................",
];

const boyBlink = [...boyIdle];
boyBlink[4] = "....HSssssSH....";

const boyWalkA = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHHHHHH....",
  "....HHSSSSHH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HSSSSSSH....",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GGGGGGGGGG...",
  "...GGGKKKKGGG...",
  "..G.GGGGGGGG.G..",
  "..G.GGGGGGGG.G..",
  "....GGGGGGGG....",
  ".....PPPPPP.....",
  "....PP....PP....",
  "...PP......PP...",
  "...PP......PP...",
  "..OO........OO..",
  "..OO........OO..",
  "................",
  "................",
  "................",
  "................",
];

const boyWalkB = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHHHHHH....",
  "....HHSSSSHH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HSSSSSSH....",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GGGGGGGGGG...",
  "...GGGKKKKGGG...",
  "...GGGGGGGGGG...",
  "....GGGGGGGG....",
  "....GGGGGGGG....",
  ".....PPPPPP.....",
  "......PPPP......",
  "......PPPP......",
  "......P..P......",
  ".....OO..OO.....",
  ".....OO..OO.....",
  "................",
  "................",
  "................",
  "................",
];

const boyJump = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHHHHHH....",
  "....HHSSSSHH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HSSSSSSH....",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GGGGGGGGGG...",
  "..G.GGGKKKGG.G..",
  "..G.GGGGGGGG.G..",
  "....GGGGGGGG....",
  ".....PPPPPP.....",
  "....PP....PP....",
  "...PP......PP...",
  "...OO......OO...",
  "...OO......OO...",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
];

const boyThrow = [
  ".....HHHHHH.....",
  "....HHHHHHHH....",
  "....HHHHHHHH....",
  "....HHSSSSHH....",
  "....HSEESSSH....",
  "....HSSSSSSH....",
  "....HSSSSSSH....",
  ".....GGGGGG.....",
  "....GGGGGGGG....",
  "...GGGGGGGGGGG..",
  "...GGGKKKKG..G..",
  "...GGGGGGG...G..",
  "...G.GGGGG......",
  "....GGGGGGGG....",
  ".....PPPPPP.....",
  ".....PPPPPP.....",
  ".....PP..PP.....",
  ".....PP..PP.....",
  ".....OO..OO.....",
  ".....OO..OO.....",
  "................",
  "................",
  "................",
  "................",
];

const mushPal: Palette = {
  R: "#e85a4a",
  r: "#c43c38",
  W: "#fff6de",
  C: "#f5e6c8",
  E: "#2a1810",
  S: "#f0c8a0",
  D: "#d09070",
};

const mushA = [
  "..rrRRRRrr..",
  ".rRRWWRRRRr.",
  "rRRRRRRRRRRr",
  "rRRWWRRRRWWr",
  ".rRRRRRRRRr.",
  "..CCCCCCCC..",
  "..CE....EC..",
  "..C.DDDD.C..",
  "...CCCCCC...",
  "...C....C...",
  "...C....C...",
  "....D..D....",
];
const mushB = [
  "...rRRRRr...",
  "..rRWWWRRr..",
  ".rRRRRRRRRr.",
  "rRRWWWRRWWRr",
  "rRRRRRRRRRRr",
  ".CCCCCCCCCC.",
  "..CE....EC..",
  "..C.DDDD.C..",
  "...CCCCCC...",
  "..CC....CC..",
  "..C......C..",
  "...D....D...",
];

const hedgPal: Palette = {
  N: "#6b4428",
  n: "#4a2e18",
  S: "#f5d0a8",
  E: "#201410",
  N2: "#c07848",
  P: "#e8a060",
  W: "#fff8e8",
};
hedgPal["K"] = "#c07848";

const hedgA = [
  "....nnnnn.....",
  "..nnNNNNnnn...",
  ".nNNNnNNNNnn..",
  "nNNNNSSSSNnn.",
  "nNNNSWEWSSNn.",
  "nNNNSSKSSSNn.",
  ".nNNSSSSSSNn.",
  "..nnSSSSSnn...",
  "...nP..Pn.....",
  "....P..P......",
  "..............",
  "..............",
];
const hedgB = [
  ".....nnnn.....",
  "...nnNNNNnn...",
  "..nNNNnNNNNn..",
  ".nNNNSSSSSNn.",
  ".nNNSWEWSSNn.",
  ".nNNSSKSSSNn.",
  "..nNSSSSSSn...",
  "...nSSSSSn....",
  "....PPPP......",
  "...P....P.....",
  "..............",
  "..............",
];

const snailPal: Palette = {
  G: "#6dbf6a",
  g: "#3d8a48",
  L: "#b6e07a",
  S: "#f2c8a0",
  E: "#201410",
  Y: "#fff0a0",
  P: "#e09090",
};

const snailA = [
  "..............",
  "......ggGG....",
  "....ggLLgGGg..",
  "...gGLLLLgGGg.",
  "...gGLgGGgGGg.",
  "SE.gGGGGGGGGg.",
  "SE..SSSSSSSg..",
  ".S.SSSSSSS....",
  "..SS....SS....",
  "..............",
  "..............",
  "..............",
];
const snailB = [
  "..............",
  ".....ggGGg....",
  "...ggLLgGGGg..",
  "..gGLLLLgGGGg.",
  "..gGLgGGgGGGg.",
  "SE.gGGGGGGGGg.",
  "S...SSSSSSSg..",
  ".SSSSSSSSS....",
  "...S....S.....",
  "..............",
  "..............",
  "..............",
];

const blobPal: Palette = {
  P: "#7a9cff",
  p: "#4a6adf",
  L: "#c0d4ff",
  E: "#201430",
  W: "#fff8ff",
  M: "#f090b0",
};

const blobA = [
  "..............",
  "....ppPPPp....",
  "...pPPLLPPp...",
  "..pPWWLLWWPp..",
  "..pPEWLLWEPp..",
  "..pPPLMMLPPp..",
  "...pPPPPPPP...",
  "...ppPPPPPp...",
  "....pP..Pp....",
  "..............",
  "..............",
  "..............",
];
const blobB = [
  "..............",
  "..............",
  "...pppPPPpp...",
  "..pPPLLLLPPp..",
  ".pPWWLLLLWWPp.",
  ".pPEWLLLLWEPp.",
  ".pPPLMMMMLPPp.",
  "..pPPPPPPPPP..",
  "...pp....pp...",
  "..............",
  "..............",
  "..............",
];

const bossMushA = [
  "......yyyy......",
  ".....yYYYYy.....",
  "......yYYy......",
  "....rrRRRRrr....",
  "...rRRWWRRRRr...",
  "..rRRRRRRRRRRr..",
  ".rRRWWRRRRRWRr.",
  ".rRRRRRRRRRRRr.",
  "..rRRRRRRRRRr..",
  "...CCCCCCCCCC...",
  "...CE......EC...",
  "...C..MMMM..C...",
  "...CC.mmmm.CC...",
  "....CCCCCCCC....",
  "....CC....CC....",
  "....DD....DD....",
];
const bossMushB = [
  ".....yyyyyy.....",
  "....yYYYYYYy....",
  ".....yyYYyy.....",
  "...rrrRRRRrrr...",
  "..rRRWWWRRRRr..",
  ".rRRRRRRRRRRRr.",
  "rRRWWRRRRRRWRr.",
  "rRRRRRRRRRRRRr.",
  ".rRRRRRRRRRRr.",
  "..CCCCCCCCCCCC..",
  "..CE........EC..",
  "..C...MMMM...C..",
  "..CC..mmmm..CC..",
  "...CCCCCCCCCC...",
  "...CCC....CCC...",
  "....DD....DD....",
];

const bossHedgA = [
  "......ssss......",
  ".....sSSSSs.....",
  "....nnnnnnnn....",
  "...nNNNnnNNNn...",
  "..nNNNNSNNNNn..",
  ".nNNNSSSSSNNNn.",
  ".nNNSWEWESSNNn.",
  ".nNNSSKKKSSNNn.",
  "..nNNSSSSSNNn..",
  "...nnSSSSSSnn...",
  "....nP....Pn....",
  "....P......P....",
  "................",
  "................",
  "................",
  "................",
];
const bossHedgB = [
  ".....ssssss.....",
  "....sSSSSSSs....",
  "...nnnnnnnnnn...",
  "..nNNNNnnNNNNn..",
  ".nNNNNSSNNNNNn.",
  "nNNNSSSSSSSNNNn",
  "nNNNSWEWESSNNNn",
  "nNNNSSKKKSSNNNn",
  ".nNNNSSSSSSNNn.",
  "..nnnSSSSSSnn..",
  "....PPPPPPPP....",
  "...P........P...",
  "................",
  "................",
  "................",
  "................",
];

const bossCloudA = [
  "....wwWWWwww....",
  "...wWWWWWWWWw...",
  "..wWWWLLLWWWWw..",
  ".wWWWWLLLLWWWWw.",
  "wWWWWEWLLWEWWWWw",
  "wWWWWLLLLLLWWWWw",
  "wWWWLLMmmMLLWWWw",
  ".wWWWWWWWWWWWWw.",
  "..wwWWWWWWWWww..",
  "...w.ww..ww.w...",
  "....p......p....",
  "................",
  "................",
  "................",
  "................",
  "................",
];
const bossCloudB = [
  ".....wWWWww.....",
  "...wWWWWWWWWw...",
  "..wWWWWWWWWWWw..",
  ".wWWWLLLLLWWWWw.",
  "wWWWWELLLEWWWWw",
  "wWWWWLLLLLLWWWWw",
  ".wWWLMmmmmMLWWw.",
  "..wWWWWWWWWWWw..",
  "...wwWWWWWWww...",
  "....ww....ww....",
  ".....p....p.....",
  "................",
  "................",
  "................",
  "................",
  "................",
];

const bossMushPal: Palette = {
  y: "#f0d050",
  Y: "#ffe878",
  r: "#c43c38",
  R: "#e85a4a",
  W: "#fff6de",
  C: "#f5e6c8",
  E: "#2a1810",
  M: "#8a5040",
  m: "#6a3828",
  D: "#d09070",
};

const bossHedgPal: Palette = {
  s: "#c0c8d8",
  S: "#e8eef8",
  n: "#4a2e18",
  N: "#6b4428",
  E: "#201410",
  W: "#fff8e8",
  K: "#c07848",
  P: "#e8a060",
};

const bossCloudPal: Palette = {
  w: "#d0e8ff",
  W: "#ffffff",
  L: "#c8dcff",
  E: "#304070",
  M: "#f090b0",
  m: "#e07098",
  p: "#90b0ff",
};

const applePix = [
  "..g...",
  ".ggG..",
  ".RRRR.",
  "RRWRRR",
  "RRRRRR",
  "RRRRRr",
  ".RRRr.",
  "..rr..",
];
const applePal: Palette = { g: "#3d8a30", G: "#6dbf4a", R: "#e23a3a", r: "#b02028", W: "#ffd0d0" };

const heartPix = [
  ".rr.rr.",
  "rRRRRRr",
  "rRRWRRr",
  ".RRRRR.",
  "..RRR..",
  "...R...",
];
const heartEmpty = [
  ".ww.ww.",
  "w....w.",
  "w.....w",
  ".w...w.",
  "..w.w..",
  "...w...",
];
const heartPal: Palette = { r: "#a01830", R: "#ee3a4a", W: "#ffd0d8", w: "#f0a0b0" };

const grassTile = [
  "GGGGGGGGGGGGGGGG",
  "GgGgGGgGGgGgGGGg",
  "gggggggggggggggg",
  "gDDgDDggDDgDDggg",
  "DDDDDDDDDDDDDDDD",
  "DdDDdDDDdDDdDDDd",
  "DDDDDDDDDDDDDDDD",
  "DDddDDDDddDDDDdd",
  "dddddddddddddddd",
  "dDddDddDddDddDdd",
  "dddddddddddddddd",
  "ddDDddddDDddddDD",
  "dddddddddddddddd",
  "d.dd.ddd.dd.ddd.",
  "................",
  "................",
];
const grassPal: Palette = { G: "#5ec75a", g: "#3a9a40", D: "#8b5a2b", d: "#6b4220" };

const dirtTile = [
  "DDDDDDDDDDDDDDDD",
  "DdDDdDDDdDDdDDDd",
  "DDDDDDDDDDDDDDDD",
  "DDddDDDDddDDDDdd",
  "dddddddddddddddd",
  "dDddDddDddDddDdd",
  "dddddddddddddddd",
  "ddDDddddDDddddDD",
  "dddddddddddddddd",
  "DDddddDDddddDDdd",
  "dddddddddddddddd",
  "dd.ddddd.ddddd.d",
  "dddddddddddddddd",
  "dddd.dddddd.dddd",
  "dddddddddddddddd",
  "................",
];

const brickTile = [
  "BBBBBBBBBBBBBBBB",
  "BmmmmmmBmmmmmmBm",
  "BmmmmmmBmmmmmmBm",
  "BBBBBBBBBBBBBBBB",
  "mmmBmmmmmmBmmmmm",
  "mmmBmmmmmmBmmmmm",
  "BBBBBBBBBBBBBBBB",
  "BmmmmmmBmmmmmmBm",
  "BmmmmmmBmmmmmmBm",
  "BBBBBBBBBBBBBBBB",
  "mmmBmmmmmmBmmmmm",
  "mmmBmmmmmmBmmmmm",
  "BBBBBBBBBBBBBBBB",
  "BmmmmmmBmmmmmmBm",
  "BmmmmmmBmmmmmmBm",
  "BBBBBBBBBBBBBBBB",
];
const brickPal: Palette = { B: "#6a5348", m: "#8a6a58", d: "#4a3830" };

const cloudTile = [
  "................",
  "....wwwww.......",
  "...wWWWWWw......",
  "..wWWWWWWWw.ww..",
  ".wWWWWWWWWWWwwW.",
  "wWWWWWWWWWWWWWWw",
  "wWWWWWWWWWWWWWWw",
  ".wwWWWWWWWWWWww.",
  "...wwwwwwwwww...",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
];
const cloudPal: Palette = { w: "#d8eeff", W: "#ffffff", d: "#b8d8f0" };

const cloudSolid = [
  ".wwwwwwwwwwwwww.",
  "wWWWWWWWWWWWWWWw",
  "wWWWWWWWWWWWWWWw",
  "WWWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWW",
  "wWWWWWWWWWWWWWWw",
  "wWWWWWWWWWWWWWWw",
  "wwWWWWWWWWWWWWww",
  "wwwwwwwwwwwwwwww",
  "wwwwwwwwwwwwwwww",
  "dwwwwwwwwwwwwwwd",
  "ddwwwwwwwwwwwwdd",
  "dddddddddddddddd",
  "dddddddddddddddd",
  "dddddddddddddddd",
  "dddddddddddddddd",
];

const spikePix = [
  "................",
  "................",
  "................",
  "................",
  "................",
  "......ss......",
  ".....sSSs.....",
  "....sSSSss....",
  "...sSSSSSSs...",
  "..sSSSSSSSSs..",
  ".sSSSSSSSSSSs.",
  "sSSSSSSSSSSSSs",
  "ssssssssssssss",
  "nnnnnnnnnnnnnn",
  "nNNnNNnNNnNNnN",
  "nnnnnnnnnnnnnn",
];
const spikePal: Palette = { s: "#c0c8d0", S: "#e8eef4", n: "#5a5048", N: "#7a7068" };

const cratePix = [
  "CCCCCCCCCCCCCCCC",
  "CwwwwwwwwwwwwwCC",
  "CwCCCCCCCCCCwwCC",
  "CwC........CwCCC",
  "CwC.CCCCCC.CwCCC",
  "CwC.C....C.CwCCC",
  "CwC.C.CC.C.CwCCC",
  "CwC.C.CC.C.CwCCC",
  "CwC.C....C.CwCCC",
  "CwC.CCCCCC.CwCCC",
  "CwC........CwCCC",
  "CwCCCCCCCCCCwCCC",
  "CwwwwwwwwwwwwCCC",
  "CCCCCCCCCCCCCCCC",
  "ccCCCCCCCCCCCCcc",
  "cccccccccccccccc",
];
const cratePal: Palette = { C: "#c47a38", c: "#8a5020", w: "#e0a860" };

const treeTop = [
  "......gggg......",
  "....ggGGGGgg....",
  "...gGGGGGGGGg...",
  "..gGGGgGGGGgGg..",
  ".gGGGGGGGGGGGGg.",
  ".gGGgGGGGGgGGGg.",
  "gGGGGGGGGGGGGGGg",
  "gGGGgGGGGGGGgGGg",
  ".gGGGGGGGGGGGGg.",
  ".gGGgGGGGGgGGGg.",
  "..gGGGGGGGGGGg..",
  "...ggGGGGGGgg...",
  ".....ggGGgg.....",
  "......TETT......",
  "......TTTT......",
  "......TTTT......",
];
const treePal: Palette = { g: "#2d7a38", G: "#4aaa48", T: "#8b5a2b", E: "#6b4220" };

const bushPix = [
  "................",
  "................",
  "......ggg.......",
  "....ggGGGgg.....",
  "...gGGGGGGGg....",
  "..gGGgGGGGgGg...",
  ".gGGGGGGGGGGGg..",
  ".gGGgGGGGGgGGg..",
  "..ggGGGGGGGGgg..",
  "...gggggggggg...",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................",
];

const flagPix = [
  "S...............",
  "SRRRrrrR........",
  "SRRRRRrrR.......",
  "SRRRrrrR........",
  "S...............",
  "S...............",
  "S...............",
  "S...............",
  "S...............",
  "S...............",
  "S...............",
  "S...............",
  "S...............",
  "SSS.............",
  "SSSSS...........",
  "................",
];
const flagPal: Palette = { S: "#d8d0c0", R: "#ee3a4a", r: "#c02030" };

function anims(scene: Phaser.Scene) {
  const mk = (key: string, tex: string, frames: string[], rate: number, repeat = -1) => {
    if (scene.anims.exists(key)) scene.anims.remove(key);
    scene.anims.create({
      key,
      frames: frames.map((f) => ({ key: tex, frame: f })),
      frameRate: rate,
      repeat,
    });
  };
  mk("dad-idle", "dad", ["0", "0", "0", "1"], 4);
  mk("dad-walk", "dad", ["2", "3"], 8);
  mk("dad-jump", "dad", ["4"], 1, 0);
  mk("dad-throw", "dad", ["5"], 1, 0);
  mk("boy-idle", "boy", ["0", "0", "0", "1"], 4);
  mk("boy-walk", "boy", ["2", "3"], 10);
  mk("boy-jump", "boy", ["4"], 1, 0);
  mk("boy-throw", "boy", ["5"], 1, 0);
  mk("mushroom-walk", "mushroom", ["0", "1"], 4);
  mk("hedgehog-walk", "hedgehog", ["0", "1"], 5);
  mk("snail-walk", "snail", ["0", "1"], 3);
  mk("blob-walk", "blob", ["0", "1"], 6);
  mk("boss-mushroom", "boss-mushroom", ["0", "1"], 3);
  mk("boss-hedgehog", "boss-hedgehog", ["0", "1"], 4);
  mk("boss-cloud", "boss-cloud", ["0", "1"], 3);
}

function makeSky(scene: Phaser.Scene, key: string, top: string, bot: string) {
  canvasTexture(scene, key, 16, GAME_GRADIENT_H, (ctx) => {
    const h = GAME_GRADIENT_H;
    for (let y = 0; y < h; y++) {
      ctx.fillStyle = mixHex(top, bot, y / (h - 1));
      ctx.fillRect(0, y, 16, 1);
    }
  });
}

const GAME_GRADIENT_H = 270;

function mixHex(a: string, b: string, t: number) {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (shift: number) => {
    const ca = (pa >> shift) & 255;
    const cb = (pb >> shift) & 255;
    return Math.round(ca + (cb - ca) * t);
  };
  const r = ch(16);
  const g = ch(8);
  const bl = ch(0);
  return `rgb(${r},${g},${bl})`;
}

function hillTexture(scene: Phaser.Scene, key: string, color: string, dark: string) {
  canvasTexture(scene, key, 128, 48, (ctx) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, 48);
    ctx.lineTo(0, 28);
    ctx.quadraticCurveTo(32, 4, 64, 22);
    ctx.quadraticCurveTo(96, 40, 128, 18);
    ctx.lineTo(128, 48);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = dark;
    ctx.fillRect(0, 40, 128, 8);
  });
}

export function createAllTextures(scene: Phaser.Scene) {
  buildFont(scene);
  sheetTexture(scene, "dad", [dadIdle, dadBlink, dadWalkA, dadWalkB, dadJump, dadThrow], DAD, 2);
  sheetTexture(scene, "boy", [boyIdle, boyBlink, boyWalkA, boyWalkB, boyJump, boyThrow], BOY, 2);
  sheetTexture(scene, "mushroom", [mushA, mushB], mushPal, 2);
  sheetTexture(scene, "hedgehog", [hedgA, hedgB], hedgPal, 2);
  sheetTexture(scene, "snail", [snailA, snailB], snailPal, 2);
  sheetTexture(scene, "blob", [blobA, blobB], blobPal, 2);
  sheetTexture(scene, "boss-mushroom", [bossMushA, bossMushB], bossMushPal, 3);
  sheetTexture(scene, "boss-hedgehog", [bossHedgA, bossHedgB], bossHedgPal, 3);
  sheetTexture(scene, "boss-cloud", [bossCloudA, bossCloudB], bossCloudPal, 3);
  stampTexture(scene, "apple", applePix, applePal, 2);
  stampTexture(scene, "heart", heartPix, heartPal, 2);
  stampTexture(scene, "heart-empty", heartEmpty, heartPal, 2);
  stampTexture(scene, "grass", grassTile, grassPal, 1);
  stampTexture(scene, "dirt", dirtTile, grassPal, 1);
  stampTexture(scene, "brick", brickTile, brickPal, 1);
  stampTexture(scene, "cloud", cloudTile, cloudPal, 1);
  stampTexture(scene, "cloud-solid", cloudSolid, cloudPal, 1);
  stampTexture(scene, "spike", spikePix, spikePal, 1);
  stampTexture(scene, "crate", cratePix, cratePal, 1);
  stampTexture(scene, "tree", treeTop, treePal, 2);
  stampTexture(scene, "bush", bushPix, treePal, 2);
  stampTexture(scene, "flag", flagPix, flagPal, 2);

  canvasTexture(scene, "pixel", 2, 2, (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 2, 2);
  });

  makeSky(scene, "sky-orman", "#7ec8f8", "#c8ecff");
  makeSky(scene, "sky-kale", "#4a3a68", "#c07060");
  makeSky(scene, "sky-bulut", "#5aa0e8", "#e8f4ff");
  hillTexture(scene, "hill-dark", "#2d6a3a", "#245830");
  hillTexture(scene, "hill-light", "#3d8a4a", "#2d6a3a");
  hillTexture(scene, "hill-castle", "#3a3050", "#2a2040");
  hillTexture(scene, "hill-cloud", "#8ec8f0", "#7eb8e0");

  // 1x1 white for fades
  canvasTexture(scene, "white", 8, 8, (ctx) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 8, 8);
  });

  anims(scene);
  void TILE;
}

export function particleBurst(scene: Phaser.Scene, x: number, y: number, color: number) {
  for (let i = 0; i < 8; i++) {
    const p = scene.add.image(x, y, "pixel").setTint(color).setDepth(14);
    const ang = (i / 8) * Math.PI * 2;
    scene.tweens.add({
      targets: p,
      x: x + Math.cos(ang) * Phaser.Math.Between(10, 22),
      y: y + Math.sin(ang) * Phaser.Math.Between(10, 22),
      alpha: 0,
      duration: 280,
      onComplete: () => p.destroy(),
    });
  }
}
