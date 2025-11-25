import { Small } from "@components/Typography";
import Link from "next/link";

interface NavLink2Props {
  url?: string;
  title?: string;
  color?: string;
  borderColor?: string;
}

// ==============================================================
const NavLink2 = ({
  url,
  title = "SHOP NOW",
  color,
  borderColor = "primary.600",
}: NavLink2Props) => {
  return url ? (
    <Link href={url}>
      <Small
        fontWeight="900"
        borderBottom={2}
        color={color}
        borderColor={borderColor}
      >
        {title}
      </Small>
    </Link>
  ) : (
    <Small
      fontWeight="900"
      borderBottom={2}
      color={color}
      borderColor={borderColor}
    >
      {title}
    </Small>
  );
};

export default NavLink2;
