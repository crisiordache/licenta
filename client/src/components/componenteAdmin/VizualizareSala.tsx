import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Box, Button, Typography } from "@mui/material";
import { Loc } from "../../types/Loc";

interface VizualizareSalaProps {
  structura: Loc[];
  locuriSelectate: Map<string, Loc>;
  onToggleLoc: (loc: Loc) => void;
  locuriBolcate: Map<string, Loc>;
}

export const VizualizareSala: React.FC<VizualizareSalaProps> = ({
  structura,
  locuriSelectate,
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

  const { offsetX, offsetY } = useMemo(() => {
    if (structura.length === 0) return { offsetX: 0, offsetY: 0 };

    let minX = Infinity;
    let minY = Infinity;

    structura.forEach((loc) => {
      if (loc.x < minX) minX = loc.x;
      if (loc.y < minY) minY = loc.y;
    });

    return { offsetX: minX, offsetY: minY };
  }, [structura]);

  const latimeLoc = 36;
  const latimeLabelRand = 20;
  const paddingContainer = 16;

  const checkCollision = useCallback(
    (
      selectionRect: { x1: number; y1: number; x2: number; y2: number },
      loc: Loc
    ) => {
      const locDisplayX = loc.x - offsetX + latimeLabelRand + paddingContainer;
      const locDisplayY = loc.y - offsetY + paddingContainer;

      const locRect = {
        left: locDisplayX,
        top: locDisplayY,
        width: latimeLoc,
        height: latimeLoc,
      };

      const selMinX = Math.min(selectionRect.x1, selectionRect.x2);
      const selMaxX = Math.max(selectionRect.x1, selectionRect.x2);
      const selMinY = Math.min(selectionRect.y1, selectionRect.y2);
      const selMaxY = Math.max(selectionRect.y1, selectionRect.y2);

      return (
        locRect.left < selMaxX &&
        locRect.left + locRect.width > selMinX &&
        locRect.top < selMaxY &&
        locRect.top + locRect.height > selMinY
      );
    },
    [offsetX, offsetY, latimeLoc, latimeLabelRand, paddingContainer]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLButtonElement && e.target.dataset.loc) {
      return;
    }
    e.preventDefault();
    if (salaRef.current) {
      const salaDiv = salaRef.current;
      const { left, top } = salaDiv.getBoundingClientRect();

      const startX = e.clientX - left + salaDiv.scrollLeft;
      const startY = e.clientY - top + salaDiv.scrollTop;

      setStartPoint({ x: startX, y: startY });
      setCurrentPoint({ x: startX, y: startY });
      setIsSelecting(true);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !startPoint || !salaRef.current) return;

      const salaDiv = salaRef.current;
      const { left, top } = salaDiv.getBoundingClientRect();

      const currentX = e.clientX - left + salaDiv.scrollLeft;
      const currentY = e.clientY - top + salaDiv.scrollTop;

      setCurrentPoint({ x: currentX, y: currentY });
    },
    [isSelecting, startPoint]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !startPoint || !salaRef.current) return;

      const salaDiv = salaRef.current;
      const { left, top } = salaDiv.getBoundingClientRect();

      const endX = e.clientX - left + salaDiv.scrollLeft;
      const endY = e.clientY - top + salaDiv.scrollTop;

      const selectionRect = {
        x1: startPoint.x,
        y1: startPoint.y,
        x2: endX,
        y2: endY,
      };

      const locsToToggle: Loc[] = [];

      structura.forEach((loc) => {
        const locKey = `${loc.rand}-${loc.numar}`;
        if (!locuriBolcate.has(locKey) && checkCollision(selectionRect, loc)) {
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
        p: paddingContainer,
        minWidth: "fit-content",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        overflow: "auto",
        maxHeight: "400px",
        cursor: isSelecting ? "grabbing" : "grab",
      }}
    >
      {isSelecting && startPoint && currentPoint && <Box sx={selectionStyle} />}

      {structura.map((loc) => {
        const locKey = `${loc.rand}-${loc.numar}`;
        const esteSelectat = locuriSelectate.has(locKey);
        const esteBlocat = locuriBolcate.has(locKey);

        return (
          <Button
            key={locKey}
            data-loc={locKey}
            variant={esteSelectat ? "contained" : "outlined"}
            color={esteSelectat ? "primary" : "inherit"}
            onClick={() => onToggleLoc(loc)}
            disabled={esteBlocat}
            sx={{
              position: "absolute",
              left: loc.x - offsetX + latimeLabelRand + paddingContainer,
              top: loc.y - offsetY + paddingContainer,
              width: latimeLoc,
              height: latimeLoc,
              minWidth: latimeLoc,
              p: 0,
              fontSize: "0.75rem",
              backgroundColor: esteBlocat
                ? "#bdbdbd"
                : esteSelectat
                ? "#1976d2"
                : "white",
              color: esteBlocat ? "#424242" : esteSelectat ? "white" : "black",
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

      {randuriUnice.map((rand) => {
        const primulLocDinRand = structura.find((l) => l.rand === rand);
        if (!primulLocDinRand) return null;

        return (
          <Typography
            key={`label-${rand}`}
            variant="caption"
            sx={{
              position: "absolute",
              left: paddingContainer,
              top:
                primulLocDinRand.y -
                offsetY +
                latimeLoc / 2 -
                8 +
                paddingContainer,
              width: latimeLabelRand,
              textAlign: "right",
              fontWeight: "bold",
              color: "#555",
              zIndex: 1,
            }}
          >
            {rand}
          </Typography>
        );
      })}
    </Box>
  );
};
