import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

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
const PostTable: React.FC<Props> = (props) => {
    let token = localStorage.getItem('token');
    const { blogs, customFunction } = props;
    const [selectedPost, setSelectedPost] = useState<PostData | null>(null);
    const [filteredPost, setFilteredPost] = useState<PostData[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSorting, setIsSorting] = useState(false);
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
    const handleReset = () => {
        setIsFiltering(false);
        openMessageSuccess( "Reset thành công");
        customFunction();

    };
    const handlePostClick = (post: PostData) => {
        setSelectedPost(post);
    };
    const handleCloseModal = () => {
        setSelectedPost(null);
    };
    console.log("hahaha")
    const handleSort = async () => {
        try {
            setIsSorting(true);
            const response = await fetch(`${config.apiUrl}/admin/sort/post/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                openMessageError('Request failed')
                return;
            }

            const data = await response.json();
            const sortedData = [...data].sort((a, b) => {
                return b.countReport - a.countReport;
            });
            setFilteredPost(sortedData);
            setIsFiltering(true);
            openMessageSuccess( "Sắp xếp thành công");
            customFunction();
        } catch (error) {
            openMessageError('Sorting failed')
        } finally {
            setIsSorting(false);
        }
    };

    const handleDeletePost = async (e: React.MouseEvent, post: PostData) => {
        e.stopPropagation();
        const userConfirmed = window.confirm(`Bạn có chắc muốn xóa bài đăng ${post.content}`);
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
                openMessageError('Request failed')
                return;
            }
            await response.json();
            openMessageSuccess( "Xoá bài đăng thành công");
            customFunction();
            if(isFiltering){
                handleSort();
            }
        } catch (error) {
            openMessageError('Delete failed')
        } finally {
            setIsDeleting(false);
        }
    };
    return (
        <>
            {contextHolder}
            <div className="container mb-4">
                <div className="row">
                    <div className="col-md-6">
                        <FontAwesomeIcon icon={faFilter} />Bộ lọc
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSort}
                                disabled={isSorting}
                            >

                                {isSorting ? 'Sorting...' : ' Tốp 10'}
                            </Button>{' '}
                            <Button variant="secondary" size="sm" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </div>
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
                        <div style={{ display: 'flex', justifyContent: 'center' }}>Xoá bài đăng</div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {isFiltering
                    ? filteredPost.map((blog, index) => (
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
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => handleDeletePost(e, blog)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Xoá bài đăng'}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))
                    :Array.isArray(blogs) && blogs.length > 0 ? (
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
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => handleDeletePost(e, blog)}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Xoá bài đăng'}
                                    </Button>
                                </div>
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
        </>
    );
};

export default PostTable;
