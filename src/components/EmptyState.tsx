"use client";

import { FC } from "react";
import { alpha } from "@mui/material/styles";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  Icon,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  Icon?: FC;
}) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 5,
        textAlign: "center",
        borderRadius: 3,
        border: "1px dashed",
        borderColor: alpha(theme.palette.primary.main, 0.3),
        backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
      })}
    >
      <Stack spacing={2} alignItems="center" justifyContent="center">
        {Icon && (
          <Box
            sx={(theme) => ({
              width: 72,
              height: 72,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              color: theme.palette.primary.main,
            })}
          >
            <Icon />
          </Box>
        )}
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {actionLabel && onAction && (
          <Box>
            <Button onClick={onAction} variant="contained" color="primary">
              {actionLabel}
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
