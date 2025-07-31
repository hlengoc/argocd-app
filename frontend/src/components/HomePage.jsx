import Heading from "./Heading.jsx";
import Items from "./Items.jsx";
import Subscribe from "./Subscribe.jsx";
import Features from "./Features.jsx";
import TestHeading from "./TestHeading.jsx";
import {useState} from "react";

function HomePage() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Heading />
      <Features />
      <Subscribe
        onSignIn={() => {
          setVisible(true);
        }}
      />
      <Items visible={visible} />
    </>
  );
}

export default HomePage;
