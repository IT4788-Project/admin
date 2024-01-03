import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import UserInfoModal from './userInfoModal';
import { getCookie } from '@/getCookie/getCookie';
import { config } from '@/config/config';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostInfoModal from './postInfo';

interface PostData {
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
    blogs: PostData[] | null;
    customFunction: () => void;
}

const PostTable:  React.FC<Props> = (props) => {
    let token = getCookie('token');
    const {blogs, customFunction } = props;
    const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const openMessage = (type: 'success' | 'error', text: string) => {
        messageApi.open({
            key: 'updatable',
            type: 'loading',
            content: 'Loading...',
        });

        setTimeout(() => {
            messageApi.open({
                key: 'updatable',
                type,
                content: text,
                duration: 2,
            });
        }, 500);
    };

    const handlePostClick = (post: PostData) => {
        setSelectedPost(post);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    const handleDeletePost = async (e: React.MouseEvent, post: PostData) => {
        e.stopPropagation();
        const userConfirmed = window.confirm(`Bạn có chắc muốn xóa bài đăng ${post.id}`);

        if (!userConfirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            const response = await fetch(`${config.apiUrl}/admin/deletePost/${post.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                openMessage('error', 'Request failed');
            }

            const deletedUser = await response.json();
            openMessage('success', deletedUser);
            customFunction();
        } catch (error) {
            openMessage('error', 'Xóa bài đăng thất bại');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {contextHolder}
            <div className="container mb-4">
                <div className="row">
                    <div className="col">
                        <h1 className="text-center">Danh sách bài đăng</h1>
                    </div>
                </div>
                <Table striped bordered hover className="custom-table">
                    <thead>
                    <tr>
                        <th style={{display: 'flex', justifyContent: 'center'}}>STT</th>
                        <th style={{display: 'flex', justifyContent: 'center'}}>Nội dung</th>
                        <th style={{display: 'flex', justifyContent: 'center'}}>Số like</th>
                        <th style={{display: 'flex', justifyContent: 'center'}}>Số báo cáo</th>
                        <th style={{display: 'flex', justifyContent: 'center'}}>Xóa bài đăng</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(blogs) && blogs.length > 0 ? (
                        blogs.map((blog, index) => (
                            <tr key={index} onClick={() => handlePostClick(blog)}>
                                <td style={{display: 'flex', justifyContent: 'center'}}>{index + 1}</td>
                                <td style={{display: 'flex', justifyContent: 'center'}}>{blog.content}</td>
                                <td style={{display: 'flex', justifyContent: 'center'}}>{blog.countLike}</td>
                                <td style={{display: 'flex', justifyContent: 'center'}}>{blog.countReport}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        onClick={(e) => handleDeletePost(e, blog)}
                                        disabled={isDeleting}
                                    >
                                        Xóa bài đăng
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>Loading...</td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                <PostInfoModal post={selectedPost} show={selectedPost !== null} handleClose={handleCloseModal} />
            </div>
        </>
    );
};

export default PostTable;
