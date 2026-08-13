/**
 * Scene presets for the visualizer.
 *
 * Each scene has a display config and a render prompt suffix
 * that gets appended to the base editorial photography prompt.
 */

export interface Scene {
  id: string;
  name: string;
  description: string;
  promptSuffix: string;
  emoji: string; // used as visual indicator, not rendered as icon
}

export const SCENES: Scene[] = [
  {
    id: "warm-white",
    name: "Everyday Warm White",
    description: "Soft white along the roofline, a summer evening. The one that\u2019s on 300 nights a year.",
    promptSuffix: "Permanent warm white LED architectural lighting (2700K color temperature) is installed along every visible roofline, eave, peak, gable, and soffit — evenly spaced individual points of light following the exact contours of the existing roof structure.",
    emoji: "☀️",
  },
  {
    id: "christmas",
    name: "Christmas",
    description: "Deep winter, snow on the ground and the trees. Warm reds and greens down every peak.",
    promptSuffix: "Permanent LED architectural lighting is installed along every visible roofline, eave, peak, gable, and soffit. The lights are set to alternating warm red and green colors in a classic Christmas pattern. Light snow dusts the roof and landscaping. The scene feels festive and inviting.",
    emoji: "🎄",
  },
  {
    id: "halloween",
    name: "Halloween",
    description: "Orange and purple, late October, bare trees. The house every kid on the block detours for.",
    promptSuffix: "Permanent LED architectural lighting is installed along every visible roofline, eave, peak, gable, and soffit. The lights are set to alternating orange and purple colors for Halloween. The scene has a late October atmosphere with bare tree branches visible.",
    emoji: "🎃",
  },
  {
    id: "gameday",
    name: "Game Day",
    description: "Blue and white, Sunday night in the fall. Or whatever colors you\u2019d rather fly.",
    promptSuffix: "Permanent LED architectural lighting is installed along every visible roofline, eave, peak, gable, and soffit. The lights are set to bold blue and white colors for game day spirit. The scene feels energetic and proud.",
    emoji: "🏈",
  },
];

/** Base prompt that every scene shares */
export const BASE_RENDER_PROMPT = `Editorial architectural photography of this exact house at blue hour, shot on Canon EOS R5 with 24mm tilt-shift lens, f/8, 4-second long exposure. The long exposure creates subtle light bloom around each LED. The sky is deep cobalt blue with visible cloud texture and the last amber traces of sunset on the horizon. The driveway and walkway have a faint wet sheen reflecting the glow from the roofline. Landscape is softly lit by ambient spill from the LEDs. All architectural details, windows, siding, landscaping, vehicles, and property features remain exactly as they are — nothing is added or removed except the roofline lighting and the transition to blue hour. The result should look like it belongs in Architectural Digest or Luxe Interiors + Design. No visible wires, no clip marks, no construction evidence.`;

export function buildRenderPrompt(scene: Scene, address?: string): string {
  return `${BASE_RENDER_PROMPT} ${scene.promptSuffix}${address ? ` This is ${address}.` : ""}`;
}
