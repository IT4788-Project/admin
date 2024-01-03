import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
interface PostInfo {
    id: number;
    countLike: number;
    countReport: number;
    countComment: number;
    content: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    fromUserId: number | null;
    withUserId: number | null;
    author: number | null;
}

interface Props {
    post: PostInfo | null;
    show: boolean;
    handleClose: () => void;
}

const PostInfoModal: React.FC<Props> = ({ post, show, handleClose }) => {
    if (!post) return null;
    console.log("ok 1111:" , post);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin bài đăng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Nội dung: {post.content}</p>
                <p>Số like: {post.countLike}</p>
                <p>Số báo cáo: {post.countReport}</p>
                <p>Ngày thay đổi thông tin gần nhất: {post.updatedAt}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PostInfoModal;
