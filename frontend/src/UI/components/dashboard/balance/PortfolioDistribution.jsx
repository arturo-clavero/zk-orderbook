import { Box, Stack } from "@mui/material";
import { useEffect, useState } from "react";

const defaultColors = ["#5566ff", "#55a0f1", "#e166fa", "#a364f5", "#5cffa0"];
const subtleColor = "#e0e0e034";

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function PortfolioDistribution({
  totalBalance,
  balance,
  tokens = {},
}) {
  if (!tokens || typeof tokens != "object") return null;

  const circleSpacing = 12;
  const strokeWidth = 6;
  const baseRadius = 30;
  const startAngle = -Math.PI / 2;
  const center = 75;

  const [animationProgress, setAnimationProgress] = useState(0);
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    let start = 0;
    const animate = () => {
      start += 0.005;
      const eased = easeInOutCubic(start);
      setAnimationProgress(eased);
      if (start < 1) requestAnimationFrame(animate);
    };
    setTimeout(() => requestAnimationFrame(animate), 1900);
  }, []);

  return (
    <Stack
      alignItems="center"
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
    >
      <Box sx={{ position: "relative", width: 150, height: 150 }}>
        <svg width={150} height={150} viewBox="0 0 150 150">
          {Object.values(tokens).map((token, idx) => {
            const tokenValue = balance[token.symbol] * (token.price || 1);
            const percentage = tokenValue / totalBalance;
            const radius = baseRadius + idx * circleSpacing;
            const circumference = 2 * Math.PI * radius;
            const dashArray = circumference * percentage * animationProgress;
            const dashLength = circumference * percentage * animationProgress;
            const gapLength = circumference - dashLength;

            const color =
              hovered === idx
                ? defaultColors[idx % defaultColors.length] + "aa"
                : defaultColors[idx % defaultColors.length];

            return (
              <g
                key={token.symbol}
                style={{ cursor: "pointer", transition: "stroke 0.3s" }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <circle
                  r={radius}
                  cx={center}
                  cy={center}
                  fill="transparent"
                  stroke={subtleColor}
                  strokeWidth={strokeWidth / 5}
                  pointerEvents="none"
                />
                <circle
                  r={radius}
                  cx={center}
                  cy={center}
                  fill="transparent"
                  stroke={color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${dashLength} ${gapLength}`}
                  strokeDashoffset={circumference}
                  strokeLinecap="round"
                  transform={`rotate(${(startAngle * 180) / Math.PI} ${center} ${center})`}
                  pointerEvents="stroke"
                />
              </g>
            );
          })}
        </svg>
      </Box>

      <Stack
        direction="column"
        spacing={1}
        flexWrap="wrap"
        justifyContent="center"
      >
        {Object.values(tokens).map((token, idx) => {
          const tokenValue = balance[token.symbol] * (token.price || 1);
          const percentage = (tokenValue / totalBalance) * 100;
          const color =
            hovered === idx
              ? defaultColors[idx % defaultColors.length] + "aa"
              : defaultColors[idx % defaultColors.length];
          return (
            <Stack
              key={token.symbol}
              direction="row"
              spacing={1}
              alignItems="center"
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              sx={{
                cursor: "pointer",
                fontWeight: hovered === idx ? 700 : 400,
                color: hovered === idx ? color : "text.secondary",
                transition: "color 0.3s, font-weight 0.3s",
                minWidth: 100,
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  bgcolor: color,
                  borderRadius: "50%",
                  transition: "background-color 0.3s",
                }}
              />
              <Box sx={{ fontSize: 12 }}>
                {token.symbol} {percentage.toFixed(1)}%
              </Box>
            </Stack>
          );
        })}
      </Stack>
    </Stack>
  );
}
