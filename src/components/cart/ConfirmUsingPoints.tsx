import { currency } from "@/lib";
import { HelpOutline, Redeem } from "@mui/icons-material";
import {
  Box,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { FlexBox } from "../flex-box";
import { H5, Paragraph } from "../Typography";
import PointRulesDialog from "../dialogs/PointRulesDialog";
import { PointRuleModel } from "@/config/models/point-rule";

interface IProps {
  availablePoints: number;
  onUsePointsChange: (usePoints: boolean) => void;
  pointsValue?: number; // Value of each point in currency (default: 1)
  pointRules: PointRuleModel[];
  isUsePoints?: boolean; // Default value of usePoints, default is false
}

const ConfirmUsingPoints = ({
  availablePoints,
  onUsePointsChange,
  pointsValue = 1,
  pointRules,
  isUsePoints = false,
}: IProps) => {
  const [openRulesModal, setOpenRulesModal] = useState<boolean>(false);
  const pointsMonetaryValue = availablePoints * pointsValue;

  const handleUsePointsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    onUsePointsChange(checked);
  };

  const handleOpenRulesModal = () => {
    setOpenRulesModal(true);
  };

  const handleCloseRulesModal = () => {
    setOpenRulesModal(false);
  };

  return (
    <>
      <Card sx={{ p: 3, mb: 2 }}>
        <FlexBox alignItems="center" mb={2}>
          <Redeem sx={{ color: "primary.main", mr: 1 }} />
          <H5>Điểm tích lũy</H5>
          <IconButton
            size="small"
            color="primary"
            onClick={handleOpenRulesModal}
            sx={{ ml: "auto" }}
            aria-label="Xem quy tắc tích điểm"
          >
            <HelpOutline />
          </IconButton>
        </FlexBox>

        <Box>
          {availablePoints > 0 ? (
            <>
              <FlexBox justifyContent="space-between" mb={1}>
                <Paragraph>Điểm khả dụng:</Paragraph>
                <Paragraph fontWeight={600} color="primary.main">
                  {availablePoints.toLocaleString()} điểm
                </Paragraph>
              </FlexBox>

              <FlexBox justifyContent="space-between" mb={2}>
                <Paragraph>Giá trị quy đổi:</Paragraph>
                <Paragraph fontWeight={600}>
                  {currency(pointsMonetaryValue)}
                </Paragraph>
              </FlexBox>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={isUsePoints}
                    onChange={handleUsePointsChange}
                    color="primary"
                  />
                }
                label={
                  <Typography>
                    Sử dụng {availablePoints.toLocaleString()} điểm để giảm{" "}
                    {currency(pointsMonetaryValue)}
                  </Typography>
                }
              />
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Paragraph color="text.secondary" sx={{ mb: 1 }}>
                Hiện tại bạn chưa có điểm tích lũy nào
              </Paragraph>
              <Paragraph color="primary.main" fontWeight={500}>
                Hoàn tất đơn hàng để nhận điểm thưởng hấp dẫn và sử dụng cho lần
                mua sắm tiếp theo!
              </Paragraph>
            </Box>
          )}
        </Box>

        <PointRulesDialog
          openRulesModal={openRulesModal}
          handleCloseRulesModal={handleCloseRulesModal}
          pointRules={pointRules}
        />
      </Card>
    </>
  );
};

export default ConfirmUsingPoints;
