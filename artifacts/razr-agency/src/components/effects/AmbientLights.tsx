// CSS-only ambient drifting orbs. Pure transform animation, no JS, GPU-composited.
export default function AmbientLights() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden motion-reduce:hidden">
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-orb ambient-orb-c" />
    </div>
  );
}
