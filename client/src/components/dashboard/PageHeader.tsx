import { RegisterPositionModal } from "../positions/RegisterPositionModel";

export function PageHeader() {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="font-mono text-[12px] text-text-3 tracking-widest uppercase mb-1">
          Overview ·{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <h1
          className="text-[36px] leading-none tracking-tight text-text"
          style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
        >
          Your{" "}
          <em
            className="text-accent not-italic"
            style={{ fontStyle: "italic" }}
          >
            positions
          </em>
          , protected.
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="
          px-4 py-2 text-[13px] font-medium
          bg-transparent border border-border-hi
          text-text-2 rounded-md
          hover:border-border-hi hover:text-text hover:bg-raised
          transition-colors cursor-pointer
        "
        >
          Import Position
        </button>
        <RegisterPositionModal />
      </div>
    </div>
  );
}
