import { Box, Stack, Typography } from "@mui/material";

export function SortableHeader({
  label,
  sortKey,
  sortConfig,
  setSortConfig,
  flex = 1,
}) {
  const handleSort = (direction) => {
    setSortConfig((prev) => {
      if (prev.key === sortKey && prev.direction === direction) {
        // Reset sort if clicked same direction again
        return { key: null, direction: "asc" };
      }
      return { key: sortKey, direction };
    });
  };

  const isAsc = sortConfig.key === sortKey && sortConfig.direction === "asc";
  const isDesc = sortConfig.key === sortKey && sortConfig.direction === "desc";

  return (
    <Box
      sx={{
        flex,
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
        fontSize: 12,
      }}
    >
      <span>{label}</span>
      <Stack
        direction="column"
        spacing={0}
        alignItems="center"
        justifyContent="center"
        sx={{ ml: 1 }}
      >
        <Typography
          sx={{
            fontSize: 10,
            color: isAsc ? "blue" : "gray",
            cursor: "pointer",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => handleSort("asc")}
        >
          ▲
        </Typography>

        <Typography
          sx={{
            fontSize: 10,
            color: isDesc ? "blue" : "gray",
            cursor: "pointer",
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => handleSort("desc")}
        >
          ▼
        </Typography>
      </Stack>
    </Box>
  );
}
