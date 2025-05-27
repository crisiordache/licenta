// VizualizareSala.tsx
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Loc } from "../../types/Loc";

interface VizualizareSalaProps {
  structura: Loc[];
  selectedLocuri: Map<string, Loc>;
  onToggleLoc: (loc: Loc) => void;
  locuriBolcate: Map<string, Loc>;
}

export const VizualizareSala: React.FC<VizualizareSalaProps> = ({
  structura,
  selectedLocuri,
  onToggleLoc,
  locuriBolcate,
}) => {
  const salaRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentPoint, setCurrentPoint] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const randuriUnice = Array.from(
    new Set(structura.map((loc) => loc.rand))
  ).sort();
  const maxNumarPerRand: { [key: string]: number } = {};
  structura.forEach((loc) => {
    if (!maxNumarPerRand[loc.rand] || loc.numar > maxNumarPerRand[loc.rand]) {
      maxNumarPerRand[loc.rand] = loc.numar;
    }
  });

  const checkCollision = useCallback(
    (
      selectionRect: { x1: number; y1: number; x2: number; y2: number },
      locElement: HTMLButtonElement
    ) => {
      const locRect = locElement.getBoundingClientRect();
      const salaRect = salaRef.current?.getBoundingClientRect();

      if (!salaRect) return false;

      const locX = locRect.left - salaRect.left;
      const locY = locRect.top - salaRect.top;
      const locWidth = locRect.width;
      const locHeight = locRect.height;

      return (
        locX < Math.max(selectionRect.x1, selectionRect.x2) &&
        locX + locWidth > Math.min(selectionRect.x1, selectionRect.x2) &&
        locY < Math.max(selectionRect.y1, selectionRect.y2) &&
        locY + locHeight > Math.min(selectionRect.y1, selectionRect.y2)
      );
    },
    []
  );

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLButtonElement && e.target.dataset.loc) {
      return;
    }
    e.preventDefault();
    if (salaRef.current) {
      const { left, top } = salaRef.current.getBoundingClientRect();
      const startX = e.clientX - left;
      const startY = e.clientY - top;
      setStartPoint({ x: startX, y: startY });
      setCurrentPoint({ x: startX, y: startY });
      setIsSelecting(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !startPoint || !salaRef.current) return;

      const { left, top } = salaRef.current.getBoundingClientRect();
      const currentX = e.clientX - left;
      const currentY = e.clientY - top;
      setCurrentPoint({ x: currentX, y: currentY });
    },
    [
      isSelecting,
      startPoint,
      locuriBolcate,
      structura,
      checkCollision,
      selectedLocuri,
    ]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !startPoint || !salaRef.current) return;

      const { left, top } = salaRef.current.getBoundingClientRect();
      const endX = e.clientX - left;
      const endY = e.clientY - top;

      const selectionRect = {
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endX,
        y2: endY,
      };

      const locsToToggle: Loc[] = [];

      const locButtons =
        salaRef.current.querySelectorAll<HTMLButtonElement>("[data-loc]");
      locButtons.forEach((button) => {
        const locKey = button.dataset.loc!;
        const [rand, numarStr] = locKey.split("-");
        const numar = parseInt(numarStr);
        const loc = structura.find((l) => l.rand === rand && l.numar === numar);

        if (!loc || locuriBolcate.has(locKey)) return;

        if (checkCollision(selectionRect, button)) {
          locsToToggle.push(loc);
        }
      });

      const clickThreshold = 5;
      const isClick =
        Math.abs(startPoint.x - endX) < clickThreshold &&
        Math.abs(startPoint.y - endY) < clickThreshold;

      if (isClick && locsToToggle.length === 1) {
        onToggleLoc(locsToToggle[0]);
      } else if (locsToToggle.length > 0) {
        locsToToggle.forEach((loc) => {
          onToggleLoc(loc);
        });
      }

      setIsSelecting(false);
      setStartPoint(null);
      setCurrentPoint(null);
    },
    [
      isSelecting,
      startPoint,
      locuriBolcate,
      structura,
      checkCollision,
      selectedLocuri,
      onToggleLoc,
    ]
  );

  useEffect(() => {
    if (isSelecting) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSelecting, handleMouseMove, handleMouseUp]);

  const selectionStyle: React.CSSProperties = {};
  if (startPoint && currentPoint) {
    selectionStyle.left = Math.min(startPoint.x, currentPoint.x);
    selectionStyle.top = Math.min(startPoint.y, currentPoint.y);
    selectionStyle.width = Math.abs(startPoint.x - currentPoint.x);
    selectionStyle.height = Math.abs(startPoint.y - currentPoint.y);
    selectionStyle.border = "1px dashed #007bff";
    selectionStyle.backgroundColor = "rgba(0, 123, 255, 0.1)";
    selectionStyle.position = "absolute";
    selectionStyle.zIndex = 10;
    selectionStyle.pointerEvents = "none";
  }

  return (
    <Box
      ref={salaRef}
      onMouseDown={handleMouseDown}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 2,
        minWidth: "fit-content",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "auto",
        maxHeight: "400px",
        cursor: isSelecting ? "grabbing" : "grab",
      }}
    >
      {isSelecting && startPoint && currentPoint && <Box sx={selectionStyle} />}

      {randuriUnice.map((rand) => (
        <Box key={rand} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography
            variant="caption"
            sx={{ mr: 1, minWidth: "20px", textAlign: "right" }}
          >
            {rand}
          </Typography>
          <Box sx={{ display: "flex", gap: "8px" }}>
            {Array.from(
              { length: maxNumarPerRand[rand] || 0 },
              (_, i) => i + 1
            ).map((numarLoc) => {
              const loc = structura.find(
                (l) => l.rand === rand && l.numar === numarLoc
              );
              const locKey = `${rand}-${numarLoc}`;
              const esteSelectat = selectedLocuri.has(locKey);
              const esteBlocat = locuriBolcate.has(locKey);

              if (!loc) {
                return <Box key={locKey} sx={{ width: 36, height: 36 }} />;
              }

              return (
                <Button
                  key={locKey}
                  data-loc={locKey}
                  variant={esteSelectat ? "contained" : "outlined"}
                  color={esteSelectat ? "primary" : "inherit"}
                  onClick={() => onToggleLoc(loc)}
                  disabled={esteBlocat}
                  sx={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    p: 0,
                    fontSize: "0.75rem",
                    backgroundColor: esteBlocat
                      ? "#bdbdbd"
                      : esteSelectat
                      ? "#1976d2"
                      : "white",
                    color: esteBlocat
                      ? "#424242"
                      : esteSelectat
                      ? "white"
                      : "black",
                    borderColor: esteBlocat
                      ? "#9e9e9e"
                      : esteSelectat
                      ? "#1976d2"
                      : "#ccc",
                    "&:hover": {
                      backgroundColor: esteBlocat
                        ? "#bdbdbd"
                        : esteSelectat
                        ? "#1565c0"
                        : "#f0f0f0",
                      borderColor: esteBlocat
                        ? "#9e9e9e"
                        : esteSelectat
                        ? "#1565c0"
                        : "#bbb",
                    },
                  }}
                >
                  {loc.numar}
                </Button>
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
