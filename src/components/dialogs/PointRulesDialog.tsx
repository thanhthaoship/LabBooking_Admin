import { PointRuleModel } from "@/config/models/point-rule";
import { currency, formatNumber } from "@/lib";
import { CheckCircle } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { H6 } from "../Typography";

interface IProps {
  openRulesModal: boolean;
  handleCloseRulesModal: () => void;
  pointRules: PointRuleModel[];
}

const PointRulesDialog = ({
  openRulesModal,
  handleCloseRulesModal,
  pointRules,
}: IProps) => {
  return (
    <Dialog
      open={openRulesModal}
      onClose={handleCloseRulesModal}
      aria-labelledby="points-rules-dialog-title"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle id="points-rules-dialog-title">
        Quy tắc tích lũy và sử dụng điểm
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Cách tích lũy điểm:
        </Typography>
        {pointRules.length > 0 ? (
          <List>
            {pointRules?.map((rule, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={`Mỗi hóa đơn thanh toán có giá trị >= ${currency(rule.rewardRate)} sẽ được >= ${formatNumber((rule.conversionRate / 100) * rule.rewardRate)} điểm`}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <H6 color="red">Chưa cập nhật</H6>
        )}

        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{ mt: 2 }}
        >
          Cách sử dụng điểm:
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={`Mỗi điểm có giá trị quy đổi là ${currency(1)}`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Điểm có thể được sử dụng để giảm trực tiếp vào giá trị đơn hàng" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircle color="primary" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Điểm không có giá trị quy đổi thành tiền mặt" />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleCloseRulesModal}
          color="primary"
        >
          Đã hiểu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PointRulesDialog;
