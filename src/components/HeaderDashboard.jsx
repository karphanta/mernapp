import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, Nav, NavItem, NavLink, Tooltip } from 'reactstrap';

import { FaCogs, FaSignOutAlt } from 'react-icons/fa';

class HeaderDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipOpen: false
    }
    this.toggle = this.toggle.bind(this);
  }
  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  render() {
      return (
        <Navbar color="warning" light expand="md">
          <NavbarBrand><FaCogs /> Dashboard</NavbarBrand>
          <Collapse navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href="#" onClick={this.props.onShow.bind(this, 1)}>Todos los Posts</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={this.props.onShow.bind(this, 2)}>Mis Posts</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" onClick={this.props.onShow.bind(this, 3)}>{sessionStorage.getItem('username')}</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" id="tooltip_logout" onClick={ this.props.onLogout }><FaSignOutAlt />
                  <Tooltip placement="bottom" isOpen={this.state.tooltipOpen} target="tooltip_logout" toggle={this.toggle}>
                      Salir
                  </Tooltip>
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
    );
  }
}
export default HeaderDashboard;
