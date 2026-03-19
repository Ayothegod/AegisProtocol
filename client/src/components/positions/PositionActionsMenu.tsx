import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UpdatePositionForm } from "./UpdatePositionForm";
import { DeletePositionButton } from "./DeletePositionButton";
import type { Position } from "@/types";

interface PositionActionsMenuProps {
  position: Position;
}

export function PositionActionsMenu({ position }: PositionActionsMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="
            px-3 py-1.5 text-[12px] font-medium
            bg-raised border border-border rounded-sm
            text-text-2 hover:text-text hover:border-border-hi
            transition-colors cursor-pointer
          "
        >
          Manage
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="
          w-100 bg-surface
          border-l border-border
          p-6 flex flex-col gap-6
        "
      >
        <SheetHeader>
          <SheetTitle
            className="text-[22px] text-text tracking-tight"
            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
          >
            Position #{position.id.toString()}
          </SheetTitle>
        </SheetHeader>

        <UpdatePositionForm
          position={position}
          onSuccess={() => setOpen(false)}
        />

        <div className="border-t border-border pt-4">
          <DeletePositionButton
            positionId={position.id}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
