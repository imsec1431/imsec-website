import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { add } from "./redux/Cartslice";

const TestComponent = () => {
  const dispatch = useDispatch();
  const cartitems = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(add({ id: 1, name: "Test Item", price: 100, images: "test.jpg" }));
  }, [dispatch]);

  // console.log("Cart Items in TestComponent:", cartitems);

  return <div>Check Console for Redux State</div>;
};

export default TestComponent;
