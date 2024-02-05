import { HStack, Image } from "@chakra-ui/react";
import logo from "../assets/Logo/logo.webp";
import ColorModeSwitch from "../pages/ColorModeSwitch";
import SearchInput from "./SearchInput";
import { FaSignInAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Dropdown, Nav } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { FaShoppingCart } from 'react-icons/fa';
import { FaShoppingBag } from 'react-icons/fa';
const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();

  return (
    <HStack justifyContent="space-between" padding={"2px"}>
      <Link to="/">
      <Image src={logo}  boxSize="60px" margin={1}/>
      </Link>
      <SearchInput onSearch={onSearch} />
      <Nav className="ml-auto" >
            {user ?(
              <>
                <Dropdown>
              <Dropdown.Toggle variant="dark">
                {user.username}
              </Dropdown.Toggle>

              <Dropdown.Menu >
                <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                <Dropdown.Item ><Link to={`/cart/${user.id}`}><FaShoppingCart/></Link></Dropdown.Item>
                <Dropdown.Item ><Link to={`/orders/${user.id}`}><FaShoppingBag/></Link></Dropdown.Item>

              </Dropdown.Menu>
            </Dropdown>
              </>
            ): (
              <>
       <Link to="/login">
        <FaSignInAlt />
      </Link>
              </>
            )}
          </Nav>
      <ColorModeSwitch />
    </HStack>
  );
};

export default Navbar;
