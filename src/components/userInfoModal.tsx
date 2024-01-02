import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
interface UserData {
  id: number;
  name: string;
  email: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
interface Props {
  user: UserData | null;
  show: boolean;
  handleClose: () => void;
}
const UserInfoModal: React.FC<Props> = ({ user, show, handleClose }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin tài khoản</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Tài khoản: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Ngày tạo tài khoản: {user.createdAt}</p>
        <p>Ngày thay đổi thông tin gần nhất: {user.updatedAt}</p>
        <p>Trạng thái: {user.status ? 'Active' : 'Inactive'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserInfoModal;
