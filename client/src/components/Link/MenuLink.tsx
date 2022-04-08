import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import usePageViews from "hooks/usePageViews";
import useSubPath from "hooks/useSubPath";
import { Typography, useTheme } from "@mui/material";
import { mainFontSize } from "utils/FontSize";
import { MenuLinkContainer } from "./MenuLinkStyles";

interface MenuLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  to: string;
  children: JSX.Element | JSX.Element[] | string | string[];
}
const MenuLink = (props: MenuLinkProps) => {
  const { to, children, ...rest } = props;
  const [active, setActive] = useState<string>("");
  const pathname = usePageViews();
  const subpath = useSubPath();

  const theme = useTheme();
  useEffect(() => {
    if (to === `/${pathname + subpath}`) {
      setActive("active");
    } else {
      setActive("");
    }
  }, [pathname, subpath]);
  return (
    <MenuLinkContainer>
      <Link to={to} {...rest} className={active}>
        <Typography
          fontWeight={theme.typography.fontWeightBold}
          fontSize={mainFontSize}
        >
          {children}
        </Typography>
      </Link>
    </MenuLinkContainer>
  );
};
export default MenuLink;
