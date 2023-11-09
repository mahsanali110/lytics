import { LogoIcon } from "../../../assets/icons";
import "./Logo.scss";
const Logo = (props) => (
  <h1 className="header-logo">
    <LogoIcon {...props} />
  </h1>
);

export default Logo;
