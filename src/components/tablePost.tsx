import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter} from '@fortawesome/free-solid-svg-icons';
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
    blogs:PostData [];
    customFunction: () => void;
}
const AppPost = (props: Props) => {
    let token = getCookie('token');
    const { blogs, customFunction } = props;
    const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const key = 'updatable';
    const openMessageSuccess = (text:string) => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Loading...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type:'success',
                content: text,
                duration: 2,
            });
        }, 500);
    };
    const openMessageError = (text:string) => {
        messageApi.open({
            key,
            type: 'loading',
            content: 'Loading...',
        });
        setTimeout(() => {
            messageApi.open({
                key,
                type:'error',
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
    const handleDeletePost = async (e: React.MouseEvent, post : PostData) => {
        e.stopPropagation();
        const userConfirmed = window.confirm(`Bạn có chắc muốn xoá tài khoản ${post.id}`);
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
                openMessageError(`Request failed`);
            }
            const deletedUser = await response.json();
            openMessageSuccess( deletedUser);
            customFunction();

        } catch (error) {
            openMessageError('Xoá tài khoản thất bại')
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
                        <th>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>STT</div>
                        </th>
                        <th>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>Nội dung</div>
                        </th>
                        <th>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>Số like</div>
                        </th>
                        <th>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>Số báo cáo</div>
                        </th>
                        <th>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>Xóa bài đăng</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(blogs) && blogs.length > 0 && (
                        blogs.map((blog, index) => (
                        <tr key={index} onClick={() => handlePostClick(blog)}>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>{index + 1}</div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>{blog.content}</div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>{blog.countLike}</div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>{blog.countReport}</div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        variant="danger"
                                        onClick={(e) => handleDeletePost(e, blog)}
                                        disabled={isDeleting}
                                    >
                                        Xoá bài đăng
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )))}
                    </tbody>
                </Table>
                <PostInfoModal post={selectedPost} show={selectedPost !== null} handleClose={handleCloseModal}/>
            </div>
        </>
    );
};

export default AppPost;
