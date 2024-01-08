
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
interface ImageInfo {
    image_path: string;
}

interface PostInfo {
    id: number;
    countLike: number;
    countReport: number;
    countComment: number;
    content: string;
    images : ImageInfo[];
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
    const [imagePaths, setImagePaths] = useState<string[]>([]);
    useEffect(() => {
        if (post && post.images && post.images.length > 0) {
            const paths = post.images.map((image: ImageInfo) => image.image_path);
            console.log("Post:", paths)
            setImagePaths(paths);
        }
    }, [post]);

    if (!post) return null;

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin bài đăng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Nội dung: {post.content}</p>
                <p>Số like: {post.countLike}</p>
                <p>Số báo cáo: {post.countReport}</p>
                <p>Số bình luận: {post.countComment}</p>
                <p>Ảnh:</p>
                <div>
                    {imagePaths.map((image_Path, index) => (
                        <img
                            key={index}
                            src={image_Path}
                            alt={`Image ${index}`}
                            style={{maxWidth: '100%', maxHeight: '200px', marginBottom: '10px'}}
                        />
                    ))}
                </div>

                <p>Ngày thay đổi thông tin gần nhất: {post.updatedAt.substring(0,10)}</p>
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
