import { getAddresses } from "@/actions/address.action";
import getPointRules from "@/actions/point-rules.action";
import { getTotalPoints } from "@/actions/profile.action";
import CartDetails from "@/pages-sections/cart";

const Cart = async () => {
  const addresses = await getAddresses();
  const defaultAddressId = addresses?.find(
    (address) => address.defaultAddress
  )?.shippingAddressId;

  const totalPoints = await getTotalPoints();
  const pointRules = await getPointRules(); // Fetch point rules from your backend

  return (
    <CartDetails
      addresses={addresses || []}
      defaultAddressId={defaultAddressId || ""}
      totalPoints={totalPoints || 0}
      pointRules={pointRules || []}
    />
  );
};

export default Cart;
