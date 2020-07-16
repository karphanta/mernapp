import React, { Component } from 'react';
import classnames from 'classnames';

import { Row, Col, Card, CardTitle, Badge, UncontrolledCollapse, CardBody,
Table, Alert, Button, Nav, NavItem, NavLink, Navbar, NavbarBrand, TabContent,
TabPane, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { FaFeather, FaEdit, FaTrashAlt } from 'react-icons/fa';

import { getMyPosts, deletePost } from "../../utils/apicalls.jsx";
import { getDateInStrFormat } from "../../utils/utils.jsx";

import AddPost from './AddPost';
import EditPost from './EditPost';

class MyPostList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      edit: (<Alert color="warning">Seleccione editar un post de la lista</Alert>),
      activeTab: '1',
      showDeleteModal: null
    };
    this.handleUpdateMyPosts = this.handleUpdateMyPosts.bind(this);
    this.deletePost = this.deletePost.bind(this);
  }

  getPosts() {
      getMyPosts(sessionStorage.getItem('iduser')).then((posts) => {
        this.setState({
          posts
        });
      });
    }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  handleUpdateMyPosts(){
    this.getPosts();
  }

  askForDelete(post){
    this.setState({
      showDeleteModal: (
        <Modal isOpen="true" className={this.props.className}>
          <ModalHeader>Eliminar post</ModalHeader>
          <ModalBody>
            ¿Está seguro que desea eliminar el post <strong>{post.title}</strong>?
          </ModalBody>
          <ModalFooter>
            <Button color="warning" onClick={() => this.deletePost(post)}>Eliminar</Button>{' '}
            <Button color="secondary" onClick={() => this.setState({ showDeleteModal: null })}>Cancelar</Button>
          </ModalFooter>
        </Modal>)
      });
  }

  //Deleting post
  deletePost(post){
    deletePost(post._id)
      .then((res) => this.checkDELETEPost(res));
  }

  //Check the response from server
  checkDELETEPost(res) {
    //if ok, remove modal and reset edit component
    if (res === "OK"){
      this.setState({
        showDeleteModal: null,
        edit: (<Alert color="warning">Seleccione editar un post de la lista</Alert>)
      });
      this.handleUpdateMyPosts();
    }else{
      //TODO Show a modal when error from server
    }
  }

  handleShowEdit(post){
    this.setState({
      edit: (<EditPost post= {post} updateMyPosts = {this.handleUpdateMyPosts} />)
    });
  }

  componentDidMount() {
    this.getPosts();
  }

  render() {
      return (
        <div>
          {this.state.showDeleteModal}
          <Row>
            <Col xs="7">
              <CardTitle tag="center"><Alert color="info"><strong>Mis Posts publicados </strong><Badge pill>{this.state.posts.length}</Badge></Alert></CardTitle>
              <Table>
                <tbody>
                  { this.state.posts.map((post, index) => {
                    return(<div>
                      <Row>
                        <Col>
                          <Navbar expand="md">
                            <NavbarBrand href="#" id={"toggler"+index}><h5><FaFeather /> {post.title}</h5></NavbarBrand>
                            <Nav className="ml-auto" navbar>
                              <NavItem>
                                <NavLink>
                                  <Button outline onClick={this.handleShowEdit.bind(this, post)}><FaEdit /></Button>
                                  {' '}
                                  <Button outline onClick={this.askForDelete.bind(this, post)}><FaTrashAlt /></Button>
                                </NavLink>
                              </NavItem>
                            </Nav>
                          </Navbar>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <UncontrolledCollapse toggler={"#toggler"+index}>
                            <Card>
                              <CardBody>
                                <Row><Col>{post.description}</Col></Row>
                                <Row><Col align="right"><small>{getDateInStrFormat(new Date(post.publicationdate))} - {post.user.username}</small></Col></Row>
                              </CardBody>
                            </Card>
                          </UncontrolledCollapse>
                        </Col>
                      </Row>
                    </div>)
                  })}
                </tbody>
              </Table>
            </Col>
            <Col xs="5">
              <Nav tabs>
                <NavItem>
                  <NavLink href="#" className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                    Añadir
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#" className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                    Editar
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <AddPost updateMyPosts = {this.handleUpdateMyPosts}/>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      {this.state.edit}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        </div>);
  }
}

export default MyPostList;
